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
      case 'add_exercise_to_phase':
        result = addExerciseToPhase(data.phaseNumber, data.day, data.exercise);
        break;
      case 'remove_exercise_from_phase':
        result = removeExerciseFromPhase(data.phaseNumber, data.day, data.exerciseId);
        break;
      case 'update_exercise_in_phase':
        result = updateExerciseInPhase(data.phaseNumber, data.day, data.exerciseId, data.updates);
        break;
      case 'migrate_routine':
        result = migrateRoutineFromOldSheet();
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
    // Convertir fecha a string YYYY-MM-DD si es un objeto Date
    let dateStr = row[0];
    if (dateStr instanceof Date) {
      dateStr = Utilities.formatDate(dateStr, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }
    const workoutPhase = row[1];
    
    // Si la fila está vacía, saltar
    if (!dateStr && !workoutPhase) continue;
    
    // Filtrar por rango de fechas y fase
    if ((!startDate || dateStr >= startDate) && 
        (!endDate || dateStr <= endDate) &&
        (!phase || workoutPhase == phase)) {
      workouts.push({
        date: dateStr,
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
    // Convertir fecha a string YYYY-MM-DD si es un objeto Date
    let dateStr = row[0];
    if (dateStr instanceof Date) {
      dateStr = Utilities.formatDate(dateStr, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    }
    
    // Si la fila está vacía, saltar
    if (!dateStr) continue;
    
    if ((!startDate || dateStr >= startDate) && (!endDate || dateStr <= endDate)) {
      nutrition.push({
        date: dateStr,
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

// Agregar ejercicio a una fase específica
function addExerciseToPhase(phaseNumber, day, exercise) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEETS.PHASES);
  
  if (!sheet) {
    return { error: 'No existe la hoja de Fases' };
  }
  
  // Buscar la fase
  const data = sheet.getDataRange().getValues();
  let phaseRow = -1;
  let currentRoutine = {};
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == phaseNumber) {
      phaseRow = i + 1;
      currentRoutine = JSON.parse(data[i][2] || '{}');
      break;
    }
  }
  
  if (phaseRow === -1) {
    return { error: 'Fase no encontrada: ' + phaseNumber };
  }
  
  // Inicializar el día si no existe
  if (!currentRoutine[day]) {
    currentRoutine[day] = [];
  }
  
  // Asignar ID automático si no viene
  if (!exercise.id) {
    const maxId = currentRoutine[day].reduce((max, ex) => Math.max(max, ex.id || 0), 0);
    exercise.id = maxId + 1;
  }
  
  // Agregar el ejercicio
  currentRoutine[day].push(exercise);
  
  // Actualizar la hoja
  const timestamp = new Date().toISOString();
  sheet.getRange(phaseRow, 3).setValue(JSON.stringify(currentRoutine));
  sheet.getRange(phaseRow, 4).setValue(timestamp);
  
  return { 
    success: true, 
    phaseNumber, 
    day, 
    exercise,
    message: 'Ejercicio agregado correctamente'
  };
}

// Eliminar ejercicio de una fase
function removeExerciseFromPhase(phaseNumber, day, exerciseId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEETS.PHASES);
  
  if (!sheet) {
    return { error: 'No existe la hoja de Fases' };
  }
  
  const data = sheet.getDataRange().getValues();
  let phaseRow = -1;
  let currentRoutine = {};
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == phaseNumber) {
      phaseRow = i + 1;
      currentRoutine = JSON.parse(data[i][2] || '{}');
      break;
    }
  }
  
  if (phaseRow === -1 || !currentRoutine[day]) {
    return { error: 'Fase o día no encontrado' };
  }
  
  // Filtrar el ejercicio
  const originalLength = currentRoutine[day].length;
  currentRoutine[day] = currentRoutine[day].filter(ex => ex.id != exerciseId);
  
  if (currentRoutine[day].length === originalLength) {
    return { error: 'Ejercicio no encontrado: ' + exerciseId };
  }
  
  // Actualizar la hoja
  const timestamp = new Date().toISOString();
  sheet.getRange(phaseRow, 3).setValue(JSON.stringify(currentRoutine));
  sheet.getRange(phaseRow, 4).setValue(timestamp);
  
  return { 
    success: true, 
    phaseNumber, 
    day, 
    exerciseId,
    message: 'Ejercicio eliminado correctamente'
  };
}

// Actualizar ejercicio en una fase
function updateExerciseInPhase(phaseNumber, day, exerciseId, updates) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEETS.PHASES);
  
  if (!sheet) {
    return { error: 'No existe la hoja de Fases' };
  }
  
  const data = sheet.getDataRange().getValues();
  let phaseRow = -1;
  let currentRoutine = {};
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == phaseNumber) {
      phaseRow = i + 1;
      currentRoutine = JSON.parse(data[i][2] || '{}');
      break;
    }
  }
  
  if (phaseRow === -1 || !currentRoutine[day]) {
    return { error: 'Fase o día no encontrado' };
  }
  
  // Buscar y actualizar el ejercicio
  let found = false;
  currentRoutine[day] = currentRoutine[day].map(ex => {
    if (ex.id == exerciseId) {
      found = true;
      return { ...ex, ...updates, id: ex.id }; // Mantener el ID original
    }
    return ex;
  });
  
  if (!found) {
    return { error: 'Ejercicio no encontrado: ' + exerciseId };
  }
  
  // Actualizar la hoja
  const timestamp = new Date().toISOString();
  sheet.getRange(phaseRow, 3).setValue(JSON.stringify(currentRoutine));
  sheet.getRange(phaseRow, 4).setValue(timestamp);
  
  return { 
    success: true, 
    phaseNumber, 
    day, 
    exerciseId,
    updates,
    message: 'Ejercicio actualizado correctamente'
  };
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

// ==================== MIGRACIÓN ====================

function migrateRoutineFromOldSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const oldSheet = ss.getSheetByName('RUTINA_ENTRENAMIENTO');
  
  if (!oldSheet) {
    return { 
      error: 'No se encontró la hoja RUTINA_ENTRENAMIENTO',
      message: 'La hoja a migrar no existe'
    };
  }
  
  Logger.log('Iniciando migración de rutina...');
  
  // Leer toda la estructura de la hoja vieja
  const data = oldSheet.getDataRange().getValues();
  Logger.log('Total de filas en RUTINA_ENTRENAMIENTO: ' + data.length);
  
  // Estructura esperada: cada fila puede tener Fase, Día, y luego ejercicios
  // Vamos a intentar detectar automáticamente la estructura
  
  const phases = {};
  let currentPhase = null;
  let currentDay = null;
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    
    // Detectar si es un encabezado de fase
    if (row[0] && String(row[0]).toLowerCase().includes('fase')) {
      // Extraer número de fase
      const match = String(row[0]).match(/(\d+)/);
      if (match) {
        currentPhase = parseInt(match[1]);
        if (!phases[currentPhase]) {
          phases[currentPhase] = {
            name: row[0],
            routine: {}
          };
        }
        Logger.log('Detectada Fase: ' + currentPhase);
      }
      continue;
    }
    
    // Detectar si es un día de la semana
    const dias = ['lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes', 'sábado', 'sabado', 'domingo'];
    const cellValue = String(row[0]).toLowerCase();
    const isDia = dias.some(dia => cellValue.includes(dia));
    
    if (isDia && currentPhase) {
      // Normalizar nombre del día
      currentDay = row[0].toString().trim();
      currentDay = currentDay.charAt(0).toUpperCase() + currentDay.slice(1).toLowerCase();
      
      if (!phases[currentPhase].routine[currentDay]) {
        phases[currentPhase].routine[currentDay] = [];
      }
      Logger.log('Detectado Día: ' + currentDay + ' en Fase ' + currentPhase);
      continue;
    }
    
    // Si tenemos fase y día, y hay datos en las columnas, es un ejercicio
    if (currentPhase && currentDay && row[1]) {
      const exercise = {
        id: phases[currentPhase].routine[currentDay].length + 1,
        ejercicio: row[1] || '',
        series: row[2] || '',
        reps: row[3] || '',
        descanso: row[4] || '',
        notas: row[5] || ''
      };
      
      phases[currentPhase].routine[currentDay].push(exercise);
      Logger.log('  Ejercicio agregado: ' + exercise.ejercicio);
    }
  }
  
  // Guardar todas las fases en la nueva estructura
  let migratedCount = 0;
  Object.keys(phases).forEach(phaseNumber => {
    const phase = phases[phaseNumber];
    savePhase({
      phaseNumber: parseInt(phaseNumber),
      name: phase.name,
      routine: phase.routine
    });
    migratedCount++;
    Logger.log('Fase ' + phaseNumber + ' guardada con ' + Object.keys(phase.routine).length + ' días');
  });
  
  return {
    success: true,
    message: 'Migración completada',
    phasesFound: Object.keys(phases).length,
    phasesMigrated: migratedCount,
    details: phases
  };
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

// Test de gestión de ejercicios
function testGestionEjercicios() {
  Logger.log('========================================');
  Logger.log('TEST DE GESTIÓN DE EJERCICIOS');
  Logger.log('========================================\n');
  
  // TEST 1: Agregar ejercicio a fase existente
  Logger.log('TEST 1: Agregar ejercicio');
  Logger.log('---------------------------');
  const addResult = addExerciseToPhase(1, 'Lunes', {
    ejercicio: 'Sentadilla',
    series: '4',
    reps: '8-10',
    descanso: '2 min',
    notas: 'Peso progresivo'
  });
  Logger.log('Resultado: ' + JSON.stringify(addResult) + '\n');
  
  // TEST 2: Actualizar ejercicio
  Logger.log('TEST 2: Actualizar ejercicio');
  Logger.log('-----------------------------');
  const updateResult = updateExerciseInPhase(1, 'Lunes', addResult.exercise.id, {
    series: '5',
    reps: '10-12',
    notas: 'Aumentar peso'
  });
  Logger.log('Resultado: ' + JSON.stringify(updateResult) + '\n');
  
  // TEST 3: Leer fase actualizada
  Logger.log('TEST 3: Verificar cambios');
  Logger.log('-------------------------');
  const phases = getPhases();
  Logger.log('Fase 1: ' + JSON.stringify(phases[1]) + '\n');
  
  // TEST 4: Eliminar ejercicio
  Logger.log('TEST 4: Eliminar ejercicio');
  Logger.log('--------------------------');
  const removeResult = removeExerciseFromPhase(1, 'Lunes', addResult.exercise.id);
  Logger.log('Resultado: ' + JSON.stringify(removeResult) + '\n');
  
  // TEST 5: Verificar eliminación
  Logger.log('TEST 5: Verificar eliminación');
  Logger.log('------------------------------');
  const phasesAfter = getPhases();
  Logger.log('Fase 1 después de eliminar: ' + JSON.stringify(phasesAfter[1]) + '\n');
  
  Logger.log('========================================');
  Logger.log('TEST DE GESTIÓN FINALIZADO ✓');
  Logger.log('========================================');
}

// Test de migración
function testMigracion() {
  Logger.log('========================================');
  Logger.log('TEST DE MIGRACIÓN DE RUTINA');
  Logger.log('========================================\n');
  
  const result = migrateRoutineFromOldSheet();
  
  Logger.log('Resultado de migración:');
  Logger.log(JSON.stringify(result, null, 2));
  
  if (result.success) {
    Logger.log('\n✓ Migración exitosa');
    Logger.log('Fases encontradas: ' + result.phasesFound);
    Logger.log('Fases migradas: ' + result.phasesMigrated);
    
    Logger.log('\nVerificando fases migradas...');
    const phases = getPhases();
    Object.keys(phases).forEach(phaseNum => {
      Logger.log('\nFase ' + phaseNum + ': ' + phases[phaseNum].name);
      Object.keys(phases[phaseNum].routine).forEach(day => {
        Logger.log('  ' + day + ': ' + phases[phaseNum].routine[day].length + ' ejercicios');
      });
    });
  } else {
    Logger.log('\n✗ Error en migración: ' + result.error);
  }
  
  Logger.log('\n========================================');
  Logger.log('TEST DE MIGRACIÓN FINALIZADO');
  Logger.log('========================================');
}
