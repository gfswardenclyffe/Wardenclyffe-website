import test from 'node:test';
import assert from 'node:assert/strict';
import {serve} from '../order-desk.mjs';

const secret='a'.repeat(64);
const env={PAYMENTS_MODE:'sandbox',OMS_ADMIN_TOKEN:secret};
const base='https://wardenclyffe-preview.netlify.app/.netlify/functions/order-desk';
function request(method='GET',data,auth=secret){
 return new Request(base,{method,headers:{authorization:'Bearer '+auth,...(data?{'content-type':'application/json'}:{})},body:data?JSON.stringify(data):undefined});
}
function fakeStore(){
 let etag='"initial';
 let record={provider:'stripe',providerOrderId:'cs_test_1234567890',customerEmail:'client@example.org',sku:'sandbox-demo',
 paidAt:'2026-11-08T21:00:00.000Z',status:'notifications_sent'};
 return {list:async()=>({blobs:[{key:'verified/stripe/cs_test_1234567890'}]}),
 get:async()=>record,
 getWithMetadata:async()=>({data:record,etag}),
 setJSON:async(k,v,o)=>{if(o.onlyIfMatch!==etag)return {modified:false};record=v;etag='next';return {modified:true}}};
}
test('Order Desk rejects public access and production mode',async()=>{
 assert.equal((await serve(request('GET',undefined,'b'.repeat(64)),{env,store:fakeStore()})).status,401);
 assert.equal((await serve(request(),{env:{...env,PAYMENTS_MODE:'live'},store:fakeStore()})).status,503);
});
test('Order Desk lists only verified sandbox payments',async()=>{
 const response=await serve(request(),{env,store:fakeStore()});
 assert.equal(response.status,200);const data=await response.json();
 assert.equal(data.orders[0].reference,'cs_test_1234567890');
 assert.equal(data.orders[0].fulfillmentRequired,false);
 assert.equal(data.orders[0].operationalStatus,'new');
});
test('Order Desk updates review notes and keeps legal delivery disabled',async()=>{
 const store=fakeStore();
 const patch=await serve(request('PATCH',{provider:'stripe',reference:'cs_test_1234567890',status:'reviewing',note:'Verified email layout.'}),{env,store});
 assert.equal(patch.status,200);const data=await patch.json();
 assert.equal(data.order.operationalStatus,'reviewing');
 assert.equal(data.order.history.length,1);
 assert.equal(data.order.fulfillmentRequired,false);
 assert.equal(data.order.documentStatus,'sandbox_no_document_due');
});
test('Order Desk prevents invalid status and overlong notes',async()=>{
 const store=fakeStore();
 for(const payload of [{provider:'stripe',reference:'cs_test_1234567890',status:'delivered',note:''},
 {provider:'stripe',reference:'cs_test_1234567890',status:'closed',note:'x'.repeat(1201)}]){
 const r=await serve(request('PATCH',payload),{env,store});assert.equal(r.status,400)}
});
