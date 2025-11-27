# 🔄 Guía de Migración a Google Sheets como Base de Datos

## ⚠️ IMPORTANTE: Lee esto antes de continuar

Esta migración cambia completamente cómo se almacenan los datos en la aplicación:

### Antes (Sistema Actual)
- ❌ Datos duplicados en localStorage Y Google Sheets
- ❌ Sincronización manual requerida
- ❌ Posibles inconsistencias entre local y cloud
- ❌ Límite de almacenamiento localStorage (~10MB)

### Después (Nuevo Sistema)
- ✅ Google Sheets como ÚNICA fuente de verdad
- ✅ Sincronización automática en tiempo real
- ✅ Sin duplicación de datos
- ✅ Almacenamiento ilimitado
- ✅ Acceso desde cualquier dispositivo
- ✅ Historial completo sin límites

## 📋 Pasos de Migración

### 1. Actualizar Google Apps Script

1. Ve a tu Google Sheet
2. **Extensiones** → **Apps Script**
3. **Borra TODO el código existente**
4. Copia y pega el contenido de `GoogleAppsScript.js` actualizado
5. **Guarda** (Ctrl+S)
6. **Implementar** → **Nueva implementación**
   - Tipo: "Aplicación web"
   - Ejecutar como: "Yo"
   - Acceso: "Cualquier persona"
7. **Copia la nueva URL** que te da
8. **Importante:** Prueba que funcione ejecutando las funciones de test:
   - Ejecutar → `testSaveWorkout`
   - Ejecutar → `testGetWorkouts`
   - Verifica que se crearon las hojas: `Entrenamientos`, `Nutricion`, `Metas`, `Fases`, `Configuracion`

### 2. Migrar Datos Existentes

Tienes **dos opciones**:

#### Opción A: Migración Automática (Recomendada)
1. Ve a la app actualizada
2. Configura la nueva URL del script
3. Click en "Migrar Datos"
4. La app convertirá automáticamente tus datos de localStorage a Google Sheets

#### Opción B: Migración Manual
1. Exporta tus datos actuales (botón "Exportar Datos")
2. Guarda el JSON como backup
3. Sigue la Opción A

### 3. Verificar Migración

1. Abre tu Google Sheet
2. Verifica que existen estas hojas:
   - **Entrenamientos**: Con tus ejercicios completados
   - **Nutricion**: Con tus registros de comidas
   - **Metas**: Con tus objetivos
   - **Fases**: Con tus fases de entrenamiento
   - **Configuracion**: Con la fase actual
3. Verifica que los datos son correctos

### 4. Limpieza (Opcional)

Una vez verificado que todo funciona:
1. Abre las DevTools (F12)
2. Consola → `localStorage.clear()`
3. Refresca la página
4. Todo debería seguir funcionando, leyendo desde Google Sheets

## 🔧 Estructura de las Hojas

### Entrenamientos
| fecha | fase | ejercicioId | completado | peso | reps | timestamp |
|-------|------|-------------|------------|------|------|-----------|
| 2025-11-25 | 1 | 1 | TRUE | 50 | 12 | 2025-11-25T10:00:00Z |

### Nutricion
| fecha | calorias | proteina | timestamp |
|-------|----------|----------|-----------|
| 2025-11-25 | 2200 | 160 | 2025-11-25T10:00:00Z |

### Metas
| nombre | valor | timestamp |
|--------|-------|-----------|
| calories | 2000 | 2025-11-25T10:00:00Z |
| protein | 150 | 2025-11-25T10:00:00Z |
| workouts | 4 | 2025-11-25T10:00:00Z |

### Fases
| numeroFase | nombre | rutina | timestamp |
|------------|--------|--------|-----------|
| 1 | Fase 1 - Adaptación | {JSON con rutina} | 2025-11-25T10:00:00Z |

### Configuracion
| clave | valor | timestamp |
|-------|-------|-----------|
| currentPhase | 1 | 2025-11-25T10:00:00Z |

## 🚀 Beneficios del Nuevo Sistema

1. **Sin Límites**: Tu historial puede crecer indefinidamente
2. **Multi-dispositivo**: Accede desde móvil, tablet, PC
3. **Backup Automático**: Google Drive hace backup automático
4. **Análisis Avanzado**: Usa Google Sheets para análisis personalizados
5. **Compartir**: Comparte datos con tu entrenador fácilmente
6. **Más Rápido**: Sin necesidad de sincronizar manualmente

## ⚠️ Consideraciones

- **Requiere conexión a internet** para funcionar
- Los datos ya NO están en localStorage
- La primera carga puede tardar 1-2 segundos más
- Cache en memoria mantiene la app rápida durante la sesión

## 🆘 Problemas Comunes

### "No se cargan los datos"
1. Verifica que la URL del script es correcta
2. Abre las DevTools y mira la consola por errores
3. Verifica que el script tiene permisos correctos

### "Datos desactualizados"
1. Refresca la página
2. Verifica tu conexión a internet
3. Mira la consola por errores de red

### "Quiero volver al sistema anterior"
1. Haz checkout del commit anterior en git
2. Restaura tu backup JSON exportado
3. Importa los datos

## 📞 Soporte

Si tienes problemas durante la migración, guarda:
1. Tu backup JSON (botón Exportar)
2. Screenshots de los errores en consola
3. URL del script de Google

Esto permitirá recuperar tus datos si algo sale mal.
