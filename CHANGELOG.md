# 📝 Changelog

## Version 2.1 - Cloud Sync (2024) 🆕

### ☁️ Sincronización con Google Sheets
- **Sincronización automática** con Google Sheets
- **Multi-dispositivo**: Accede a tus datos desde celular, tablet, PC
- **Auto-sync en background**: Se sincroniza al guardar entrenamientos, nutrición o metas
- **Sincronización manual**: Botones para subir/descargar datos
- **Indicadores visuales**: Estados de sync (sincronizando, éxito, error, offline)
- **Fallback a localStorage**: Funciona 100% offline, sincroniza cuando hay internet
- **Google Apps Script incluido**: Backend gratuito en tu cuenta de Google
- **Privacidad total**: Los datos solo están en TU Google Sheet
- **Setup en 10 minutos**: Guía completa paso a paso

### 🔧 Mejoras Técnicas
- Sistema de auto-sync no invasivo
- Manejo de errores de red
- Persistencia de configuración de sync
- Timestamps de última sincronización

---

## Version 2.0 - Feature Complete (2024)

### 🎉 Nuevas Funcionalidades

#### ⏱️ Timer de Descanso
- Timer integrado en cada ejercicio
- Presets rápidos: 1:00, 1:30, 2:00, 3:00, 4:00, 5:00 minutos
- Botones de Start/Pause/Reset
- Notificación sonora al finalizar
- Interfaz modal optimizada para uso rápido en el gym

#### 🎯 Sistema de Metas
- Establece meta diaria de calorías
- Establece meta diaria de proteínas (g)
- Establece meta semanal de entrenamientos
- Barras de progreso visuales para cada meta
- Actualización en tiempo real del progreso
- Metas persistentes entre sesiones

#### 📊 Gráficos Interactivos
- **Gráfico Nutricional** (7 días):
  - Línea de calorías consumidas
  - Línea de proteínas (escalada x10 para mejor visualización)
  - Tooltips interactivos
- **Gráfico de Entrenamientos** (7 días):
  - Barras de ejercicios completados por día
  - Visualización clara de tendencias semanales
  - Diseño responsive

#### 💾 Export/Import de Datos
- **Exportar**: Descarga archivo JSON con:
  - Todos los entrenamientos registrados
  - Datos nutricionales completos
  - Configuración de fases
  - Metas establecidas
  - Fecha de exportación
- **Importar**: Restaura datos desde backup
  - Confirmación antes de sobrescribir
  - Recarga automática después de importar
  - Validación de formato JSON

### 🔧 Mejoras Técnicas
- Integración de Chart.js 4.4.0
- Optimización de localStorage
- Mejor manejo de estados
- Audio Context API para notificaciones
- Validación mejorada de inputs

### 🎨 Mejoras de UI/UX
- Modal de timer con diseño moderno
- Sección de metas con barras de progreso
- Gráficos con colores del tema principal
- Botones de backup claramente identificados
- Animaciones suaves en transiciones

---

## Version 1.0 - Release Inicial

### 📱 Funcionalidades Core
- Sistema multi-fase de entrenamiento
- Tracking de ejercicios con peso y repeticiones
- Registro de nutrición (calorías y proteínas)
- Dashboard de progreso semanal
- Historial de entrenamientos
- Selector de días de la semana
- Diseño 100% mobile-first

### 🏗️ Arquitectura
- Single Page Application (SPA)
- LocalStorage para persistencia
- Diseño responsive
- Sin dependencias backend
- PWA-ready

### 🎨 Diseño
- Tema gradiente púrpura
- Cards con animaciones
- Bottom navigation
- Modal system
- Toast notifications

---

## 🔮 Roadmap Futuro

### Posibles Funcionalidades
- [ ] PWA completa con service worker
- [ ] Modo oscuro
- [ ] Calculadora de 1RM
- [ ] Registro de medidas corporales
- [ ] Fotos de progreso
- [ ] Sincronización en la nube (opcional)
- [ ] Estadísticas de volumen total
- [ ] Comparación entre fases
- [ ] Exportar reportes en PDF
- [ ] Integración con wearables

---

**Última actualización**: Noviembre 2024
