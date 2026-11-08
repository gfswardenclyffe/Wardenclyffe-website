/* Wardenclyffe consent manager — no third-party analytics or advertising code ships in this version.
 * Store only the visitor's first-party choice; future scripts must inspect consent before loading.
 */
(()=>{'use strict';if(window.WardenclyffeConsent)return;
const KEY='wardenclyffe.consent.v1';const necessaryOnly=()=>({necessary:true,functional:false,analytics:false,marketing:false});
let state=null;try{const old=JSON.parse(localStorage.getItem(KEY)||'null');if(old&&old.necessary===true&&['boolean'].every(x=>typeof old.functional===x)&&typeof old.analytics==='boolean'&&typeof old.marketing==='boolean')state=old}catch(_e){}
const gpc=navigator.globalPrivacyControl===true;
function make(tag,attrs={},content=''){const n=document.createElement(tag);for(const [k,v] of Object.entries(attrs)){if(k==='class')n.className=v;else n.setAttribute(k,v)}if(content)n.textContent=content;return n;}
function link(label,href){const a=make('a',{href},label);return a}
const inPages=location.pathname.includes('/pages/');const base=inPages?'':'pages/';
let banner=null,modal=null,checks={};
function announce(){window.dispatchEvent(new CustomEvent('warden:consent-changed',{detail:Object.assign({},state)}))}
function save(next){state=Object.assign(necessaryOnly(),next,{necessary:true,updatedAt:new Date().toISOString()});if(gpc)state.marketing=false;try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_e){}banner.hidden=true;modal.close();announce()}
function showSettings(){if(!modal)return;const s=state||necessaryOnly();for(const k of ['functional','analytics','marketing'])checks[k].checked=!!s[k];if(gpc){checks.marketing.disabled=true;checks.marketing.checked=false}else checks.marketing.disabled=false;modal.showModal()}
function makeAction(label,fn,kind=''){const b=make('button',{type:'button',class:kind},label);b.addEventListener('click',fn);return b}
function build(){banner=make('section',{class:'warden-cookie-banner','aria-label':'Cookie choices'});banner.append(make('h2',{},'Your Privacy Matters'));
banner.append(make('p',{},'We use cookies and similar technologies to keep our website secure, improve your browsing experience, understand how our services are used, and, with your permission, personalize content and advertising.'));
banner.append(make('p',{},'You can accept all cookies, reject non-essential cookies, or customize your preferences at any time.'));
banner.append(make('p',{},'By selecting Accept All Cookies, you consent to the use of optional cookies as described in our Cookie Policy.'));
const pol=make('p',{class:'warden-cookie-policies'});pol.append(link('Privacy Policy',base+'privacy.html'),document.createTextNode('  ·  '),link('Cookie Policy',base+'cookies.html'));banner.append(pol);
const actions=make('div',{class:'warden-cookie-actions'});
actions.append(makeAction('Accept All Cookies',()=>save({functional:true,analytics:true,marketing:!gpc}),'cookie-accept'));
actions.append(makeAction('Reject Non-Essential',()=>save(necessaryOnly())));
actions.append(makeAction('Customize Preferences',showSettings));banner.append(actions);banner.hidden=!!state;
modal=make('dialog',{class:'warden-cookie-modal','aria-label':'Manage Your Cookie Preferences'});
modal.append(makeAction('×',()=>modal.close(),'warden-cookie-close'));
modal.append(make('h2',{},'Manage Your Cookie Preferences'));
modal.append(make('p',{},'You are in control of your privacy. Choose which types of cookies Wardenclyffe may use.'));
for(const [key,title,desc] of [
['necessary','Strictly Necessary Cookies — Always Active','Required for website security, navigation, and essential functionality. These cannot be disabled through this preference panel.'],
['functional','Functional Cookies — Optional','Remember your preferences and improve your experience.'],
['analytics','Analytics Cookies — Optional','Help us understand how visitors use our website so we can improve our services.'],
['marketing','Marketing Cookies — Optional','Allow advertising measurement and, where enabled, personalized advertising.']]){
const row=make('label',{class:'warden-cookie-option'}),block=make('span');block.append(make('strong',{},title),make('small',{},desc));
const cb=make('input',{type:'checkbox',name:key});cb.checked=key==='necessary';if(key==='necessary')cb.disabled=true;checks[key]=cb;row.append(block,cb);modal.append(row);
}
if(gpc)modal.append(make('p',{},'Your browser requests an advertising-related opt-out; Marketing Cookies remain disabled.'));
modal.append(make('p',{},'You may update your choices at any time through Cookie Settings. No optional analytics or advertising technologies are currently loaded by this website prototype.'));
const choice=make('div',{class:'warden-cookie-actions'});
choice.append(makeAction('Save My Preferences',()=>save({functional:checks.functional.checked,analytics:checks.analytics.checked,marketing:checks.marketing.checked}),'cookie-accept'));
choice.append(makeAction('Accept All Cookies',()=>save({functional:true,analytics:true,marketing:!gpc})));
choice.append(makeAction('Reject Non-Essential',()=>save(necessaryOnly()),'cookie-reject'));
modal.append(choice);document.body.append(banner,modal);
document.querySelectorAll('[data-warden-cookie-settings]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();showSettings()}));
}
window.WardenclyffeConsent=Object.freeze({get:()=>state?Object.assign({},state):null,open:()=>showSettings(),onChange:(listener)=>window.addEventListener('warden:consent-changed',listener)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
})();
