import test from 'node:test';
import assert from 'node:assert/strict';
import { notifyVerifiedSandboxOrder, allowedSandboxEmail, emailsConfigured } from '../_shared/sandbox-notifications.mjs';
import { signatureValid } from '../stripe-webhook.mjs';
import { createHmac } from 'node:crypto';

const env = {
  PAYMENTS_MODE: 'sandbox', ENABLE_SANDBOX_EMAILS: 'true',
  RESEND_API_KEY: 're_demo_not_real', RESEND_FROM_EMAIL: 'Wardenclyffe <orders@example.org>',
  ORDER_ALERT_EMAIL: 'office@example.org', SANDBOX_TEST_EMAILS: 'customer@example.org',
};
const order = { provider:'stripe',orderId:'cs_test_1234567890',customerEmail:'customer@example.org',
  sku:'sandbox-demo',amount:100,currency:'usd',livemode:false };
function memoryStore(){const rows=new Map();return {rows,
  get:async key=>rows.get(key)||null,
  setJSON:async(key,value,{onlyIfNew}={})=>{
    if(onlyIfNew&&rows.has(key))return {modified:false};
    rows.set(key,value);return {modified:true};
  }};
}

test('only approved sandbox recipients are eligible',()=>{
  assert.equal(allowedSandboxEmail('customer@example.org',env),true);
  assert.equal(allowedSandboxEmail('random@example.org',env),false);
  assert.equal(allowedSandboxEmail('',env),false);
  assert.equal(emailsConfigured(env),true);
});
test('verified sandbox payment sends customer plus office notices once',async()=>{
  const store=memoryStore(), messages=[];
  const send=async message=>{messages.push(message);return 'email_fake_id';};
  const result=await notifyVerifiedSandboxOrder(order,{env,store,send});
  assert.equal(result.status,'notifications_sent');assert.equal(messages.length,2);
  assert.equal(messages[0].to,'customer@example.org');assert.equal(messages[1].to,'office@example.org');
  assert.match(messages[1].html,/no delivery task is required/);
  assert.match(messages[0].html,/not a legal contract/i);
  const replay=await notifyVerifiedSandboxOrder(order,{env,store,send});
  assert.equal(replay.status,'already_notified');assert.equal(messages.length,2);
});
test('unapproved email cannot initiate notifications',async()=>{
  const messages=[];
  const result=await notifyVerifiedSandboxOrder({...order,customerEmail:'stranger@example.org'},{env,store:memoryStore(),send:async message=>messages.push(message)});
  assert.equal(result.emailed,false);assert.equal(messages.length,0);
});
test('live or changed amount is rejected',async()=>{
  for (const bad of [{...order,livemode:true},{...order,amount:3900},{...order,sku:'nda'}])
    await assert.rejects(()=>notifyVerifiedSandboxOrder(bad,{env,store:memoryStore()}));
});
test('notification send failure retains retryable record',async()=>{
  const store=memoryStore(), messages=[];
  const send=async message=>{messages.push(message);if(message.to==='office@example.org'&&messages.length===2)throw Error('email timeout');return 'sent'};
  await assert.rejects(()=>notifyVerifiedSandboxOrder(order,{env,store,send}));
  const row=store.rows.values().next().value;
  assert.equal(row.status,'payment_verified');
  assert.equal(messages.length,2);
});
test('Stripe signature verifier accepts a correct signed event and rejects tampering',()=>{
  const ts=1710000000,raw='{"id":"evt_demo"}',key='whsec_demo';
  const sig=createHmac('sha256',key).update(`${ts}.${raw}`).digest('hex');
  assert.equal(signatureValid(raw,`t=${ts},v1=${sig}`,key,ts),true);
  assert.equal(signatureValid(raw+'x',`t=${ts},v1=${sig}`,key,ts),false);
  assert.equal(signatureValid(raw,`t=${ts},v1=${sig}`,key,ts+301),false);
});
