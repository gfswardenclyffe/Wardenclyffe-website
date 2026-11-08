import {createHmac,timingSafeEqual} from 'node:crypto';
import {SAMPLE,respond} from './_shared/common.mjs';
export function signatureValid(raw,header,secret,now=Math.floor(Date.now()/1000)){
if(!header||!secret)return false;const parts=Object.fromEntries(header.split(',').map(x=>x.trim().split('=',2)));const timestamp=Number(parts.t);if(!Number.isInteger(timestamp)||Math.abs(now-timestamp)>300)return false;
const computed=createHmac('sha256',secret).update(`${timestamp}.${raw}`).digest('hex'),received=parts.v1;
if(typeof received!=='string'||received.length!==computed.length)return false;
return timingSafeEqual(Buffer.from(received,'utf8'),Buffer.from(computed,'utf8'));
}
export default async(req)=>{
if(req.method!=='POST')return respond({error:'Method not allowed'},405);
if(process.env.PAYMENTS_MODE!=='sandbox'||!process.env.STRIPE_WEBHOOK_SECRET)return respond({error:'Webhook not configured'},503);
const raw=await req.text();if(raw.length>300000)return respond({error:'Too large'},413);
if(!signatureValid(raw,req.headers.get('stripe-signature'),process.env.STRIPE_WEBHOOK_SECRET))return respond({error:'Unverified webhook'},400);
let event;try{event=JSON.parse(raw)}catch{return respond({error:'Malformed webhook'},400)}
if(event.type==='checkout.session.completed'||event.type==='checkout.session.async_payment_succeeded'){
const session=event.data?.object;const verified=session?.payment_status==='paid'&&session.amount_total===SAMPLE.amount&&session.currency==='usd'&&session.metadata?.sku===SAMPLE.sku;
if(verified){console.info('VERIFIED SANDBOX PAYMENT',session.id,'NO CONTRACT SENT');return respond({received:true,paid:true,fulfillment:'disabled_pending_document_approval'})}
return respond({received:true,paid:false});}
return respond({received:true});
};
