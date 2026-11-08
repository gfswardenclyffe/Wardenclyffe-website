import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {verifyStripe,validEmail,TEST_PRODUCT} from '../worker.js';
if(!globalThis.crypto)globalThis.crypto=webcrypto;
test('sandbox product is not a legal contract and is low-value',()=>{assert.equal(TEST_PRODUCT.sku,'sandbox-demo');assert.equal(TEST_PRODUCT.cents,100);assert.match(TEST_PRODUCT.name,/not a legal contract/i)});
test('email validator limits malformed addresses',()=>{assert.equal(validEmail('test@example.com'),true);assert.equal(validEmail('test+sample@example.net'),true);assert.equal(validEmail('bad address@example.com'),false);assert.equal(validEmail('noatdomain'),false)});
test('Stripe webhook verification rejects invalid and expired signatures',async()=>{const raw=JSON.stringify({id:'evt_test'}),secret='whsec_test_value',t=Math.floor(Date.now()/1000);const key=await webcrypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const bytes=await webcrypto.subtle.sign('HMAC',key,new TextEncoder().encode(`${t}.${raw}`));const v1=[...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,'0')).join('');assert.equal(await verifyStripe(raw,`t=${t},v1=${v1}`,secret,t),true);assert.equal(await verifyStripe(raw+'x',`t=${t},v1=${v1}`,secret,t),false);assert.equal(await verifyStripe(raw,`t=${t},v1=${v1}`,secret,t+400),false);assert.equal(await verifyStripe(raw,`t=${t},v1=0123456789`,secret,t),false)});
