/* Wardenclyffe · V4.5 — contract browser and payment preview. All prices are drafts. */
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
const mainButton=document.getElementById('stripe-checkout'),paypalButton=document.getElementById('paypal-checkout');
if(!region||!category||!grid||!dialog||!form)return;
let chosen=null;const config=window.WARDEN_COMMERCE||{mode:'preview',apiBase:'',paymentsEnabled:false};
const el=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node};
function drawProducts(){grid.replaceChildren();const list=contractList.filter(p=>p.regions.includes(region.value)&&(category.value==='all'||p.category===category.value));
for(const p of list){const tile=el('article','product-tile'),tag=el('span','tag',p.category.replace('-',' ').toUpperCase()),head=el('h3','',p.title),body=el('p','',`Select the applicable ${region.value==='us'?'U.S. state':region.value==='mx'?'Mexican state':'European country'} before ordering. Documents are not yet approved for sale.`),price=el('span','product-price',`Draft price · $${p.price} USD`),button=el('button','','View purchase paths ↗');button.type='button';button.addEventListener('click',()=>openProduct(p));tile.append(tag,head,body,price,button);grid.append(tile)}
if(!list.length)grid.append(el('p','','No contracts match this selection.'))}
function openProduct(p){chosen=p;document.getElementById('checkout-product-name').textContent=p.title;document.getElementById('checkout-price').textContent=`Draft: $${p.price} USD`;form.reset();const regionText=region.value==='us'?'U.S. state':region.value==='mx'?'Mexican state':'European country';form.elements.jurisdiction.placeholder=`Required: ${regionText}`;msg.textContent='';document.getElementById('delivery-example').hidden=true;syncPath();dialog.showModal()}
function syncPath(){const type=form.elements.path.value;mainButton.textContent=type==='template'?'Preview Stripe checkout →':type==='customize'?'Request customization →':'Request legal review →';paypalButton.hidden=type!=='template';document.getElementById('gateway-choices').hidden=type!=='template'}
function inquiry(){const email=form.elements.email.value.trim(),jurisdiction=form.elements.jurisdiction.value.trim(),path=form.elements.path.value;
const subject=encodeURIComponent(`Wardenclyffe · ${path==='customize'?'Customization':'Legal review'} · ${chosen.title}`);
const body=encodeURIComponent(`Hello Wardenclyffe,\n\nI would like to request ${path} for: ${chosen.title}.\nJurisdiction: ${jurisdiction}\nContact: ${email}\n\nPlease confirm availability, fees, scope, and next steps.\n`);
window.location.href=`mailto:info@wardenclyffefirm.com?subject=${subject}&body=${body}`;
msg.textContent='Your email application should open with an inquiry draft. No payment has been collected.';
}
async function begin(provider){if(!form.reportValidity()||!chosen)return;const path=form.elements.path.value;if(path!=='template'){inquiry();return}
const api=String(config.apiBase||'').replace(/\/$/,'');const enabled=config.mode==='sandbox'&&api.startsWith('https://');
if(!enabled){msg.textContent=`${provider==='stripe'?'Stripe and supported wallets':'PayPal'} will become available when the secure sandbox backend is connected. This is a preview: no payment was collected and no email was sent.`;document.getElementById('delivery-example').hidden=false;return}
if(!window.confirm('This runs a $1.00 TEST checkout for a NON-LEGAL sandbox sample, not the selected contract. Continue?'))return;
const btn=provider==='stripe'?mainButton:paypalButton;btn.disabled=true;msg.textContent='Starting the secure test checkout…';
try{const res=await fetch(`${api}/api/checkout/${provider}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sku:'sandbox-demo',email:form.elements.email.value.trim()})});const data=await res.json();if(!res.ok||!data.checkoutUrl)throw Error(data.error||'Checkout is unavailable');const url=new URL(data.checkoutUrl);if(!['https:'].includes(url.protocol)||!(['checkout.stripe.com','www.paypal.com','www.sandbox.paypal.com','sandbox.paypal.com'].includes(url.hostname)))throw Error('Unexpected payment provider URL');location.assign(url.href)}catch(e){msg.textContent=String(e.message||'Checkout unavailable');btn.disabled=false}}
form.addEventListener('submit',e=>{e.preventDefault();begin('stripe')});paypalButton.addEventListener('click',()=>begin('paypal'));form.elements.path.addEventListener('change',syncPath);region.addEventListener('change',drawProducts);category.addEventListener('change',drawProducts);drawProducts();
})();
