/* Wardenclyffe private sandbox Order Desk. No real client orders or document delivery. */
import {createHash,timingSafeEqual} from 'node:crypto';
import {getStore} from '@netlify/blobs';
import {respond} from './_shared/common.mjs';
const PREFIX='verified/';
const STATES=['new','reviewing','validated','closed'];
function authorized(req,env){
 const token=(req.headers.get('authorization')||'').match(/^Bearer ([a-fA-F0-9]{64})$/)?.[1];
 const expected=env.OMS_ADMIN_TOKEN;
 if(!token||!expected||!/[a-fA-F0-9]{64}/.test(expected)||expected.length!==64)return false;
 return timingSafeEqual(createHash('sha256').update(token).digest(),createHash('sha256').update(expected).digest());
}
function publicOrder(record){
 return {provider:record.provider,reference:record.providerOrderId,customerEmail:record.customerEmail,
 paidAt:record.paidAt,notificationStatus:record.status,notifiedAt:record.notifiedAt||null,
 operationalStatus:STATES.includes(record.operationalStatus)?record.operationalStatus:'new',
 note:String(record.note||'').slice(0,1200),history:Array.isArray(record.history)?record.history.slice(-30):[],
 fulfillmentRequired:false,documentStatus:'sandbox_no_document_due'};
}
export async function serve(req,{env=process.env,store}={}){
 if(env.PAYMENTS_MODE!=='sandbox')return respond({error:'Unavailable outside sandbox'},503);
 if(!env.OMS_ADMIN_TOKEN)return respond({error:'Order Desk access not configured'},503);
 if(!authorized(req,env))return respond({error:'Unauthorized'},401);
 if(!['GET','PATCH'].includes(req.method))return respond({error:'Method not allowed'},405);
 if(!store)store=getStore('wardenclyffe-sandbox-orders');
 if(req.method==='GET'){
  const {blobs}=await store.list({prefix:PREFIX});
  const rows=await Promise.all(blobs.slice(-300).map(async b=>{
   const value=await store.get(b.key,{type:'json',consistency:'strong'});
   return value?.sku==='sandbox-demo'&&value.providerOrderId?publicOrder(value):null;
  }));
  return respond({mode:'sandbox',orders:rows.filter(Boolean).sort((a,b)=>String(b.paidAt).localeCompare(String(a.paidAt))).slice(0,100)});
 }
 const raw=await req.text();if(raw.length>3000)return respond({error:'Too large'},413);
 let body;try{body=JSON.parse(raw)}catch{return respond({error:'Invalid JSON'},400)}
 const {provider,reference,status,note}=body||{};
 if(!['stripe','paypal'].includes(provider)||!(/^[a-zA-Z0-9_-]{8,255}$/).test(reference||'')||
    !STATES.includes(status)||typeof note!=='string'||note.length>1200)
  return respond({error:'Invalid order update'},400);
 const key=PREFIX+provider+'/'+reference;
 const current=await store.getWithMetadata(key,{type:'json',consistency:'strong'});
 if(!current?.data)return respond({error:'Order not found'},404);
 const old=typeof current.data==='string'?JSON.parse(current.data):current.data;
 if(old.sku!=='sandbox-demo'||old.provider!==provider||old.providerOrderId!==reference)return respond({error:'Order not found'},404);
 const now=new Date().toISOString();
 const updated={...old,operationalStatus:status,note:note.trim(),updatedAt:now,
 history:[...(Array.isArray(old.history)?old.history.slice(-29):[]),{at:now,from:old.operationalStatus||'new',to:status,note:note.trim()}]};
 const write=await store.setJSON(key,updated,{onlyIfMatch:current.etag});
 if(!write.modified)return respond({error:'Another editor changed the record. Refresh and retry.'},409);
 return respond({order:publicOrder(updated),note:'No actual document delivery or customer message was initiated.'});
}
export default async req=>{try{return await serve(req)}catch(e){console.error('Order Desk',e?.message);return respond({error:'Order Desk unavailable'},503)}};
