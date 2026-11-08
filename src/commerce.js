/* Wardenclyffe V4.8 – gateway selection, safe sandbox checkout, demo walkthrough. */
(()=>{'use strict';
const contractList=[
['nda','Non-Disclosure Agreement','business',39,'us mx eu'],
['services','Professional Services Agreement','employment',69,'us mx eu'],
['consultant','Independent Contractor Agreement','employment',59,'us mx eu'],
['employment','Employment Agreement','employment',79,'us mx eu'],
['lease','Commercial Lease Agreement','property',79,'us mx eu'],
['purchase','Purchase & Sale Agreement','property',89,'us mx eu'],
['loan','Loan & Promissory Note','property',59,'us mx eu'],
['shareholders','Shareholders’ Agreement','business',129,'us mx eu'],
['debt','Debt Settlement & Payment Plan','business',69,'us mx eu'],
['software','Software Development Agreement','technology',99,'us mx eu'],
['saas','SaaS & Software License','technology',119,'us mx eu'],
['ipassignment','Intellectual Property Assignment','technology',89,'us mx eu'],
['data-processing','Data Processing Agreement','technology',99,'us eu'],
['distribution','Distribution Agreement','business',129,'us mx eu'],
['settlement','Settlement & Release Agreement','business',79,'us mx eu']
].map(([id,title,category,price,regions])=>({id,title,category,price,regions:regions.split(' ')}));
const region=document.getElementById('contract-region'),category=document.getElementById('contract-category'),grid=document.getElementById('contract-products');
const dialog=document.getElementById('checkout-dialog'),form=document.getElementById('checkout-form'),msg=document.getElementById('checkout-message');
if(!region||!category||!grid||!dialog||!form)return;
const primary=document.getElementById('checkout-primary'),demo=document.getElementById('checkout-demo');
const gatewayChoices=document.getElementById('gateway-choices'),identity=document.getElementById('openpay-customer-fields'),paymentCountry=document.getElementById('payment-country');
const sampleNote=document.getElementById('gateway-sample-note');
let chosen=null, busy=false;
const config=window.WARDEN_COMMERCE||{mode:'preview',apiBase:'',paymentsEnabled:false};
const api=String(config.apiBase||'').replace(/\/$/,'');
const sandboxReady=config.mode==='sandbox'&&api.startsWith('https://');
const methods={
stripe:{name:'Card · Apple Pay · Google Pay',countries:['us','mx','other'],endpoint:'stripe',amount:'$1 USD',redirect:true},
paypal:{name:'PayPal',countries:['us','mx','other'],endpoint:'paypal',amount:'$1 USD',redirect:true},
openpay_card:{name:'Openpay · Cards in Mexico',countries:['mx'],endpoint:'openpay/card',amount:'MXN $10',redirect:true},
openpay_spei:{name:'Openpay · SPEI reference',countries:['mx'],endpoint:'openpay/spei',amount:'MXN $10',redirect:false},
bank_chase:{name:'Chase · Bank transfer (US)',countries:['us'],endpoint:'bank',amount:'$1 USD',redirect:false},
bank_bbva:{name:'BBVA · Direct bank transfer (MX)',countries:['mx'],endpoint:'bank',amount:'MXN $10',redirect:false}
};
const e=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node};
function selectedGateway(){return form.querySelector('input[name="gateway"]:checked')?.value||'stripe'}
function drawProducts(){grid.replaceChildren();const list=contractList.filter(p=>p.regions.includes(region.value)&&(category.value==='all'||p.category===category.value));
for(const p of list){const tile=e('article','product-tile'),tag=e('span','tag',p.category.replace('-',' ').toUpperCase()),head=e('h3','',p.title),body=e('p','',`Select the applicable ${region.value==='us'?'U.S. state':region.value==='mx'?'Mexican state':'European country'} before ordering. Documents are not yet approved for sale.`),price=e('span','product-price',`Draft price · $${p.price} USD`),button=e('button','','Explore checkout options ↗');button.type='button';button.addEventListener('click',()=>openProduct(p));tile.append(tag,head,body,price,button);grid.append(tile)}
if(!list.length)grid.append(e('p','','No contracts match this selection.'))}
function openProduct(p){chosen=p;document.getElementById('checkout-product-name').textContent=p.title;document.getElementById('checkout-price').textContent=`Proposed: $${p.price} USD`;
form.reset();paymentCountry.value=region.value==='mx'?'mx':'us';form.elements.jurisdiction.placeholder=region.value==='us'?'e.g., Texas':region.value==='mx'?'e.g., Nuevo León':'e.g., France';msg.textContent='';document.getElementById('delivery-example').hidden=true;document.getElementById('checkout-demo-result').hidden=true;updateUI();dialog.showModal()}
function updateUI(){const path=form.elements.path.value,country=paymentCountry.value;let gateway=selectedGateway();
for(const label of gatewayChoices.querySelectorAll('[data-method]')){const id=label.dataset.method;const supported=methods[id]?.countries.includes(country);label.hidden=!supported;label.querySelector('input').disabled=!supported}
if(!methods[gateway]?.countries.includes(country)){const next=country==='mx'?'openpay_card':'stripe';form.querySelector(`input[value="${next}"]`).checked=true;gateway=next}
const self=path==='template';document.getElementById('payment-step').hidden=!self;
identity.hidden=!(self&&gateway.startsWith('openpay_'));
for(const input of identity.querySelectorAll('input'))input.required=self&&gateway.startsWith('openpay_');
primary.textContent=self?(sandboxReady?`Continue with ${methods[gateway].name} ↗`:'Preview checkout options ↗'):(path==='customize'?'Request a customization quote ↗':'Request professional review ↗');
demo.hidden=!self;sampleNote.textContent=self?`Sandbox sample only: ${methods[gateway].amount}. The proposed $${chosen?.price||'—'} contract price is NOT charged. No contract is delivered until an approved product is published.`:'Professional services are quoted and accepted after reviewing the inquiry; there is no immediate payment.';
}
function inquiry(){const email=form.elements.email.value.trim(),jurisdiction=form.elements.jurisdiction.value.trim(),path=form.elements.path.value;
const subject=encodeURIComponent(`Wardenclyffe · ${path==='customize'?'Customization':'Legal review'} · ${chosen.title}`);
const body=encodeURIComponent(`Hello Wardenclyffe,\n\nI would like to request ${path} for: ${chosen.title}.\nJurisdiction: ${jurisdiction}\nContact: ${email}\n\nPlease confirm availability, fees, scope, and next steps.\n`);
window.location.href=`mailto:info@wardenclyffefirm.com?subject=${subject}&body=${body}`;
msg.textContent='Your email application should open with an inquiry draft. No payment has been collected.';
}
function sampleWalkthrough(){const gateway=selectedGateway(),label=methods[gateway],out=document.getElementById('checkout-demo-result');out.hidden=false;out.replaceChildren();
out.append(e('strong','','Walkthrough — simulation only'));
const ol=e('ol');const steps=['Customer selects the service and jurisdiction.',`Choose ${label.name} — ${label.amount} test price only.`,gateway.includes('bank')||gateway.includes('spei')?'Create a payment reference; await verified cleared funds.':'Redirect securely to the payment provider; customer completes test payment.','Payment server independently verifies the paid amount, currency, order and provider.','After verification, the sample file is attached to an email through Resend.','Order status becomes fulfilled and the customer receives a receipt.'];for(const step of steps)ol.append(e('li','',step));out.append(ol,e('p','','No real order was created, no provider was contacted, and no email was sent.'));
document.getElementById('delivery-example').hidden=false;msg.textContent='Interactive demonstration completed. To run a real sandbox transaction, connect your private payment backend and test credentials.';}
async function begin(event){event.preventDefault();if(busy||!chosen||!form.reportValidity())return;
if(form.elements.path.value!=='template'){inquiry();return}
const gateway=selectedGateway(),method=methods[gateway];if(!method){msg.textContent='Choose a payment method.';return}
if(!sandboxReady){sampleWalkthrough();return}
if(!window.confirm(`This creates a TEST transaction for ${method.amount}, delivering a NON-LEGAL sample only after verified payment. The selected contract will NOT be provided. Continue?`))return;
const req={sku:'sandbox-demo',email:form.elements.email.value.trim()};
if(gateway.startsWith('openpay_')){req.firstName=form.elements.firstName.value.trim();req.lastName=form.elements.lastName.value.trim();req.phone=form.elements.phone.value.trim()}
if(gateway.startsWith('bank_'))req.bank=gateway.split('_')[1];
busy=true;primary.disabled=true;msg.textContent=`Starting ${method.name} sandbox order…`;
try{const response=await fetch(`${api}/api/checkout/${method.endpoint}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(req)});const data=await response.json();if(!response.ok)throw Error(data.error||'Payment service unavailable');
if(method.redirect){const u=new URL(data.checkoutUrl);const allowed=['checkout.stripe.com','www.paypal.com','www.sandbox.paypal.com','sandbox.paypal.com','sandbox-api.openpay.mx'];if(u.protocol!=='https:'||!allowed.includes(u.hostname))throw Error('Unexpected checkout address');location.assign(u.href);return}
const box=document.getElementById('checkout-demo-result');box.hidden=false;box.replaceChildren(e('strong','',gateway==='openpay_spei'?'SPEI sandbox reference created':'Bank transfer order created'));
box.append(e('p','',`Order ${data.orderId||'pending'} · ${data.currency||''} ${data.amount||''}`));
if(gateway==='openpay_spei'){const d=data.transfer||{};if(d.clabe)box.append(e('p','',`Test CLABE: ${d.clabe}`));if(d.reference)box.append(e('p','',`Test reference: ${d.reference}`));box.append(e('p','','This is a TEST reference issued by Openpay, not Wardenclyffe’s actual BBVA account.'))}
else{box.append(e('p','',`Reference: ${data.reference||'pending'}`));box.append(e('p','','Request verified bank instructions from Wardenclyffe. A receipt or screenshot does not confirm payment.'))}
box.append(e('p','','Order pending: no email is sent until payment is independently verified.'));msg.textContent='Order created in sandbox; payment has not been confirmed.';
}catch(error){msg.textContent=String(error.message||'Gateway unavailable. No charge can be confirmed here.');}finally{busy=false;primary.disabled=false}}
form.addEventListener('submit',begin);demo.addEventListener('click',sampleWalkthrough);
form.elements.path.addEventListener('change',updateUI);paymentCountry.addEventListener('change',updateUI);
gatewayChoices.addEventListener('change',updateUI);region.addEventListener('change',drawProducts);category.addEventListener('change',drawProducts);drawProducts();
})();
