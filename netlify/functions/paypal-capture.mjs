import {paypalToken,respond,input} from './_shared/common.mjs';
const expected=p=>p?.purchase_units?.some(u=>u.reference_id==='sandbox-demo'&&u.amount?.currency_code==='USD'&&u.amount?.value==='1.00');
const paid=p=>expected(p)&&p.purchase_units?.some(u=>u.payments?.captures?.some(c=>c.status==='COMPLETED'&&c.amount?.currency_code==='USD'&&c.amount?.value==='1.00'));
export default async(req)=>{
if(req.method!=='POST')return respond({error:'Method not allowed'},405);
try{const {orderId}=await input(req);if(typeof orderId!=='string'||!/^[A-Z0-9]{8,40}$/.test(orderId))return respond({error:'Invalid PayPal order ID'},400);
const token=await paypalToken();const get=()=>fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`,{headers:{authorization:`Bearer ${token}`}});
const lookup=await get(),order=await lookup.json();if(!lookup.ok||!expected(order))return respond({error:'The sandbox order does not match the test sample'},400);
if(paid(order))return respond({provider:'paypal',paid:true,status:'COMPLETED',mode:'sandbox'});
if(order.status!=='APPROVED')return respond({provider:'paypal',paid:false,status:order.status||'PENDING',mode:'sandbox'});
const r=await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json','PayPal-Request-Id':`warden-capture-${orderId}`},body:'{}'});let capture=await r.json();
if(!r.ok){const retry=await get();capture=await retry.json();if(!retry.ok)throw Error('Capture status could not be verified')}
return respond({provider:'paypal',paid:Boolean(paid(capture)),status:paid(capture)?'COMPLETED':'PENDING',mode:'sandbox'});
}catch(e){console.error('PayPal capture:',e.message);return respond({error:'PayPal sandbox payment could not be verified.'},503)}
};
