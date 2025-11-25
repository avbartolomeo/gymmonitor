// ============================================
// GOOGLE APPS SCRIPT - GYM TRACKER SYNC API
// ============================================
// 
// INSTRUCCIONES DE INSTALACIÓN:
// 1. Abre tu Google Sheet
// 2. Extensiones → Apps Script
// 3. Borra todo el código existente
// 4. Pega este código completo
// 5. Guarda (Ctrl+S)
// 6. Click en "Implementar" → "Nueva implementación"
// 7. Tipo: "Aplicación web"
// 8. Ejecutar como: "Yo"
// 9. Acceso: "Cualquier persona"
// 10. Click "Implementar"
// 11. Copia la URL que te da
// 12. Pega esa URL en la app (donde dice: SCRIPT_URL)

const SHEET_NAME = 'GYM_SYNC_DATA';

// Función principal que maneja todas las peticiones
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    let result;
    switch(action) {
      case 'sync_all':
        result = syncAllData(data.payload);
        break;
      case 'get_all':
        result = getAllData();
        break;
      case 'backup_create':
        result = createBackup(data.payload);
        break;
      default:
        return response({error: 'Acción desconocida'}, 400);
    }
    
    return response({success: true, data: result});
  } catch(error) {
    return response({error: error.toString()}, 500);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'get_all') {
    try {
      const result = getAllData();
      return response({success: true, data: result});
    } catch(error) {
      return response({error: error.toString()}, 500);
    }
  }
  
  return response({error: 'Usa POST para sincronizar'}, 400);
}

// Sincronizar todos los datos
function syncAllData(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Crear sheet si no existe
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    initializeSheet(sheet);
  }
  
  const timestamp = new Date().toISOString();
  
  // Guardar cada tipo de dato
  if (payload.workouts) {
    saveData(sheet, 'workouts', payload.workouts, timestamp);
  }
  
  if (payload.nutrition) {
    saveData(sheet, 'nutrition', payload.nutrition, timestamp);
  }
  
  if (payload.goals) {
    saveData(sheet, 'goals', payload.goals, timestamp);
  }
  
  if (payload.phases) {
    saveData(sheet, 'phases', payload.phases, timestamp);
  }
  
  if (payload.currentPhase) {
    saveData(sheet, 'currentPhase', payload.currentPhase, timestamp);
  }
  
  return {
    synced: true,
    timestamp: timestamp
  };
}

// Obtener todos los datos
function getAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    return {
      workouts: null,
      nutrition: null,
      goals: null,
      phases: null,
      currentPhase: null,
      lastSync: null
    };
  }
  
  const data = sheet.getDataRange().getValues();
  const result = {};
  
  // Saltar header (fila 0)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const key = row[0];
    const value = row[1];
    const timestamp = row[2];
    
    if (key && value) {
      result[key] = value;
      if (!result.lastSync || timestamp > result.lastSync) {
        result.lastSync = timestamp;
      }
    }
  }
  
  return result;
}

// Guardar un dato específico
function saveData(sheet, key, value, timestamp) {
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  // Buscar si ya existe
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      rowIndex = i + 1; // +1 porque getRange es 1-indexed
      break;
    }
  }
  
  const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
  
  if (rowIndex > 0) {
    // Actualizar fila existente
    sheet.getRange(rowIndex, 2).setValue(valueStr);
    sheet.getRange(rowIndex, 3).setValue(timestamp);
  } else {
    // Agregar nueva fila
    sheet.appendRow([key, valueStr, timestamp]);
  }
}

// Inicializar sheet con headers
function initializeSheet(sheet) {
  sheet.appendRow(['key', 'value', 'lastUpdated']);
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  sheet.setFrozenRows(1);
}

// Crear backup en una nueva pestaña
function createBackup(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `BACKUP_${timestamp}`;
  
  const backupSheet = ss.insertSheet(backupName);
  backupSheet.appendRow(['key', 'value', 'timestamp']);
  
  Object.keys(payload).forEach(key => {
    const value = typeof payload[key] === 'string' ? payload[key] : JSON.stringify(payload[key]);
    backupSheet.appendRow([key, value, timestamp]);
  });
  
  return {
    backupCreated: true,
    sheetName: backupName
  };
}

// Función helper para respuestas HTTP
function response(data, statusCode = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Función de test (opcional)
function testSync() {
  const testData = {
    action: 'sync_all',
    payload: {
      goals: '{"calories":2000,"protein":150,"workouts":4}',
      currentPhase: '1'
    }
  };
  
  const result = doPost({
    postData: {
      contents: JSON.stringify(testData)
    }
  });
  
  Logger.log(result.getContent());
}
