/** Paste into Google Sheets > Extensions > Apps Script.
 * Script properties: CEIBA_EXPORT_URL, CEIBA_EXPORT_TOKEN, CEIBA_SPREADSHEET_ID.
 * The CEIBA Registros tab is managed by this script; keep manual notes elsewhere.
 */
function sincronizarCeiba() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) return;
  try {
    const props = PropertiesService.getScriptProperties();
    const url = props.getProperty('CEIBA_EXPORT_URL');
    const token = props.getProperty('CEIBA_EXPORT_TOKEN');
    const id = props.getProperty('CEIBA_SPREADSHEET_ID');
    if (!url || !token || !id) throw new Error('Configura las tres propiedades CEIBA.');
    if (!url.startsWith('https://')) throw new Error('La API debe usar HTTPS.');

    const response = UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true,
      followRedirects: false,
    });
    if (response.getResponseCode() !== 200) {
      throw new Error('La API respondio HTTP ' + response.getResponseCode() + '. La hoja no fue modificada.');
    }
    const data = JSON.parse(response.getContentText());
    if (!Array.isArray(data.attendees) || data.total !== data.attendees.length) {
      throw new Error('Respuesta incompleta. La hoja no fue modificada.');
    }
    // Neutralize formulas in user-provided values before writing to Sheets.
    const text = value => {
      const str = value == null ? '' : String(value);
      return /^[\s]*[=+@-]/.test(str) ? "'" + str : str;
    };
    const rows = [['ID', 'Nombre', 'Apellido', 'Correo', 'Organizacion', 'Cargo',
      'LinkedIn', 'Estado', 'Eventos', 'Trae invitado', 'ID de quien invita',
      'Registro (UTC)', 'Actualizacion (UTC)', 'Confirmacion enviada (UTC)']];
    data.attendees.forEach(a => rows.push([
      a.id, a.name, a.surname, a.email, a.organization, a.role, a.linkedin,
      a.status, a.events.join(', '), a.bringsGuest ? 'Si' : 'No', a.invitedById,
      a.createdAt, a.updatedAt, a.confirmationSentAt,
    ].map(text)));

    const book = SpreadsheetApp.openById(id);
    const sheet = book.getSheetByName('CEIBA Registros') || book.insertSheet('CEIBA Registros');
    const previousRows = sheet.getLastRow();
    if (sheet.getMaxRows() < rows.length) {
      sheet.insertRowsAfter(sheet.getMaxRows(), rows.length - sheet.getMaxRows());
    }
    if (sheet.getMaxColumns() < rows[0].length) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), rows[0].length - sheet.getMaxColumns());
    }
    sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
    if (previousRows > rows.length) {
      sheet.getRange(rows.length + 1, 1, previousRows - rows.length, rows[0].length).clearContent();
    }
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, rows[0].length).setFontWeight('bold');
    sheet.getRange('A1').setNote('Ultima sincronizacion UTC: ' + data.exportedAt);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
}

/** Run once after a successful manual sync. Does not create duplicate triggers. */
function activarSincronizacionCadaHora() {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'sincronizarCeiba') ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger('sincronizarCeiba').timeBased().everyHours(1).create();
}
