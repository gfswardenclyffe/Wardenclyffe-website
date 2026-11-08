/**
 * Wardenclyffe transactional correspondence — bilingual, email-client-safe table HTML.
 * All order data must come from a payment-provider-verified sandbox record.
 */
const escapeHtml = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const langOf = value => value === 'es' ? 'es' : 'en';
const COLORS = {ink:'#123747',muted:'#567580',accent:'#087c89',background:'#edf5f6',border:'#d7e8e9'};
function detail(label, value, accent = false) {
  return '<tr><td style="padding:13px 0;border-bottom:1px solid #e5eeee;color:#587480;font:13px/1.5 Arial,sans-serif;vertical-align:top;width:38%">' +
    escapeHtml(label) + '</td><td style="padding:13px 0;border-bottom:1px solid #e5eeee;color:' +
    (accent?'#087c89':'#123747') + ';font:600 14px/1.5 Arial,sans-serif;overflow-wrap:anywhere;word-break:break-word;vertical-align:top">' +
    escapeHtml(value) + '</td></tr>';
}
function frame({locale='en',tag,title,description,details,noticeTitle,noticeText,closing,button,buttonUrl,internal=false}) {
  const es = langOf(locale)==='es';
  const label = es ? 'REGISTRO DE TRANSACCIÓN' : 'TRANSACTION RECORD';
  const footer = es ? 'Mensaje transaccional automático. Por favor, no responda a este correo.' :
    'This is an automated transactional message. Please do not reply directly.';
  const link = buttonUrl && /^https:\/\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9/._-]+$/.test(buttonUrl)
    ? '<tr><td style="padding:7px 0 24px"><a href="'+escapeHtml(buttonUrl)+'" style="display:inline-block;background:#0a6874;color:#ffffff;text-decoration:none;border-radius:6px;padding:13px 20px;font:700 13px Arial,sans-serif">'+escapeHtml(button)+'</a></td></tr>': '';
  return '<!doctype html><html lang="'+(es?'es':'en')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'+
    '<body style="margin:0;padding:0;background:#edf5f6;color:#123747;font-family:Arial,Helvetica,sans-serif">'+
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">'+escapeHtml(description)+'</div>'+
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#edf5f6"><tr><td align="center" style="padding:38px 16px 48px">'+
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:620px;border-collapse:separate;border-spacing:0;background:#ffffff;border:1px solid #d7e8e9;border-radius:10px;overflow:hidden">'+
    '<tr><td style="height:5px;background:#078c96;line-height:5px;font-size:0">&nbsp;</td></tr>'+
    '<tr><td style="padding:31px 42px 28px;border-bottom:1px solid #e5eeee">'+
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>'+
    '<td style="color:#143846;font:normal 27px/1.1 Georgia,Times New Roman,serif;letter-spacing:-.5px">Wardenclyffe<span style="color:#0796a0">.</span></td>'+
    '<td align="right" style="font:700 10px/1.4 Arial,sans-serif;letter-spacing:1.8px;color:#60838d">'+escapeHtml(internal?'INTERNAL / SANDBOX':'WARDENCLYFFE / SANDBOX')+'</td>'+
    '</tr></table></td></tr>'+
    '<tr><td style="padding:34px 42px 0">'+
    '<p style="margin:0 0 13px;color:#098c97;font:700 10px/1.5 Arial,sans-serif;letter-spacing:2px">'+escapeHtml(tag)+'</p>'+
    '<h1 style="margin:0 0 15px;color:#123747;font:normal 35px/1.17 Georgia,Times New Roman,serif;letter-spacing:-.7px">'+escapeHtml(title)+'</h1>'+
    '<p style="margin:0 0 27px;color:#435f69;font:15px/1.75 Arial,sans-serif">'+escapeHtml(description)+'</p>'+
    '</td></tr>'+
    '<tr><td style="padding:0 42px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #d7e8e9">'+
    '<tr><td colspan="2" style="padding:19px 0 3px;color:#143846;font:700 11px Arial,sans-serif;letter-spacing:1.2px">'+escapeHtml(label)+'</td></tr>'+
    details + '</table></td></tr>'+
    '<tr><td style="padding:0 42px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#edf7f7;border-left:3px solid #0796a0"><tr><td style="padding:17px 20px">'+
    '<p style="margin:0 0 7px;color:#143846;font:700 14px Arial,sans-serif">'+escapeHtml(noticeTitle)+'</p>'+
    '<p style="margin:0;color:#435f69;font:13px/1.75 Arial,sans-serif">'+escapeHtml(noticeText)+'</p>'+
    '</td></tr></table></td></tr>'+
    '<tr><td style="padding:0 42px 8px"><p style="margin:0 0 20px;color:#435f69;font:14px/1.7 Arial,sans-serif">'+escapeHtml(closing)+'</p></td></tr>'+
    (link?'<tr><td style="padding:0 42px">'+link+'</td></tr>':'')+
    '<tr><td style="padding:23px 42px 29px;background:#f8fbfb;border-top:1px solid #e4eded">'+
    '<p style="margin:0 0 7px;color:#143846;font:700 12px/1.6 Arial,sans-serif">WARDENCLYFFE</p>'+
    '<p style="margin:0 0 9px;color:#55717d;font:12px/1.6 Arial,sans-serif">Legal &nbsp;·&nbsp; Business &nbsp;·&nbsp; Technology<br>'+
    '<a style="color:#087c89;text-decoration:underline" href="mailto:info@wardenclyffefirm.com">info@wardenclyffefirm.com</a> &nbsp;|&nbsp; wardenclyffefirm.com</p>'+
    '<p style="margin:0;color:#78909a;font:11px/1.7 Arial,sans-serif">'+escapeHtml(footer)+'</p>'+
    '</td></tr></table></td></tr></table></body></html>';
}
export function renderCustomerEmail(order) {
  const es=langOf(order.locale)==='es';
  const rows=es
    ? detail('Servicio','Verificación del sistema de pagos (muestra sin efectos legales)')
      +detail('Importe','$1.00 USD · Simulación')+detail('Estado','Pago de prueba verificado',true)+detail('Referencia',order.orderId)
    : detail('Service','Payment system verification (nonlegal sample)')
      +detail('Amount','$1.00 USD · Sandbox')+detail('Status','Test payment verified',true)+detail('Reference',order.orderId);
  return frame({locale:order.locale,tag:es?'CONFIRMACIÓN DE PAGO / PRUEBA':'PAYMENT CONFIRMATION / TEST MODE',
    title:es?'Confirmación de pago':'Payment confirmation',
    description:es?'Estimado cliente: Confirmamos que su transacción de prueba fue verificada correctamente por nuestra plataforma de pagos. Conserve esta referencia para cualquier aclaración.':
      'Dear Client, we confirm that your test transaction has been successfully verified through our secure payment platform. Please retain the reference below for your records.',
    details:rows,
    noticeTitle:es?'Aviso sobre esta operación':'Important information',
    noticeText:es?'Esta operación se efectuó en un entorno de pruebas. No se cobraron fondos reales; no constituye la compra de un contrato o servicio jurídico y no genera una obligación de entrega documental.':
      'This transaction took place in Stripe sandbox mode. No real money was charged. It is not a legal contract purchase, and no document is due or will be delivered.',
    closing:es?'Gracias por participar en la verificación de nuestros servicios digitales. Para cualquier aclaración, nuestro equipo está a su disposición en info@wardenclyffefirm.com.':
      'Thank you for participating in our payment system verification. Should you require any assistance, please contact our team at info@wardenclyffefirm.com.'});
}
export function renderOfficeEmail(order, dashboardUrl) {
  const es=langOf(order.locale)==='es';
  const rows=es
    ? detail('Cliente',order.customerEmail)+detail('Proveedor','Stripe (prueba)')+detail('Importe','$1.00 USD')
      +detail('Estado','Pago verificado',true)+detail('Referencia',order.orderId)+detail('Entrega','No corresponde')
    : detail('Customer',order.customerEmail)+detail('Provider','Stripe (sandbox)')+detail('Amount','$1.00 USD')
      +detail('Payment status','Verified',true)+detail('Transaction reference',order.orderId)+detail('Document fulfillment','Not applicable');
  return frame({locale:order.locale,internal:true,tag:es?'OPERACIONES / COMPROBANTE INTERNO':'OPERATIONS / INTERNAL TRANSACTION',
    title:es?'Pago de prueba registrado':'Payment successfully recorded',
    description:es?'Equipo Wardenclyffe: Se ha confirmado una nueva transacción de prueba. Los datos se muestran a continuación para fines de control y conciliación interna.':
      'Wardenclyffe Team, a new sandbox payment has been verified and recorded. The details below are provided for internal monitoring and reconciliation.',
    details:rows,
    noticeTitle:es?'Sin acción de entrega':'Fulfillment status — no action required',
    noticeText:es?'Esta operación corresponde exclusivamente a una simulación. No se debe entregar ningún documento ni iniciar un expediente de cliente.':
      'This is a sandbox verification only. No delivery task is required, no client document is owed, and no professional engagement has been opened.',
    closing:es?'El movimiento puede consultarse en el registro privado de órdenes. Para operaciones reales, el equipo deberá validar los servicios contratados antes de cualquier entrega.':
      'The payment may be reviewed in the private order register. For future production orders, professional review and fulfillment approval will be required before delivery.',
    button:es?'ABRIR REGISTRO DE ÓRDENES':'OPEN ORDER REGISTER',buttonUrl:dashboardUrl});
}
export function customerSubject(locale) { return langOf(locale)==='es' ?
  'Wardenclyffe | Confirmación de operación de prueba' :
  'Wardenclyffe | Confirmation of your test transaction'; }
export function officeSubject(locale) { return langOf(locale)==='es' ?
  '[PRUEBAS] Wardenclyffe | Pago verificado — sin entrega pendiente' :
  '[SANDBOX] Wardenclyffe | Verified payment — no fulfillment due'; }
export function customerPlain(order) {
 return langOf(order.locale)==='es' ?
  'Wardenclyffe — Confirmación de pago de prueba\nImporte: $1.00 USD (simulación)\nReferencia: '+order.orderId+'\nNo se cobraron fondos reales. No se adquirió un contrato y no se requiere entrega documental.\nContacto: info@wardenclyffefirm.com' :
  'Wardenclyffe — Test payment confirmation\nAmount: $1.00 USD (sandbox)\nReference: '+order.orderId+
  '\nNo real money was charged. This is not a legal contract purchase; no document delivery is required.\nContact: info@wardenclyffefirm.com';
}
export function officePlain(order) {
 return langOf(order.locale)==='es' ?
  'Wardenclyffe — Pago de prueba registrado\nCliente: '+order.customerEmail+'\nImporte: $1.00 USD\nReferencia: '+order.orderId+'\nNo corresponde entrega documental.' :
  'Wardenclyffe — Verified sandbox payment\nCustomer: '+order.customerEmail+
  '\nAmount: $1.00 USD\nReference: '+order.orderId+'\nNo delivery task is required.';
}
