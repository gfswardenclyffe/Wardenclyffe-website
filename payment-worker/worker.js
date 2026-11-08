/**
 * Wardenclyffe test-only payment gateway. No live payments, no legal documents.
 * Cloudflare Worker + D1 + Stripe, PayPal, Openpay MX, manual bank reconciliation + Resend.
 * DO NOT add any real products before legal review and approved document storage.
 */
const TEST_PRODUCT=Object.freeze({sku:'sandbox-demo',name:'Wardenclyffe SANDBOX delivery test (not a legal contract)',cents:100,currency:'usd'});
const OPENPAY_TEST=Object.freeze({amount:10.00,cents:1000,currency:'mxn'}); // MXN 10.00 sandbox charge, unrelated to draft contract pricing
const enc=new TextEncoder();
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...extra}});
function validEmail(email){return typeof email==='string'&&email.length<=180&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
function b64(bytes){const n=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);let s='';for(let i=0;i<n.length;i++)s+=String.fromCharCode(n[i]);return btoa(s)}
function required(env,...keys){const absent=keys.filter(k=>!env[k]);if(absent.length)throw new Error(`Configuration incomplete: ${absent.join(', ')}`)}
function assertSandbox(env){if(env.PAYMENTS_MODE!=='sandbox')throw new Error('Only sandbox mode is supported');required(env,'ORDERS','RESEND_API_KEY','RESEND_FROM','ALLOWED_ORIGIN','FRONTEND_BASE_URL')}
function cors(env,origin){if(origin!==env.ALLOWED_ORIGIN)return {};return {'access-control-allow-origin':origin,'vary':'Origin','access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'content-type','access-control-max-age':'600'}}
function safeUrl(base,path){const b=String(base).replace(/\/$/,'');const u=new URL(`${b}/${path.replace(/^\//,'')}`);if(u.protocol!=='https:')throw new Error('HTTPS return URL required');return u.toString()}
async function parseRequest(req){const txt=await req.text();if(txt.length>8192)throw new Error('Request too large');return JSON.parse(txt)}
async function initOrder(env,{provider,email,currency=TEST_PRODUCT.currency,amount=TEST_PRODUCT.cents}){const id=crypto.randomUUID();await env.ORDERS.prepare('INSERT INTO orders (id,provider,sku,customer_email,currency,amount,status) VALUES (?,?,?,?,?,?,?)')
.bind(id,provider,TEST_PRODUCT.sku,email,currency,amount,'pending').run();return id}
async function checkoutStripe(req,env){assertSandbox(env);required(env,'STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET');if(!String(env.STRIPE_SECRET_KEY).startsWith('sk_test_'))throw new Error('A Stripe test key is required');const body=await parseRequest(req);if(body.sku!==TEST_PRODUCT.sku||!validEmail(body.email))return json({error:'Test-only product and valid email required'},400);
const id=await initOrder(env,{provider:'stripe',email:body.email.trim().toLowerCase()});const params=new URLSearchParams();
const fields={mode:'payment','client_reference_id':id,'customer_email':body.email.trim().toLowerCase(),'line_items[0][quantity]':'1','line_items[0][price_data][currency]':TEST_PRODUCT.currency,'line_items[0][price_data][unit_amount]':String(TEST_PRODUCT.cents),'line_items[0][price_data][product_data][name]':TEST_PRODUCT.name,'metadata[order_id]':id,success_url:safeUrl(env.FRONTEND_BASE_URL,'pages/checkout-return.html?provider=stripe&session_id={CHECKOUT_SESSION_ID}'),cancel_url:safeUrl(env.FRONTEND_BASE_URL,'pages/shop.html?payment=cancelled')};for(const [k,v]of Object.entries(fields))params.set(k,v);
const response=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{Authorization:`Bearer ${env.STRIPE_SECRET_KEY}`,'content-type':'application/x-www-form-urlencoded','Idempotency-Key':`warden-stripe-${id}`},body:params});const result=await response.json();if(!response.ok||!result.id||!result.url)throw new Error('Stripe sandbox checkout unavailable');await env.ORDERS.prepare('UPDATE orders SET provider_order_id=? WHERE id=?').bind(result.id,id).run();return json({checkoutUrl:result.url,orderId:id,mode:'sandbox'})}
async function paypalToken(env){required(env,'PAYPAL_CLIENT_ID','PAYPAL_CLIENT_SECRET');const r=await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token',{method:'POST',headers:{Authorization:'Basic '+b64(enc.encode(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`)),'content-type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials'});const o=await r.json();if(!r.ok||!o.access_token)throw new Error('PayPal sandbox authentication unavailable');return o.access_token}
async function checkoutPaypal(req,env){assertSandbox(env);const body=await parseRequest(req);if(body.sku!==TEST_PRODUCT.sku||!validEmail(body.email))return json({error:'Test-only product and valid email required'},400);const id=await initOrder(env,{provider:'paypal',email:body.email.trim().toLowerCase()});const token=await paypalToken(env);
const payload={intent:'CAPTURE',purchase_units:[{reference_id:id,custom_id:id,description:TEST_PRODUCT.name,amount:{currency_code:'USD',value:'1.00'}}],payment_source:{paypal:{experience_context:{return_url:safeUrl(env.FRONTEND_BASE_URL,'pages/checkout-return.html?provider=paypal'),cancel_url:safeUrl(env.FRONTEND_BASE_URL,'pages/shop.html?payment=cancelled'),user_action:'PAY_NOW'}}}};
const res=await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders',{method:'POST',headers:{Authorization:`Bearer ${token}`,'content-type':'application/json','PayPal-Request-Id':id},body:JSON.stringify(payload)});const obj=await res.json();const link=(obj.links||[]).find(l=>['approve','payer-action'].includes(l.rel));if(!res.ok||!obj.id||!link||!link.href)throw new Error('PayPal sandbox checkout unavailable');await env.ORDERS.prepare('UPDATE orders SET provider_order_id=? WHERE id=?').bind(obj.id,id).run();return json({checkoutUrl:link.href,orderId:id,mode:'sandbox'})}
// Openpay Mexico: API secret NEVER reaches the public browser.
function openpayConfig(env){required(env,'OPENPAY_MERCHANT_ID','OPENPAY_PRIVATE_KEY','OPENPAY_WEBHOOK_USER','OPENPAY_WEBHOOK_PASSWORD');
if(!/^[a-zA-Z0-9]{8,32}$/.test(env.OPENPAY_MERCHANT_ID)||!String(env.OPENPAY_PRIVATE_KEY).startsWith('sk_'))throw new Error('Openpay sandbox credentials are required');
return `https://sandbox-api.openpay.mx/v1/${env.OPENPAY_MERCHANT_ID}`}
async function openpayApi(env,path,options={}){const base=openpayConfig(env);const response=await fetch(base+path,{...options,headers:{'Authorization':'Basic '+b64(enc.encode(env.OPENPAY_PRIVATE_KEY+':')),'Content-Type':'application/json',...(options.headers||{})}});
const data=await response.json();if(!response.ok)throw new Error('Openpay sandbox provider request failed');return data}
function validCustomer(b){return validEmail(b.email)&&typeof b.firstName==='string'&&b.firstName.trim().length>=2&&b.firstName.length<=80&&typeof b.lastName==='string'&&b.lastName.trim().length>=2&&b.lastName.length<=80&&typeof b.phone==='string'&&/^[+()\d\s-]{7,24}$/.test(b.phone)}
async function checkoutOpenpay(req,env,method){assertSandbox(env);openpayConfig(env);const body=await parseRequest(req);
if(body.sku!==TEST_PRODUCT.sku||!validCustomer(body))return json({error:'Name, surname, phone and email are required for the Openpay sandbox test'},400);
const provider=method==='card'?'openpay_card':'openpay_spei';
const id=await initOrder(env,{provider,email:body.email.trim().toLowerCase(),currency:OPENPAY_TEST.currency,amount:OPENPAY_TEST.cents});
const charge={method:method==='card'?'card':'bank_account',amount:OPENPAY_TEST.amount,currency:'MXN',order_id:id,description:'Wardenclyffe sandbox non-legal delivery test',customer:{name:body.firstName.trim(),last_name:body.lastName.trim(),phone_number:body.phone.trim(),email:body.email.trim().toLowerCase()}};
if(method==='card'){charge.confirm=false;charge.send_email=false;charge.redirect_url=safeUrl(env.FRONTEND_BASE_URL,'pages/checkout-return.html?provider=openpay')}
const result=await openpayApi(env,'/charges',{method:'POST',body:JSON.stringify(charge)});
if(!result.id||result.order_id!==id)throw new Error('Unexpected Openpay response');
await env.ORDERS.prepare('UPDATE orders SET provider_order_id=? WHERE id=?').bind(result.id,id).run();
if(method==='card'){const href=result.payment_method?.url;const url=href?new URL(href):null;if(!url||url.protocol!=='https:'||url.hostname!=='sandbox-api.openpay.mx')throw new Error('Unexpected Openpay hosted payment URL');return json({checkoutUrl:url.href,orderId:id,mode:'sandbox',currency:'MXN',amount:OPENPAY_TEST.amount})}
const detail=result.payment_method||{};
return json({orderId:id,status:'awaiting_transfer',mode:'sandbox',currency:'MXN',amount:OPENPAY_TEST.amount,transfer:{bank:String(detail.bank||'BBVA'),clabe:String(detail.clabe||''),reference:String(detail.name||''),agreement:String(detail.agreement||'')}})
}
// Openpay notifications are basic-auth protected, AND each completed charge is independently re-fetched from Openpay.
// Notification payload alone is never trusted to trigger delivery.
function secureEquals(a,b){if(typeof a!=='string'||typeof b!=='string')return false;let v=a.length^b.length;const len=Math.max(a.length,b.length);for(let i=0;i<len;i++)v|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return v===0}
async function openpayWebhook(req,env){assertSandbox(env);openpayConfig(env);const expected='Basic '+b64(enc.encode(env.OPENPAY_WEBHOOK_USER+':'+env.OPENPAY_WEBHOOK_PASSWORD));
if(!secureEquals(req.headers.get('authorization'),expected))return json({error:'Unauthorized'},401);
const payload=await parseRequest(req);if(payload.type==='verification'){const code=String(payload.verification_code||'');if(!/^[A-Za-z0-9_-]{4,60}$/.test(code))return json({error:'Invalid verification code'},400);await env.ORDERS.prepare('INSERT INTO webhook_verifications (provider,verification_code) VALUES (?,?)').bind('openpay',code).run();return json({received:true});}
if(payload.type!=='charge.succeeded')return json({received:true});
const tx=payload.transaction||payload.data||{};const chargeId=String(tx.id||'');if(!/^[a-zA-Z0-9]{8,40}$/.test(chargeId))return json({error:'Invalid charge'},400);
const order=await env.ORDERS.prepare('SELECT * FROM orders WHERE provider_order_id=? AND provider IN (?,?)').bind(chargeId,'openpay_card','openpay_spei').first();
if(!order)return json({error:'Unknown order'},404);
const verified=await openpayApi(env,`/charges/${encodeURIComponent(chargeId)}`);
if(verified.id!==chargeId||verified.order_id!==order.id||verified.status!=='completed'||verified.currency!=='MXN'||Math.round(Number(verified.amount)*100)!==order.amount||order.currency!=='mxn'||verified.transaction_type!=='charge'||verified.method!==(order.provider==='openpay_card'?'card':'bank_account'))return json({error:'Charge could not be verified'},409);
await deliver(env,order);return json({received:true,verified:true})}
// Chase and BBVA direct transfers: no public bank details, no fulfillment on customer claims or screenshots.
// A separate authorized reconciliation step must match cleared bank ledger funds and the exact order reference.
async function checkoutBank(req,env){assertSandbox(env);const body=await parseRequest(req);
if(body.sku!==TEST_PRODUCT.sku||!validEmail(body.email)||!['chase','bbva'].includes(body.bank))return json({error:'Invalid transfer request'},400);
const provider=body.bank==='chase'?'bank_chase':'bank_bbva';const currency=provider==='bank_chase'?'usd':'mxn';
const amount=currency==='usd'?TEST_PRODUCT.cents:OPENPAY_TEST.cents;
const id=await initOrder(env,{provider,email:body.email.trim().toLowerCase(),currency,amount});
return json({status:'awaiting_bank_verification',orderId:id,reference:'WARDEN-'+id.slice(0,8).toUpperCase(),bank:body.bank,currency:currency.toUpperCase(),amount:amount/100,notice:'Bank instructions must be confirmed with Wardenclyffe; no account details are published or document sent until the funds clear.'})
}
// Administrative receipt confirmation requires an independent ledger check by an authorized person.
async function confirmBank(req,env){assertSandbox(env);required(env,'BANK_RECONCILIATION_TOKEN');
if(!secureEquals(req.headers.get('authorization'),'Bearer '+env.BANK_RECONCILIATION_TOKEN))return json({error:'Unauthorized'},401);
const body=await parseRequest(req);if(!body.ledgerVerified||typeof body.bankTransactionId!=='string'||body.bankTransactionId.trim().length<8||body.bankTransactionId.length>120||typeof body.reviewer!=='string'||body.reviewer.trim().length<3||body.reviewer.length>100||!/^[-a-f0-9]{36}$/i.test(String(body.orderId||'')))return json({error:'Bank ledger verification reference required'},400);
const order=await env.ORDERS.prepare('SELECT * FROM orders WHERE id=?').bind(body.orderId).first();
if(!order||!['bank_chase','bank_bbva'].includes(order.provider))return json({error:'No matching bank order'},404);
if(order.status==='fulfilled')return json({status:'already_fulfilled'});
if(body.currency!==order.currency||body.amountMinor!==order.amount||body.bank!==(order.provider==='bank_chase'?'chase':'bbva'))return json({error:'Ledger amount, currency or bank does not match this order'},409);
try{await env.ORDERS.prepare('INSERT INTO bank_reconciliations (order_id,bank_transaction_id,bank_currency,bank_amount,reviewer) VALUES (?,?,?,?,?)').bind(order.id,body.bankTransactionId.trim(),order.currency,order.amount,body.reviewer.trim()).run()}catch(error){return json({error:'Bank transfer reference was already reconciled or could not be stored'},409)}
await deliver(env,order);return json({status:'fulfilled',reference:order.id})}
async function verifyStripe(payload,header,secret,nowSeconds=Math.floor(Date.now()/1000)){
if(typeof header!=='string')return false;const parts=header.split(',').map(v=>v.trim().split('='));const t=parts.find(p=>p[0]==='t')?.[1],signs=parts.filter(p=>p[0]==='v1').map(p=>p[1]);if(!/^\d+$/.test(t||'')||Math.abs(nowSeconds-Number(t))>300||!signs.length)return false;
const key=await crypto.subtle.importKey('raw',enc.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const sig=await crypto.subtle.sign('HMAC',key,enc.encode(`${t}.${payload}`));const actual=[...new Uint8Array(sig)].map(x=>x.toString(16).padStart(2,'0')).join('');return signs.some(s=>s.length===actual.length&&s===actual)}
function sampleAttachment(){const content=`WARDENCLYFFE — PAYMENT SANDBOX SAMPLE\n\nThis is a test document only.\nIt is not a contract and has no legal effect.\nNo professional engagement, representation, or legal document is provided.\n\nThis sample proves email attachment delivery after payment verification in the sandbox.\n`;return{filename:'Wardenclyffe_Sandbox_Sample.txt',content:b64(enc.encode(content))}}
async function deliver(env,order){if(order.status==='fulfilled')return 'already fulfilled';if(order.status!=='pending'&&order.status!=='failed')return 'processing';
const locked=await env.ORDERS.prepare("UPDATE orders SET status='processing',last_error=NULL WHERE id=? AND status IN ('pending','failed')").bind(order.id).run();if(locked.meta?.changes!==1)return 'already in progress';
try{let attachment;
if(order.sku==='sandbox-demo')attachment=sampleAttachment();
else {if(!env.CONTRACT_FILES)throw new Error('Private document storage is not configured');const file=await env.CONTRACT_FILES.get(`approved/${order.sku}.pdf`);if(!file)throw new Error('Approved contract not found');attachment={filename:`Wardenclyffe_${order.sku}.pdf`,content:b64(await file.arrayBuffer())}}
const payload={from:env.RESEND_FROM,to:[order.customer_email],subject:order.sku==='sandbox-demo'?'Wardenclyffe — sandbox purchase test':'Your Wardenclyffe document',html:`<p>Thank you for your ${order.sku==='sandbox-demo'?'sandbox test':'purchase'}.</p><p>Your document is attached. Order reference: <strong>${order.id}</strong>.</p>${order.sku==='sandbox-demo'?'<p><strong>This is not a legal contract.</strong> No real charge or professional service occurred.</p>':''}<p>Wardenclyffe · info@wardenclyffefirm.com</p>`,attachments:[attachment]};
const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'content-type':'application/json','Idempotency-Key':`warden-order-${order.id}`},body:JSON.stringify(payload)});const result=await response.json();if(!response.ok||!result.id)throw new Error('Email service unavailable');await env.ORDERS.prepare("UPDATE orders SET status='fulfilled',fulfilled_at=CURRENT_TIMESTAMP WHERE id=?").bind(order.id).run();return 'fulfilled'}catch(error){await env.ORDERS.prepare("UPDATE orders SET status='failed',last_error=? WHERE id=?").bind(String(error.message||'Delivery failed').slice(0,250),order.id).run();throw error}}
async function stripeWebhook(req,env){assertSandbox(env);required(env,'STRIPE_WEBHOOK_SECRET');const raw=await req.text();if(raw.length>300000)return json({error:'Payload too large'},413);const ok=await verifyStripe(raw,req.headers.get('stripe-signature'),env.STRIPE_WEBHOOK_SECRET);if(!ok)return json({error:'Signature verification failed'},400);const event=JSON.parse(raw);
if(!['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(event.type))return json({received:true});const session=event.data?.object;if(session?.payment_status!=='paid')return json({received:true,reason:'payment not settled'});const order=await env.ORDERS.prepare('SELECT * FROM orders WHERE provider=? AND provider_order_id=?').bind('stripe',session.id).first();if(!order)return json({error:'Unknown order'},404);if(session.client_reference_id!==order.id||session.amount_total!==order.amount||session.currency!==order.currency) return json({error:'Amount or order mismatch'},400);await deliver(env,order);return json({received:true})}
async function paypalCapture(req,env){assertSandbox(env);const body=await parseRequest(req);const id=String(body.orderId||'');if(!/^[A-Za-z0-9]{8,32}$/.test(id))return json({error:'Invalid order'},400);
const order=await env.ORDERS.prepare('SELECT * FROM orders WHERE provider=? AND provider_order_id=?').bind('paypal',id).first();if(!order)return json({error:'Unknown order'},404);if(order.status==='fulfilled')return json({status:'fulfilled'});
const token=await paypalToken(env);const opts={method:'POST',headers:{Authorization:`Bearer ${token}`,'content-type':'application/json','PayPal-Request-Id':`capture-${order.id}`}};
let res=await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${id}/capture`,opts);let result=await res.json();
if(!res.ok){res=await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${id}`,{headers:{Authorization:`Bearer ${token}`}});result=await res.json();if(!res.ok)throw new Error('PayPal order cannot be verified')}
const capture=result.purchase_units?.flatMap(p=>p.payments?.captures||[])?.find(c=>c.status==='COMPLETED'&&c.amount?.currency_code==='USD'&&c.amount?.value==='1.00');const match=result.purchase_units?.some(p=>p.reference_id===order.id||p.custom_id===order.id);if(!match||!capture||!['COMPLETED','APPROVED'].includes(result.status))return json({error:'PayPal capture not verified'},400);
await deliver(env,order);return json({status:'verified',delivery:'email attempted after verified payment'})}
export default {async fetch(req,env){const url=new URL(req.url),origin=req.headers.get('origin')||'',headers=cors(env,origin);if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
try{if(url.pathname==='/health'&&req.method==='GET')return json({service:'Wardenclyffe payment sandbox',livePayments:false},200,headers);
if(url.pathname==='/api/webhooks/stripe'&&req.method==='POST')return await stripeWebhook(req,env);
if(url.pathname==='/api/webhooks/openpay'&&req.method==='POST')return await openpayWebhook(req,env);
if(url.pathname==='/api/admin/bank/confirm'&&req.method==='POST')return await confirmBank(req,env);
if(url.pathname.startsWith('/api/')&&origin!==env.ALLOWED_ORIGIN)return json({error:'Origin not allowed'},403);
if(req.method==='POST'&&url.pathname==='/api/checkout/stripe')return withHeaders(await checkoutStripe(req,env),headers);
if(req.method==='POST'&&url.pathname==='/api/checkout/paypal')return withHeaders(await checkoutPaypal(req,env),headers);
if(req.method==='POST'&&url.pathname==='/api/checkout/paypal/capture')return withHeaders(await paypalCapture(req,env),headers);
if(req.method==='POST'&&url.pathname==='/api/checkout/openpay/card')return withHeaders(await checkoutOpenpay(req,env,'card'),headers);
if(req.method==='POST'&&url.pathname==='/api/checkout/openpay/spei')return withHeaders(await checkoutOpenpay(req,env,'spei'),headers);
if(req.method==='POST'&&url.pathname==='/api/checkout/bank')return withHeaders(await checkoutBank(req,env),headers);
return json({error:'Not found'},404,headers)}catch(error){console.error('Payment service error:',String(error.message||error));return json({error:'Payment service unavailable; no new charge was initiated by this request unless a provider has already accepted the order.'},503,headers)}}};
function withHeaders(response,extra){const h=new Headers(response.headers);for(const [k,v] of Object.entries(extra))h.set(k,v);return new Response(response.body,{status:response.status,headers:h})}
export {verifyStripe,validEmail,validCustomer,secureEquals,TEST_PRODUCT,OPENPAY_TEST,openpayWebhook};
