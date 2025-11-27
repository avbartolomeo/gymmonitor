# API Reference - Gym Tracker

## 📋 Índice

1. [Migración de Rutinas](#migración-de-rutinas)
2. [Gestión de Ejercicios](#gestión-de-ejercicios)
3. [Operaciones CRUD Básicas](#operaciones-crud-básicas)
4. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🔄 Migración de Rutinas

### `migrate_routine`
Migra automáticamente la rutina desde la hoja `RUTINA_ENTRENAMIENTO` al nuevo formato de `Fases`.

**Endpoint POST:**
```javascript
{
  "action": "migrate_routine"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "message": "Migración completada",
    "phasesFound": 3,
    "phasesMigrated": 3,
    "details": {
      "1": {
        "name": "Fase 1 - Adaptación",
        "routine": {
          "Lunes": [...],
          "Martes": [...]
        }
      }
    }
  }
}
```

**¿Cómo funciona?**
- Detecta automáticamente las fases en la hoja vieja
- Identifica los días de la semana
- Extrae todos los ejercicios con sus propiedades
- Asigna IDs automáticos a cada ejercicio
- Guarda todo en el nuevo formato de `Fases`

---

## ✏️ Gestión de Ejercicios

### 1. Agregar Ejercicio a una Fase

**Endpoint POST:**
```javascript
{
  "action": "add_exercise_to_phase",
  "phaseNumber": 1,
  "day": "Lunes",
  "exercise": {
    "ejercicio": "Press de banca",
    "series": "4",
    "reps": "8-10",
    "descanso": "2 min",
    "notas": "Peso progresivo"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "phaseNumber": 1,
    "day": "Lunes",
    "exercise": {
      "id": 5,
      "ejercicio": "Press de banca",
      "series": "4",
      "reps": "8-10",
      "descanso": "2 min",
      "notas": "Peso progresivo"
    },
    "message": "Ejercicio agregado correctamente"
  }
}
```

**Características:**
- Asigna ID automático si no se proporciona
- Crea el día automáticamente si no existe
- Actualiza timestamp de última modificación

---

### 2. Actualizar Ejercicio

**Endpoint POST:**
```javascript
{
  "action": "update_exercise_in_phase",
  "phaseNumber": 1,
  "day": "Lunes",
  "exerciseId": 5,
  "updates": {
    "series": "5",
    "reps": "10-12",
    "notas": "Aumentar peso gradualmente"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "phaseNumber": 1,
    "day": "Lunes",
    "exerciseId": 5,
    "updates": { "series": "5", "reps": "10-12", "notas": "Aumentar peso gradualmente" },
    "message": "Ejercicio actualizado correctamente"
  }
}
```

**Características:**
- Actualiza solo los campos proporcionados
- Mantiene el ID original
- No afecta otros ejercicios

---

### 3. Eliminar Ejercicio

**Endpoint POST:**
```javascript
{
  "action": "remove_exercise_from_phase",
  "phaseNumber": 1,
  "day": "Lunes",
  "exerciseId": 5
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "phaseNumber": 1,
    "day": "Lunes",
    "exerciseId": 5,
    "message": "Ejercicio eliminado correctamente"
  }
}
```

---

## 📚 Operaciones CRUD Básicas

### Guardar Fase Completa

**Endpoint POST:**
```javascript
{
  "action": "save_phase",
  "payload": {
    "phaseNumber": 1,
    "name": "Fase 1 - Adaptación Anatómica",
    "routine": {
      "Lunes": [
        {
          "id": 1,
          "ejercicio": "Press de banca",
          "series": "4",
          "reps": "8-10",
          "descanso": "2 min",
          "notas": ""
        },
        {
          "id": 2,
          "ejercicio": "Remo con barra",
          "series": "4",
          "reps": "8-10",
          "descanso": "2 min",
          "notas": ""
        }
      ],
      "Miércoles": [...]
    }
  }
}
```

### Obtener Todas las Fases

**Endpoint GET:**
```
?action=get_phases
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "1": {
      "name": "Fase 1 - Adaptación",
      "routine": {
        "Lunes": [...],
        "Miércoles": [...],
        "Viernes": [...]
      }
    },
    "2": {
      "name": "Fase 2 - Hipertrofia",
      "routine": {...}
    }
  }
}
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Migración Inicial

```javascript
// 1. Ejecutar migración desde Apps Script
function ejecutarMigracion() {
  const resultado = migrateRoutineFromOldSheet();
  Logger.log(resultado);
}

// 2. O desde la app web (una vez implementado el frontend)
fetch(SCRIPT_URL, {
  method: 'POST',
  body: JSON.stringify({
    action: 'migrate_routine'
  })
})
.then(r => r.json())
.then(data => console.log('Migración:', data));
```

### Ejemplo 2: Agregar Ejercicio Nuevo

```javascript
async function agregarEjercicio() {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'add_exercise_to_phase',
      phaseNumber: 1,
      day: 'Viernes',
      exercise: {
        ejercicio: 'Peso muerto',
        series: '4',
        reps: '6-8',
        descanso: '3 min',
        notas: 'Cuidar la técnica'
      }
    })
  });
  
  const result = await response.json();
  console.log('Nuevo ejercicio ID:', result.data.exercise.id);
}
```

### Ejemplo 3: Editar Ejercicio Existente

```javascript
async function modificarEjercicio(phaseNumber, day, exerciseId) {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'update_exercise_in_phase',
      phaseNumber: phaseNumber,
      day: day,
      exerciseId: exerciseId,
      updates: {
        series: '5',
        reps: '12-15',
        notas: 'Reducir peso, aumentar volumen'
      }
    })
  });
  
  return await response.json();
}
```

### Ejemplo 4: Eliminar Ejercicio

```javascript
async function eliminarEjercicio(phaseNumber, day, exerciseId) {
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'remove_exercise_from_phase',
      phaseNumber: phaseNumber,
      day: day,
      exerciseId: exerciseId
    })
  });
  
  return await response.json();
}
```

---

## 🧪 Testing en Apps Script

### Test de Migración

```javascript
function testMigracion() {
  const resultado = migrateRoutineFromOldSheet();
  Logger.log('Resultado:', JSON.stringify(resultado, null, 2));
}
```

### Test de Gestión de Ejercicios

```javascript
function testGestionEjercicios() {
  // Ver función completa en GoogleAppsScript.js
  testGestionEjercicios();
}
```

---

## 🎯 Próximos Pasos

1. **Ejecutar migración**: Corre `testMigracion()` en Apps Script
2. **Verificar datos**: Revisa la hoja `Fases` en Google Sheets
3. **Crear deployment**: Nueva implementación del script
4. **Implementar frontend**: Agregar UI para gestión de ejercicios
5. **Conectar con localStorage**: Migrar datos del navegador

---

## 🔍 Troubleshooting

### Error: "Fase no encontrada"
- Verifica que la fase existe ejecutando `get_phases`
- Asegúrate de usar el número correcto de fase

### Error: "Ejercicio no encontrado"
- El ID del ejercicio no existe en ese día
- Verifica con `get_phases` los IDs actuales

### Error: "No se encontró la hoja RUTINA_ENTRENAMIENTO"
- La hoja vieja no existe o tiene otro nombre
- Verifica el nombre exacto en tu Google Sheet
