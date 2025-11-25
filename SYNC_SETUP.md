# ☁️ Guía de Sincronización con Google Sheets

## 🎯 ¿Qué es esto?

Con esta funcionalidad, tus datos se sincronizan automáticamente con **Google Sheets**, permitiéndote:

✅ **Acceder desde múltiples dispositivos** (celular, tablet, PC)
✅ **Backup automático en la nube** (Google guarda todo)
✅ **Editar datos desde Sheets** (si quieres)
✅ **Sincronización bidireccional** (subir y descargar)
✅ **Funciona offline** (sincroniza cuando vuelve internet)

---

## 🚀 Setup Completo (10 minutos)

### Paso 1: Preparar tu Google Sheet (2 min)

1. **Abre tu Google Sheet** donde está tu rutina
2. ¡Listo! No necesitas crear pestañas nuevas, el script lo hace solo

### Paso 2: Crear el Google Apps Script (5 min)

1. En tu Google Sheet, ve a: **Extensiones** → **Apps Script**

2. Verás un editor con algo de código. **Borra todo** (Ctrl+A → Delete)

3. **Copia TODO el contenido** del archivo `GoogleAppsScript.js`

4. **Pégalo** en el editor de Apps Script

5. **Guarda** el proyecto (Ctrl+S o ícono de diskette)
   - Dale un nombre si te pide: "Gym Sync API"

### Paso 3: Implementar como Web App (2 min)

1. Click en **"Implementar"** (botón azul arriba a la derecha) → **"Nueva implementación"**

2. Configuración:
   - **Tipo**: Selecciona "Aplicación web" (ícono de engranaje a la izquierda)
   - **Descripción**: "Gym Tracker Sync" (o lo que quieras)
   - **Ejecutar como**: **"Yo"** (tu cuenta de Google)
   - **Quién tiene acceso**: **"Cualquier persona"**
   
   ⚠️ **IMPORTANTE**: Debe ser "Cualquier persona" para que funcione desde GitHub Pages

3. Click en **"Implementar"**

4. Te pedirá autorización:
   - Click en **"Autorizar acceso"**
   - Selecciona tu cuenta de Google
   - Verás un aviso de "Google no verificó esta app" → Click en **"Avanzado"**
   - Click en **"Ir a Gym Sync API (no seguro)"**
   - Click en **"Permitir"**

5. ✅ **Copia la URL** que te da (algo como `https://script.google.com/macros/s/XXXXX/exec`)

### Paso 4: Configurar en la App (1 min)

1. Abre tu app en el celular

2. Ve a la pestaña **📊 Progreso**

3. Scroll hasta **"☁️ Sincronización con Google Sheets"**

4. **Pega la URL** que copiaste en el paso anterior

5. La URL se guarda automáticamente

6. ✅ Ya está configurado!

---

## 🔄 Cómo Usar

### Sincronización Automática

Una vez configurada la URL, la app sincroniza **automáticamente** cuando:
- ✅ Completas un ejercicio
- ✅ Guardas nutrición
- ✅ Cambias una meta

Todo sucede en segundo plano, **sin que te des cuenta**.

### Sincronización Manual

#### 🔄 Sincronizar Ahora (Subir a la nube)
- Click en **"🔄 Sincronizar Ahora"**
- Sube TODOS tus datos a Google Sheets
- Útil después de usar la app offline

#### ☁️ Descargar de Nube (Bajar desde la nube)
- Click en **"☁️ Descargar de Nube"**
- Baja los datos de Google Sheets a tu dispositivo
- Útil cuando cambias de dispositivo

---

## 📱 Flujo Típico Multi-Dispositivo

### Escenario: Tienes celular y tablet

**Día 1 - Setup:**
1. Configuras la app en tu celular
2. Pegas la URL del script
3. ✅ Primera sincronización automática

**Día 2 - Usas en el gym:**
1. Entrenas en el celular
2. Completas ejercicios
3. ✅ Se sincroniza automáticamente

**Día 3 - Usas en casa con tablet:**
1. Abres la app en la tablet
2. Pegas la misma URL del script
3. Click en **"☁️ Descargar de Nube"**
4. ✅ Todos tus datos del celular aparecen
5. Registras nutrición
6. ✅ Se sincroniza automáticamente

**Día 4 - De vuelta al celular:**
1. Abres la app en el celular
2. Click en **"☁️ Descargar de Nube"** (opcional)
3. ✅ Verás la nutrición que registraste en la tablet

---

## 📊 Qué se Guarda en Google Sheets

Se crea una pestaña llamada **"GYM_SYNC_DATA"** con formato:

| key | value | lastUpdated |
|-----|-------|-------------|
| workouts | {"2024-11-24_phase1": {...}} | 2024-11-24T15:30:00Z |
| nutrition | {"2024-11-24": {...}} | 2024-11-24T15:30:00Z |
| goals | {"calories":2000,...} | 2024-11-24T15:30:00Z |
| phases | {...} | 2024-11-24T15:30:00Z |
| currentPhase | "1" | 2024-11-24T15:30:00Z |

Puedes ver/editar estos datos directamente en Sheets si quieres.

---

## 🔍 Indicadores de Estado

En la app verás un círculo de color al lado de "Sincronización":

- 🟢 **Verde**: Todo OK, última sincronización exitosa
- 🟡 **Amarillo pulsante**: Sincronizando ahora mismo
- 🔴 **Rojo**: Error en la última sincronización
- ⚫ **Gris**: No configurado o offline

---

## 🛠️ Troubleshooting

### "❌ Error al sincronizar"

**Causa 1**: URL incorrecta
- Verifica que copiaste la URL completa del script
- Debe empezar con `https://script.google.com/macros/s/`

**Causa 2**: No hay internet
- Normal cuando estás offline
- La app funciona igual y sincronizará cuando vuelva internet

**Causa 3**: Permisos del script
- Asegúrate de haber autorizado el script correctamente
- Ve a tu Google Sheet → Extensiones → Apps Script
- Vuelve a implementar si es necesario

### "ℹ️ No hay datos en la nube"

Es normal si:
- Es la primera vez que usas la sincronización
- Nunca has subido datos

**Solución**: Click en "🔄 Sincronizar Ahora" primero

### No se guarda la URL del script

- Asegúrate de **pegar la URL y salir del campo** (tap fuera del input)
- La URL se guarda automáticamente al salir del campo

### Datos desincronizados entre dispositivos

**Solución**:
1. En el dispositivo más actualizado: "🔄 Sincronizar Ahora"
2. En el otro dispositivo: "☁️ Descargar de Nube"

---

## 🔐 Seguridad y Privacidad

### ¿Es seguro?

✅ **SÍ**. El script corre bajo **tu cuenta de Google**.
- Solo TÚ tienes acceso a tu Google Sheet
- El script solo lee/escribe en TU sheet
- Nadie más puede ver tus datos

### ¿Puedo compartir mis datos?

Si quieres compartir con tu entrenador o coach:
1. Comparte tu Google Sheet con ellos (permisos de lectura)
2. Ellos verán la pestaña GYM_SYNC_DATA
3. Pueden ver tu progreso en tiempo real

### ¿Se guarda mi contraseña?

❌ **NO**. La URL del script NO contiene contraseñas.
- Es solo un endpoint público de tu script
- Sin la URL exacta, nadie puede acceder

---

## 📝 Mantenimiento

### Actualizar el Script

Si hay una nueva versión del script:
1. Ve a Apps Script
2. Pega el nuevo código
3. Guarda (Ctrl+S)
4. ✅ Listo, no necesitas reimplementar

### Ver Logs del Script

Para debug avanzado:
1. Apps Script → "Ejecuciones"
2. Verás todas las sincronizaciones
3. Útil si algo no funciona

### Crear Backups Manuales

Además de la sincronización automática:
1. Ve a Progreso → "💾 Backup de Datos"
2. Click en "📤 Exportar Datos"
3. Guarda el JSON en tu computadora

---

## 💡 Tips Pro

### Tip 1: Sincroniza antes de cambiar de dispositivo
```
Antes de cerrar la app:
→ Progreso → 🔄 Sincronizar Ahora
```

### Tip 2: Verifica el estado de sync
```
El indicador de color te dice todo:
🟢 = Todo bien
🟡 = Sincronizando
🔴 = Revisar
```

### Tip 3: Usa Sheets como backup visual
```
Tu Google Sheet es un backup legible:
- Puedes ver todos tus datos
- Puedes editarlos si quieres
- Historial de versiones de Google
```

### Tip 4: Sincroniza manualmente al final del día
```
Aunque hay auto-sync, puedes forzar una vez al día:
→ Progreso → 🔄 Sincronizar Ahora
```

---

## 🎓 Preguntas Frecuentes

**Q: ¿Necesito internet siempre?**
A: No. La app funciona 100% offline. Sincroniza cuando hay internet.

**Q: ¿Puedo usar en 3 o más dispositivos?**
A: Sí. Configura la misma URL en todos y listos.

**Q: ¿Los datos se sincronizan instantáneamente?**
A: No es instantáneo. Cuando hagas cambios en otro dispositivo, debes hacer "Descargar de Nube".

**Q: ¿Qué pasa si dos dispositivos modifican datos al mismo tiempo?**
A: El último en sincronizar gana. Por eso se recomienda usar principalmente un dispositivo.

**Q: ¿Cuántos datos puede guardar Google Sheets?**
A: Muchísimos. Fácilmente años de entrenamientos.

**Q: ¿Tiene algún costo?**
A: ❌ NO. Google Apps Script es 100% gratuito para uso personal.

**Q: ¿Puedo desactivar la sincronización?**
A: Sí. Solo borra la URL del script. La app seguirá funcionando offline.

---

## ✅ Checklist de Setup

- [ ] Google Sheet abierto
- [ ] Apps Script creado
- [ ] Código copiado y pegado
- [ ] Implementado como Web App
- [ ] Permisos autorizados
- [ ] URL copiada
- [ ] URL pegada en la app
- [ ] Primer sync exitoso (botón verde)
- [ ] Probado en segundo dispositivo (opcional)

---

## 🎉 ¡Listo!

Ahora tienes:
- ✅ Backup automático en Google
- ✅ Acceso multi-dispositivo
- ✅ Sincronización transparente
- ✅ Todo gratis y privado

**¡A entrenar con tranquilidad!** 💪☁️

---

## 📞 Ayuda Extra

Si algo no funciona:
1. Revisa el Troubleshooting arriba
2. Verifica que la URL esté correcta
3. Asegúrate de haber dado permisos
4. Prueba "Sincronizar Ahora" manualmente
5. Revisa que tengas internet

**Pro tip**: Haz capturas de pantalla del proceso de implementación para recordar los pasos.
