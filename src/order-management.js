/* Staff token is intentionally never stored in localStorage or a URL. */
const $=id=>document.getElementById(id);
let token='',orders=[],selected;
const msg=s=>$('message').textContent=s||'';
const add=(parent,tag,text,cls)=>{const el=document.createElement(tag);if(cls)el.className=cls;el.textContent=text||'';parent.append(el);return el};
const date=v=>v?new Date(v).toLocaleString():'—';
function lock(){token='';$('token').value='';$('desk').hidden=true;$('login').hidden=false;orders=[]}
async function request(method='GET',body){
 const res=await fetch('/.netlify/functions/order-desk',{method,headers:{authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,cache:'no-store',credentials:'omit'});
 const data=await res.json();if(!res.ok){if(res.status===401)lock();throw Error(data.error||'Request failed')}return data;
}
function render(){
 const term=$('search').value.trim().toLowerCase(),filter=$('filter').value;
 const matches=orders.filter(o=>(!filter||o.operationalStatus===filter)&&(!term||(o.customerEmail||'').toLowerCase().includes(term)||(o.reference||'').toLowerCase().includes(term)));
 $('total').textContent=orders.length;$('sent').textContent=orders.filter(o=>o.notificationStatus==='notifications_sent').length;
 $('open').textContent=orders.filter(o=>['reviewing','validated'].includes(o.operationalStatus)).length;
 $('count').textContent=matches.length+' VERIFIED TEST RECORD(S)';$('rows').replaceChildren();
 for(const o of matches){const tr=document.createElement('tr'),t=document.createElement('td');add(t,'strong',String(o.provider).toUpperCase()+' · $1.00');add(t,'small',o.reference);tr.append(t);
 for(const val of [o.customerEmail,date(o.paidAt),o.notificationStatus==='notifications_sent'?'Both emails sent':'Pending'])add(tr,'td',val);
 const status=document.createElement('td');add(status,'span',o.operationalStatus,'pill');tr.append(status);
 const action=document.createElement('td'),button=add(action,'button','Review ↗');button.addEventListener('click',()=>show(o));tr.append(action);$('rows').append(tr)}
 if(!matches.length){const tr=document.createElement('tr'),td=add(tr,'td','No orders match your search.');td.colSpan=6;$('rows').append(tr)}
}
async function refresh(){msg('Loading private records…');try{orders=(await request()).orders||[];render();msg('')}catch(e){msg(e.message)}}
function show(o){selected=o;$('reference').textContent='…'+o.reference.slice(-14);$('customer').textContent=o.customerEmail;
 $('notifications').textContent=o.notificationStatus==='notifications_sent'?'Both sent':o.notificationStatus;
 $('stage').value=o.operationalStatus;$('note').value=o.note||'';$('history').replaceChildren();
 if(!o.history.length)add($('history'),'p','No review updates recorded yet.');
 for(const h of [...o.history].reverse())add($('history'),'p',date(h.at)+' · '+h.from+' → '+h.to+(h.note?' · '+h.note:''));
 $('detail').showModal()}
$('login-form').addEventListener('submit',async e=>{e.preventDefault();token=$('token').value.trim();$('token').value='';$('login').hidden=true;$('desk').hidden=false;await refresh();if($('message').textContent){lock()}});
$('refresh').addEventListener('click',refresh);$('logout').addEventListener('click',lock);
$('search').addEventListener('input',render);$('filter').addEventListener('change',render);
$('update-form').addEventListener('submit',async e=>{e.preventDefault();$('save').disabled=true;try{
 const result=await request('PATCH',{provider:selected.provider,reference:selected.reference,status:$('stage').value,note:$('note').value});
 orders=orders.map(o=>o.reference===selected.reference?result.order:o);render();$('detail').close();msg('Review status saved. No delivery triggered.');
 }catch(err){msg(err.message)}finally{$('save').disabled=false}});
