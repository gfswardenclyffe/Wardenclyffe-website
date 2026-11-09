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
modal.append(choice);document.body.append(banner,modal);translateCookie(new URLSearchParams(location.search).get('lang')||'en');
document.querySelectorAll('[data-warden-cookie-settings]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();showSettings()}));
}
const cookieDictionary={"Cookie choices":{"es":"Preferencias de cookies","fr":"Choix des cookies","zh":"Cookie 选择"},"Your Privacy Matters":{"es":"Tu privacidad importa","fr":"Votre vie privée compte","zh":"您的隐私至关重要"},"We use cookies and similar technologies to keep our website secure, improve your browsing experience, understand how our services are used, and, with your permission, personalize content and advertising.":{"es":"Usamos cookies y tecnologías similares para proteger el sitio, mejorar la navegación y comprender el uso de nuestros servicios. Con tu permiso, podemos personalizar contenidos y publicidad.","fr":"Nous utilisons des cookies et des technologies similaires pour sécuriser le site, améliorer la navigation et comprendre l’utilisation de nos services. Avec votre accord, nous pouvons personnaliser le contenu et la publicité.","zh":"我们使用 Cookie 及类似技术保护网站安全、改善浏览体验并了解服务使用情况。经您同意后，我们还可能个性化展示内容与广告。"},"You can accept all cookies, reject non-essential cookies, or customize your preferences at any time.":{"es":"Puedes aceptar todas las cookies, rechazar las no esenciales o configurar tus preferencias en cualquier momento.","fr":"Vous pouvez accepter tous les cookies, refuser ceux qui ne sont pas essentiels ou personnaliser vos choix à tout moment.","zh":"您可以接受所有 Cookie、拒绝非必要 Cookie，或随时自定义偏好。"},"By selecting Accept All Cookies, you consent to the use of optional cookies as described in our Cookie Policy.":{"es":"Al elegir «Aceptar todas», consientes el uso de cookies opcionales conforme a la Política de cookies.","fr":"En choisissant « Tout accepter », vous consentez aux cookies facultatifs conformément à notre politique.","zh":"选择“全部接受”即表示您同意根据 Cookie 政策使用可选 Cookie。"},"Privacy Policy":{"es":"Aviso de privacidad","fr":"Politique de confidentialité","zh":"隐私政策"},"Cookie Policy":{"es":"Política de cookies","fr":"Politique relative aux cookies","zh":"Cookie 政策"},"Accept All Cookies":{"es":"Aceptar todas","fr":"Tout accepter","zh":"全部接受"},"Reject Non-Essential":{"es":"Rechazar no esenciales","fr":"Refuser les cookies facultatifs","zh":"拒绝非必要 Cookie"},"Customize Preferences":{"es":"Personalizar preferencias","fr":"Personnaliser les préférences","zh":"自定义偏好"},"Manage Your Cookie Preferences":{"es":"Administrar preferencias de cookies","fr":"Gérer vos préférences de cookies","zh":"管理 Cookie 偏好"},"You are in control of your privacy. Choose which types of cookies Wardenclyffe may use.":{"es":"Tú decides sobre tu privacidad. Elige qué tipos de cookies puede usar Wardenclyffe.","fr":"Vous contrôlez votre vie privée. Choisissez les types de cookies que Wardenclyffe peut utiliser.","zh":"您的隐私由您决定。请选择 Wardenclyffe 可以使用的 Cookie 类型。"},"Strictly Necessary Cookies — Always Active":{"es":"Cookies estrictamente necesarias — Siempre activas","fr":"Cookies strictement nécessaires — Toujours actifs","zh":"严格必要的 Cookie — 始终启用"},"Required for website security, navigation, and essential functionality. These cannot be disabled through this preference panel.":{"es":"Necesarias para la seguridad, navegación y funciones esenciales. No se desactivan desde este panel.","fr":"Nécessaires à la sécurité, à la navigation et aux fonctions essentielles. Elles ne peuvent pas être désactivées ici.","zh":"网站安全、导航及基本功能所必需，无法通过此面板禁用。"},"Functional Cookies — Optional":{"es":"Cookies funcionales — Opcionales","fr":"Cookies fonctionnels — Facultatifs","zh":"功能性 Cookie — 可选"},"Remember your preferences and improve your experience.":{"es":"Recuerdan tus preferencias y mejoran tu experiencia.","fr":"Mémorisent vos préférences et améliorent votre expérience.","zh":"记住您的偏好并改善体验。"},"Analytics Cookies — Optional":{"es":"Cookies analíticas — Opcionales","fr":"Cookies analytiques — Facultatifs","zh":"分析 Cookie — 可选"},"Help us understand how visitors use our website so we can improve our services.":{"es":"Ayudan a comprender el uso del sitio para mejorar nuestros servicios.","fr":"Nous aident à comprendre l’utilisation du site pour améliorer nos services.","zh":"帮助我们了解网站使用情况并改进服务。"},"Marketing Cookies — Optional":{"es":"Cookies de mercadotecnia — Opcionales","fr":"Cookies marketing — Facultatifs","zh":"营销 Cookie — 可选"},"Allow advertising measurement and, where enabled, personalized advertising.":{"es":"Permiten medir publicidad y, cuando se habilite, personalizar anuncios.","fr":"Permettent de mesurer la publicité et, le cas échéant, de la personnaliser.","zh":"用于广告效果衡量及（若启用）个性化广告。"},"Your browser requests an advertising-related opt-out; Marketing Cookies remain disabled.":{"es":"Tu navegador solicita excluir el seguimiento publicitario; las cookies de mercadotecnia permanecen desactivadas.","fr":"Votre navigateur demande la désactivation du suivi publicitaire ; les cookies marketing restent désactivés.","zh":"您的浏览器已请求退出广告跟踪；营销 Cookie 将保持关闭。"},"You may update your choices at any time through Cookie Settings. No optional analytics or advertising technologies are currently loaded by this website prototype.":{"es":"Puedes modificar tus opciones mediante «Configurar cookies». Este prototipo aún no carga tecnología opcional de analítica ni publicidad.","fr":"Vous pouvez modifier vos choix dans « Paramètres des cookies ». Ce prototype ne charge actuellement aucun outil facultatif d’analyse ou de publicité.","zh":"您可以随时通过“Cookie 设置”修改选择。本网站原型目前未加载可选分析或广告技术。"},"Save My Preferences":{"es":"Guardar mis preferencias","fr":"Enregistrer mes préférences","zh":"保存偏好"}};
const originalCookieText=new WeakMap();
function translateCookie(lang){
 const active=['en','es','fr','zh'].includes(lang)?lang:'en';
 for(const root of [banner,modal]){
  if(!root)continue;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
   const node=walker.currentNode;const current=node.nodeValue;if(!current||!current.trim())continue;
   const old=originalCookieText.get(node);const source=old?.source||current;
   const trimmed=source.trim(),value=cookieDictionary[trimmed]?.[active]||trimmed;
   const translated=source.replace(trimmed,value);
   if(node.nodeValue!==translated)node.nodeValue=translated;
   originalCookieText.set(node,{source,translated});
  }
  if(root.getAttribute('aria-label')==='Cookie choices')root.setAttribute('aria-label',cookieDictionary['Cookie choices']?.[active]||'Cookie choices');
 }
}
window.addEventListener('wardenclyffe:language-changed',e=>translateCookie(e.detail?.lang));
window.addEventListener('wardenclyffe:shop-language',e=>translateCookie(e.detail?.lang));
window.WardenclyffeConsent=Object.freeze({get:()=>state?Object.assign({},state):null,open:()=>showSettings(),onChange:(listener)=>window.addEventListener('warden:consent-changed',listener)});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
})();
