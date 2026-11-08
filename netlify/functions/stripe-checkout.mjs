import {SAMPLE,baseUrl,createPayload,requireMode,respond,validCheckoutUrl} from './_shared/common.mjs';
export default async(req)=>{
if(req.method!=='POST')return respond({error:'Method not allowed'},405);
try{
requireMode('stripe');const {email,locale}=await createPayload(req),base=baseUrl();const body=new URLSearchParams({
mode:'payment',customer_email:email,'line_items[0][quantity]':'1','line_items[0][price_data][currency]':'usd',
'line_items[0][price_data][unit_amount]':String(SAMPLE.amount),'line_items[0][price_data][product_data][name]':SAMPLE.name,
'metadata[sku]':SAMPLE.sku,'metadata[test_only]':'true','metadata[locale]':locale,
success_url:`${base}/pages/checkout-return.html?provider=stripe&session_id={CHECKOUT_SESSION_ID}`,
cancel_url:`${base}/pages/shop.html?payment=cancelled`});
const r=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{authorization:`Bearer ${process.env.STRIPE_SECRET_KEY}`,'content-type':'application/x-www-form-urlencoded','Idempotency-Key':`warden-sandbox-${crypto.randomUUID()}`},body});const data=await r.json();
if(!r.ok||!data.id||!validCheckoutUrl(data.url,'stripe'))throw Error('Stripe could not create the sandbox session');
return respond({checkoutUrl:data.url,mode:'sandbox',sampleAmount:100,currency:'usd'});
}catch(e){console.error('Stripe sandbox checkout:',e.message);return respond({error:'Unable to start test checkout. Check Netlify sandbox settings.'},503)}
};
