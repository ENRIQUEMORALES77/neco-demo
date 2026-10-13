/**
 * CONTADOR REAL · Neco Buffet (Google Apps Script + Google Sheets)
 * ----------------------------------------------------------------
 * Guarda cada escaneo, clic y mensaje de la página en una hoja de cálculo
 * y se los entrega al panel. Gratis, sin servidor.
 *
 * Instalación (5 minutos, ver README → «Contador real»):
 *  1. Crea una hoja de Google vacía → Extensiones → Apps Script.
 *  2. Pega este archivo entero y cambia CLAVE_PANEL (y EMAIL_AVISOS si quieres avisos).
 *  3. Implementar → Nueva implementación → Aplicación web
 *       · Ejecutar como: yo   · Quién tiene acceso: cualquier usuario
 *  4. Copia la URL que termina en /exec y pégala en config.js → contador.endpoint.
 *  5. Abre el panel una vez con ?clave=TU_CLAVE para conectarlo.
 */

// ---- AJUSTES ------------------------------------------------------
var CLAVE_PANEL = 'cambia-esta-clave';          // la pide el panel para leer los datos
var EMAIL_AVISOS = '';                           // si pones un email, recibe cada mensaje privado al momento
var LOCALES = ['ruzafa', 'saler', 'alfafar', 'paterna'];
var EVENTOS = ['escaneo', 'clic_google', 'clic_platos', 'abrir_queja', 'abrir_alergenos',
               'abrir_grupos', 'abrir_horario', 'abrir_precios', 'ver_precios', 'ver_horario',
               'queja', 'grupo', 'ver_alergenos'];
var DIAS_PANEL = 90;                             // días que se envían al panel
// -------------------------------------------------------------------

var CABECERA = ['fecha', 'evento', 'local', 'mesa', 'via', 'idioma', 'categoria', 'texto', 'contacto', 'personas', 'importe'];

function hoja_() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var h = libro.getSheetByName('Eventos');
  if (!h) {
    h = libro.insertSheet('Eventos');
    h.appendRow(CABECERA);
    h.setFrozenRows(1);
  }
  return h;
}

function limpiar_(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').slice(0, max || 80);
}

/* Recibe los eventos de la página (navigator.sendBeacon). */
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    if (EVENTOS.indexOf(d.evento) === -1 || LOCALES.indexOf(d.local) === -1) return salida_({ ok: false });
    var fila = [
      new Date(),
      d.evento,
      d.local,
      limpiar_(d.mesa, 6),
      d.via === 'nfc' || d.via === 'qr' ? d.via : 'enlace',
      d.idioma === 'en' ? 'en' : 'es',
      limpiar_(d.categoria, 30),
      limpiar_(d.texto, 1500),
      limpiar_(d.contacto, 120),
      Number(d.personas) || '',
      Number(d.importe) || '',
    ];
    var lock = LockService.getScriptLock();
    lock.waitLock(5000);
    hoja_().appendRow(fila);
    lock.releaseLock();

    if (d.evento === 'queja' && EMAIL_AVISOS) {
      MailApp.sendEmail(EMAIL_AVISOS, 'Neco · Mensaje privado · ' + d.local + (d.mesa ? ' · mesa ' + d.mesa : ''),
        (d.texto || '') + '\n\nCategoría: ' + (d.categoria || '-') + '\nContacto: ' + (d.contacto || 'sin contacto') +
        '\nOrigen: ' + fila[4] + (d.mesa ? ' · mesa ' + d.mesa : ' · entrada'));
    }
    return salida_({ ok: true });
  } catch (err) {
    return salida_({ ok: false, error: String(err) });
  }
}

/* Entrega los datos al panel: ?clave=...  (formato compacto) */
function doGet(e) {
  if (!e || !e.parameter || e.parameter.clave !== CLAVE_PANEL) return salida_({ ok: false, error: 'clave' });
  var valores = hoja_().getDataRange().getValues();
  var desde = Date.now() - DIAS_PANEL * 864e5;
  var eventos = [], mensajes = [];
  for (var i = 1; i < valores.length; i++) {
    var f = valores[i], t = f[0] instanceof Date ? f[0].getTime() : Date.parse(f[0]);
    if (!t || t < desde) continue;
    if (f[1] === 'queja') {
      mensajes.push({ t: t, local: f[2], mesa: String(f[3]), via: f[4], categoria: f[6], texto: f[7], contacto: !!f[8] });
    }
    eventos.push([t, f[1], f[2], String(f[3]), f[4]]);
  }
  return salida_({ ok: true, generado: Date.now(), eventos: eventos, mensajes: mensajes });
}

function salida_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
