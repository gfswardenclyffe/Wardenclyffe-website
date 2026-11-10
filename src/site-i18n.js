/* Wardenclyffe multilingual site runtime: authored translations, no external translation API.
 * English is source text. Content that has not yet received an approved translation remains English.
 */
(()=>{'use strict';
if(window.WardenclyffeI18n)return;
const supported=new Set(['en','es','fr','zh']);
// Localized static homepages use language-specific crawlable URLs.
const stagingPrefix=location.pathname.startsWith('/wardenclyffe-staging/')?'/wardenclyffe-staging':'';
const localPath=location.pathname.slice(stagingPrefix.length)||'/';
const localeMatch=localPath.match(/^\/(es|fr|zh)(?:\/|$)/);
const localeHome=!!localeMatch && /^\/(es|fr|zh)\/(?:index\.html)?$/.test(localPath);
const englishHome=localPath==='/'||localPath==='/index.html';
const catalog=window.WardenclyffeTranslations||{};
const originals=new WeakMap(),attributes=new WeakMap();
let active='en',busy=false;
const isPage=location.pathname.includes('/pages/'),base=isPage?'':'pages/';
const metaMap={en:'English',es:'Español',fr:'Français',zh:'简体中文'};
function label(source,language=active){if(language==='en')return source;return catalog[source]?.[language]||source;}
function makeSwitcher(){
 let el=document.getElementById('warden-language');
 if(el)return el;
 const host=document.querySelector('.site-head')||document.querySelector('.head')||document.querySelector('body>header');
 if(!host)return null;
 const wrap=document.createElement('label');wrap.className='warden-language-picker';
 const text=document.createElement('span');text.textContent='Language';text.dataset.i18n="Language";
 el=document.createElement('select');el.id='warden-language';el.setAttribute('aria-label','Choose language');
 for(const [key,value] of Object.entries(metaMap)){
   const option=document.createElement('option');option.value=key;option.textContent=value;el.append(option);
 }
 wrap.append(text,el);host.append(wrap);
 el.addEventListener('change',()=>select(el.value));
 return el;
}
function makeAboutLink(){
 const nav=document.querySelector('.topnav,.site-nav');
 if(nav&&!nav.querySelector('a[href*="about.html"]')){
  const first=nav.querySelector('a');const a=document.createElement('a');
  a.href=base+'about.html';a.textContent='About';
  if(nav.classList.contains('topnav'))a.className='nav-link';
  a.setAttribute('data-i18n','About');
  if(first)first.after(a);else nav.append(a);
 }
 for(const foot of document.querySelectorAll('.warden-footer .footer-columns')){
  const explore=Array.from(foot.children).find(col=>col.querySelector('a[href*="services.html"]'));
  if(!explore||explore.querySelector('a[href*="about.html"]'))continue;
  const links=Array.from(explore.querySelectorAll('a[href]'));
  if(!links.length)continue;
  const about=document.createElement('a');about.href=base+'about.html';about.dataset.i18n='[02] ABOUT';about.textContent='[02] ABOUT';
  links[0].after(about);
  const items=Array.from(explore.querySelectorAll('a[href]'));
  for(let i=0;i<items.length;i++){
   const node=items[i],name=node.textContent.replace(/^\[\d+\]\s*/,'').trim();
   const original='['+String(i+1).padStart(2,'0')+'] '+name;
   if(node.dataset.i18n){if(node===about)continue;}
   node.dataset.i18n=original;node.textContent=original;
  }
 }
}
function translateTextNodes(root){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const pool=[];while(walker.nextNode())pool.push(walker.currentNode);
 for(const node of pool){
  const parent=node.parentElement;
  if(!parent||parent.closest('script,style,noscript,svg,canvas,code,pre'))continue;
  if(parent.closest('#legal-category-grid,#contract-products,#checkout-dialog'))continue;
  if(parent.closest('.warden-cookie-banner,.warden-cookie-modal'))continue;
  const value=node.nodeValue;if(!value||!value.trim())continue;
  const last=originals.get(node);
  let raw=last?.source||value;
  if(last&&value!==last.translated&&value!==last.source)raw=value;
  if(!last||last.source!==raw)originals.set(node,{source:raw,translated:raw});
  const trimmed=raw.trim();
  const translated=label(trimmed);
  const updated=translated===trimmed?raw:raw.replace(trimmed,translated);
  if(value!==updated)node.nodeValue=updated;
  originals.set(node,{source:raw,translated:updated});
 }
}
function translateAttrs(root){
 for(const el of root.querySelectorAll('*')){
  if(el.closest('#legal-category-grid,#checkout-dialog'))continue;
  for(const attr of ['placeholder','title','aria-label','data-subtitle','data-title']){
   if(!el.hasAttribute(attr))continue;
   let map=attributes.get(el);if(!map){map={};attributes.set(el,map)}
   const existing=el.getAttribute(attr);
   if(!map[attr]||existing!==map[attr].translated&&existing!==map[attr].source)map[attr]={source:existing,translated:existing};
   const source=map[attr].source,translated=label(source);
   if(existing!==translated)el.setAttribute(attr,translated);
   map[attr].translated=translated;
  }
 }
}
function reviseLinks(){
 for(const anchor of document.querySelectorAll('a[href]')){
  const raw=anchor.getAttribute('href');
  if(!raw||/^(?:mailto:|tel:|javascript:|#|data:)/i.test(raw)||anchor.hasAttribute('download'))continue;
  try{const url=new URL(raw,location.href);
   if(url.origin!==location.origin)continue;
   if(active==='en')url.searchParams.delete('lang');else url.searchParams.set('lang',active);
   anchor.setAttribute('href',url.href);
  }catch(_e){}
 }
}
function translate(){
 if(busy)return;busy=true;
 try{
 document.documentElement.lang=active==='zh'?'zh-Hans':active;
 const picker=makeSwitcher();if(picker)picker.value=active;
 translateTextNodes(document.body);translateAttrs(document.body);reviseLinks();
 document.title=label(document.querySelector('title')?.dataset.englishTitle||document.title);
 const description=document.querySelector('meta[name="description"]');
 if(description){
  if(!description.dataset.english)description.dataset.english=description.content;
  description.content=label(description.dataset.english);
 }
 }finally{busy=false}
}
function select(lang,{setHistory=true}={}){
 const next=supported.has(lang)?lang:'en';
 if(setHistory&&(localeHome||englishHome)){
  const destination=stagingPrefix+'/' + (next==='en'?'':next+'/');
  if(location.pathname!==destination){location.assign(destination);return;}
 }
 active=next;
 translate();
 if(setHistory){const url=new URL(location.href);if(active==='en')url.searchParams.delete('lang');else url.searchParams.set('lang',active);history.replaceState({},'',url);}
 window.dispatchEvent(new CustomEvent('wardenclyffe:language-changed',{detail:{lang:active}}));
}
function boot(){
 makeAboutLink();
 document.querySelector('title')?.setAttribute('data-english-title',document.title);
 const requested=new URLSearchParams(location.search).get('lang');
 const declaredLang=document.documentElement.getAttribute('lang')||'en';
 select(localeHome?localeMatch[1]:(requested||(supported.has(declaredLang)?declaredLang:'en')),{setHistory:false});
 const observation=new MutationObserver(muts=>{
  if(busy)return;
  const dynamic=muts.some(m=>m.type==='childList'||m.type==='characterData');
  if(dynamic)translate();
 });
 observation.observe(document.body,{subtree:true,childList:true,characterData:true});
 window.addEventListener('popstate',()=>select(localeHome?localeMatch[1]:(new URLSearchParams(location.search).get('lang')||'en'),{setHistory:false}));
}
window.WardenclyffeI18n={get language(){return active},select,t:label};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();