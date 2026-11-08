import {SAMPLE,requireMode,respond} from './_shared/common.mjs';
export default async(req)=>{
if(req.method!=='GET')return respond({error:'Method not allowed'},405);
try{requireMode('stripe');const id=new URL(req.url).searchParams.get('session_id');if(!/^cs_test_[a-zA-Z0-9_]{8,250}$/.test(id||''))return respond({error:'Invalid sandbox session'},400);
const r=await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}`,{headers:{authorization:`Bearer ${process.env.STRIPE_SECRET_KEY}`}});const data=await r.json();if(!r.ok)throw Error('Unable to retrieve Stripe session');
const match=data.metadata?.sku===SAMPLE.sku&&data.amount_total===SAMPLE.amount&&data.currency===SAMPLE.currency;
return respond({provider:'stripe',paid:match&&data.payment_status==='paid',status:match?data.payment_status:'invalid_order',mode:'sandbox'});
}catch(e){console.error('Stripe status:',e.message);return respond({error:'Unable to verify sandbox payment'},503)}
};
