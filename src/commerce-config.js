/* Payment credentials stay in Netlify environment variables, never in JavaScript. */
window.WARDEN_COMMERCE=Object.freeze({mode:'sandbox',provider:'netlify-functions',paymentsEnabled:false});
