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

// Nombres de las hojas
const SHEETS = {
  WORKOUTS: 'Entrenamientos',
  NUTRITION: 'Nutricion',
  GOALS: 'Metas',
  PHASES: 'Fases',
  CONFIG: 'Configuracion'
};

// Función principal que maneja todas las peticiones
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    let result;
    switch(action) {
      case 'save_workout':
        result = saveWorkout(data.payload);
        break;
      case 'get_workouts':
        result = getWorkouts(data.startDate, data.endDate, data.phase);
        break;
      case 'save_nutrition':
        result = saveNutrition(data.payload);
        break;
      case 'get_nutrition':
        result = getNutrition(data.startDate, data.endDate);
        break;
      case 'save_goals':
        result = saveGoals(data.payload);
        break;
      case 'get_goals':
        result = getGoals();
        break;
      case 'save_phase':
        result = savePhase(data.payload);
        break;
      case 'get_phases':
        result = getPhases();
        break;
      case 'get_current_phase':
        result = getCurrentPhase();
        break;
      case 'set_current_phase':
        result = setCurrentPhase(data.phaseId);
        break;
      default:
        return response({error: 'Acción desconocida: ' + action}, 400);
    }
    
    return response({success: true, data: result});
  } catch(error) {
    return response({error: error.toString(), stack: error.stack}, 500);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    let result;
    switch(action) {
      case 'get_workouts':
        result = getWorkouts(e.parameter.startDate, e.parameter.endDate, e.parameter.phase);
        break;
      case 'get_nutrition':
        result = getNutrition(e.parameter.startDate, e.parameter.endDate);
        break;
      case 'get_goals':
        result = getGoals();
        break;
      case 'get_phases':
        result = getPhases();
        break;
      case 'get_current_phase':
        result = getCurrentPhase();
        break;
      default:
        return response({error: 'Acción desconocida: ' + action}, 400);
    }
    return response({success: true, data: result});
  } catch(error) {
    return response({error: error.toString()}, 500);
  }
}

// ==================== ENTRENAMIENTOS ====================

function saveWorkout(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = getOrCreateSheet(ss, SHEETS.WORKOUTS, 
    ['fecha', 'fase', 'ejercicioId', 'completado', 'peso', 'reps', 'timestamp']);
  
  const { date, phase, exerciseId, completed, weight, actualReps } = payload;
  const timestamp = new Date().toISOString();
  
  // Buscar si ya existe este registro
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === date && data[i][1] == phase && data[i][2] == exerciseId) {
      rowIndex = i + 1;
      break;
    }
  }
  
  const rowData = [date, phase, exerciseId, completed, weight || '', actualReps || '', timestamp];
  
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, 7).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  
  return { saved: true, date, phase, exerciseId };
}

function getWorkouts(startDate, endDate, phase) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.WORKOUTS);
  
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const workouts = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const date = row[0];
    const workoutPhase = row[1];
    
    // Filtrar por rango de fechas y fase
    if ((!startDate || date >= startDate) && 
        (!endDate || date <= endDate) &&
        (!phase || workoutPhase == phase)) {
      workouts.push({
        date: date,
        phase: workoutPhase,
        exerciseId: row[2],
        completed: row[3],
        weight: row[4],
        actualReps: row[5],
        timestamp: row[6]
      });
    }
  }
  
  return workouts;
}

// ==================== NUTRICIÓN ====================

function saveNutrition(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = getOrCreateSheet(ss, SHEETS.NUTRITION,
    ['fecha', 'calorias', 'proteina', 'timestamp']);
  
  const { date, calories, protein } = payload;
  const timestamp = new Date().toISOString();
  
  // Buscar si ya existe este registro
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === date) {
      rowIndex = i + 1;
      break;
    }
  }
  
  const rowData = [date, calories, protein, timestamp];
  
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, 4).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  
  return { saved: true, date };
}

function getNutrition(startDate, endDate) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.NUTRITION);
  
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  const nutrition = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const date = row[0];
    
    if ((!startDate || date >= startDate) && (!endDate || date <= endDate)) {
      nutrition.push({
        date: date,
        calories: row[1],
        protein: row[2],
        timestamp: row[3]
      });
    }
  }
  
  return nutrition;
}

// ==================== METAS ====================

function saveGoals(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = getOrCreateSheet(ss, SHEETS.GOALS,
    ['nombre', 'valor', 'timestamp']);
  
  const timestamp = new Date().toISOString();
  
  // Limpiar hoja y guardar nuevas metas
  const data = sheet.getDataRange().getValues();
  if (data.length > 1) {
    sheet.getRange(2, 1, data.length - 1, 3).clearContent();
  }
  
  // Guardar cada meta
  Object.keys(payload).forEach(key => {
    sheet.appendRow([key, payload[key], timestamp]);
  });
  
  return { saved: true };
}

function getGoals() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.GOALS);
  
  if (!sheet) return {};
  
  const data = sheet.getDataRange().getValues();
  const goals = {};
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    goals[row[0]] = row[1];
  }
  
  return goals;
}

// ==================== FASES ====================

function savePhase(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = getOrCreateSheet(ss, SHEETS.PHASES,
    ['numeroFase', 'nombre', 'rutina', 'timestamp']);
  
  const { phaseNumber, name, routine } = payload;
  const timestamp = new Date().toISOString();
  
  // Buscar si ya existe esta fase
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == phaseNumber) {
      rowIndex = i + 1;
      break;
    }
  }
  
  const routineStr = JSON.stringify(routine);
  const rowData = [phaseNumber, name, routineStr, timestamp];
  
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, 4).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
  
  return { saved: true, phaseNumber };
}

function getPhases() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.PHASES);
  
  if (!sheet) return {};
  
  const data = sheet.getDataRange().getValues();
  const phases = {};
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const phaseNumber = row[0];
    phases[phaseNumber] = {
      name: row[1],
      routine: JSON.parse(row[2] || '{}')
    };
  }
  
  return phases;
}

// ==================== CONFIGURACIÓN ====================

function getCurrentPhase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEETS.CONFIG);
  
  if (!sheet) {
    sheet = getOrCreateSheet(ss, SHEETS.CONFIG, ['clave', 'valor', 'timestamp']);
    sheet.appendRow(['currentPhase', '1', new Date().toISOString()]);
    return 1;
  }
  
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'currentPhase') {
      return data[i][1];
    }
  }
  
  return 1;
}

function setCurrentPhase(phaseId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = getOrCreateSheet(ss, SHEETS.CONFIG, ['clave', 'valor', 'timestamp']);
  
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === 'currentPhase') {
      rowIndex = i + 1;
      break;
    }
  }
  
  const timestamp = new Date().toISOString();
  
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 2).setValue(phaseId);
    sheet.getRange(rowIndex, 3).setValue(timestamp);
  } else {
    sheet.appendRow(['currentPhase', phaseId, timestamp]);
  }
  
  return { saved: true, phaseId };
}

// ==================== UTILIDADES ====================

function getOrCreateSheet(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  
  return sheet;
}

// Función helper para respuestas HTTP
function response(data, statusCode = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==================== FUNCIONES DE TEST ====================

function testCompleto() {
  Logger.log('========================================');
  Logger.log('INICIANDO PRUEBA COMPLETA DEL SISTEMA');
  Logger.log('========================================\n');
  
  // TEST 1: Guardar entrenamientos
  Logger.log('TEST 1: Guardar entrenamientos');
  Logger.log('--------------------------------');
  
  const workout1 = saveWorkout({
    date: '2025-11-25',
    phase: 1,
    exerciseId: 1,
    completed: true,
    weight: 50,
    actualReps: 12
  });
  Logger.log('✓ Workout 1 guardado: ' + JSON.stringify(workout1));
  
  const workout2 = saveWorkout({
    date: '2025-11-25',
    phase: 1,
    exerciseId: 2,
    completed: true,
    weight: 30,
    actualReps: 10
  });
  Logger.log('✓ Workout 2 guardado: ' + JSON.stringify(workout2));
  
  const workout3 = saveWorkout({
    date: '2025-11-26',
    phase: 1,
    exerciseId: 5,
    completed: true,
    weight: '',
    actualReps: ''
  });
  Logger.log('✓ Workout 3 guardado: ' + JSON.stringify(workout3) + '\n');
  
  // TEST 2: Leer entrenamientos
  Logger.log('TEST 2: Leer entrenamientos');
  Logger.log('----------------------------');
  const workouts = getWorkouts('2025-11-20', '2025-11-27', 1);
  Logger.log('Total entrenamientos encontrados: ' + workouts.length);
  Logger.log('Datos: ' + JSON.stringify(workouts) + '\n');
  
  // TEST 3: Guardar nutrición
  Logger.log('TEST 3: Guardar nutrición');
  Logger.log('-------------------------');
  
  const nutrition1 = saveNutrition({
    date: '2025-11-25',
    calories: 2200,
    protein: 160
  });
  Logger.log('✓ Nutrición 1 guardada: ' + JSON.stringify(nutrition1));
  
  const nutrition2 = saveNutrition({
    date: '2025-11-26',
    calories: 2500,
    protein: 180
  });
  Logger.log('✓ Nutrición 2 guardada: ' + JSON.stringify(nutrition2) + '\n');
  
  // TEST 4: Leer nutrición
  Logger.log('TEST 4: Leer nutrición');
  Logger.log('----------------------');
  const nutritionData = getNutrition('2025-11-20', '2025-11-27');
  Logger.log('Total registros de nutrición: ' + nutritionData.length);
  Logger.log('Datos: ' + JSON.stringify(nutritionData) + '\n');
  
  // TEST 5: Guardar metas
  Logger.log('TEST 5: Guardar metas');
  Logger.log('---------------------');
  const goalsResult = saveGoals({
    calories: 2000,
    protein: 150,
    workouts: 4
  });
  Logger.log('✓ Metas guardadas: ' + JSON.stringify(goalsResult) + '\n');
  
  // TEST 6: Leer metas
  Logger.log('TEST 6: Leer metas');
  Logger.log('------------------');
  const goals = getGoals();
  Logger.log('Metas: ' + JSON.stringify(goals) + '\n');
  
  // TEST 7: Guardar fase
  Logger.log('TEST 7: Guardar fase');
  Logger.log('--------------------');
  const phaseResult = savePhase({
    phaseNumber: 1,
    name: 'Fase 1 - Adaptación',
    routine: {
      Lunes: [{id: 1, ejercicio: 'Press de banca'}],
      Martes: [{id: 5, ejercicio: 'Cardio'}]
    }
  });
  Logger.log('✓ Fase guardada: ' + JSON.stringify(phaseResult) + '\n');
  
  // TEST 8: Leer fases
  Logger.log('TEST 8: Leer fases');
  Logger.log('------------------');
  const phases = getPhases();
  Logger.log('Fases: ' + JSON.stringify(phases) + '\n');
  
  // TEST 9: Configuración de fase actual
  Logger.log('TEST 9: Configuración');
  Logger.log('---------------------');
  const setPhaseResult = setCurrentPhase(1);
  Logger.log('✓ Fase actual establecida: ' + JSON.stringify(setPhaseResult));
  
  const currentPhase = getCurrentPhase();
  Logger.log('Fase actual: ' + currentPhase + '\n');
  
  // TEST 10: Verificar hojas creadas
  Logger.log('TEST 10: Verificar hojas');
  Logger.log('------------------------');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  Logger.log('Total de hojas: ' + sheets.length);
  Logger.log('Nombres de hojas:');
  sheets.forEach(sheet => {
    Logger.log('  - ' + sheet.getName() + ' (' + sheet.getLastRow() + ' filas)');
  });
  
  Logger.log('\n========================================');
  Logger.log('PRUEBA COMPLETA FINALIZADA ✓');
  Logger.log('========================================');
  Logger.log('\nAhora puedes:');
  Logger.log('1. Revisar las hojas creadas en tu Google Sheet');
  Logger.log('2. Crear nueva implementación del script');
  Logger.log('3. Probar la URL desde el navegador');
}
