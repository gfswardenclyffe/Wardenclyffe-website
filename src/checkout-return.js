(()=>{'use strict';const query=new URLSearchParams(location.search),node=document.getElementById('checkout-return-status');if(!node)return;
const provider=query.get('provider'),session=query.get('session_id'),token=query.get('token');
async function start(){if(provider!=='stripe'&&provider!=='paypal'){node.textContent='No verified transaction was supplied. No payment is confirmed.';return}
node.textContent='Contacting the payment provider to verify your sandbox transaction…';
try{let response;if(provider==='stripe'){if(!session)throw Error('Missing session reference');response=await fetch('/.netlify/functions/stripe-status?session_id='+encodeURIComponent(session),{cache:'no-store'})}
else{if(!token)throw Error('Missing PayPal order reference');response=await fetch('/.netlify/functions/paypal-capture',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({orderId:token})})}
const data=await response.json();if(!response.ok)throw Error(data.error||'Payment could not be verified');
node.textContent=data.paid?'TEST PAYMENT VERIFIED ✓ — $1 USD sandbox transaction. No real charge or legal contract delivery took place.':`PAYMENT NOT VERIFIED — ${data.status||'pending'}. No document has been delivered.`;
}catch(err){node.textContent='Payment verification unavailable. Check your provider sandbox dashboard before treating the order as paid. '+(err.message||'')}}
start()})();
