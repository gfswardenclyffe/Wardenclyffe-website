import {baseUrl,createPayload,paypalToken,respond,validCheckoutUrl} from './_shared/common.mjs';
export default async(req)=>{
if(req.method!=='POST')return respond({error:'Method not allowed'},405);
try{await createPayload(req);const token=await paypalToken(),base=baseUrl(),id=crypto.randomUUID();
const data={intent:'CAPTURE',purchase_units:[{reference_id:'sandbox-demo',custom_id:id,description:'Wardenclyffe nonlegal test sample',amount:{currency_code:'USD',value:'1.00'}}],payment_source:{paypal:{experience_context:{return_url:`${base}/pages/checkout-return.html?provider=paypal`,cancel_url:`${base}/pages/shop.html?payment=cancelled`,user_action:'PAY_NOW'}}}};
const r=await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders',{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json','PayPal-Request-Id':id},body:JSON.stringify(data)});const result=await r.json(),url=result.links?.find(x=>x.rel==='approve'||x.rel==='payer-action')?.href;
if(!r.ok||!result.id||!url||!validCheckoutUrl(url,'paypal'))throw Error('PayPal could not create sandbox order');
return respond({checkoutUrl:url,mode:'sandbox',sampleAmount:100,currency:'usd'});
}catch(e){console.error('PayPal checkout:',e.message);return respond({error:'Unable to start PayPal sandbox checkout.'},503)}
};
