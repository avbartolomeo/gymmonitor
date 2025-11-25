# 💪 Mi Entrenamiento - App de Gimnasio

Aplicación web progresiva completa para seguimiento de entrenamiento y nutrición en el gimnasio.

## 🚀 Características

### 💪 Entrenamiento
- ✅ **Multi-fase**: Gestiona diferentes fases de entrenamiento (Adaptación, Hipertrofia, Definición, etc.)
- 🏋️ **Seguimiento de ejercicios**: Registra peso, repeticiones y completa tus ejercicios diarios
- ⏱️ **Timer integrado**: Timer de descanso con presets (1:00, 1:30, 2:00, 3:00, 4:00, 5:00)
- 📊 **Gráficos de progreso**: Visualiza tu evolución semanal con gráficos interactivos

### 🍽️ Nutrición
- 📝 **Tracking nutricional**: Registra calorías y proteínas diarias
- 🎯 **Metas personalizables**: Establece tus propias metas de calorías, proteínas y entrenamientos
- 📈 **Progreso visual**: Barras de progreso para ver cuánto te falta para tus metas
- 📊 **Gráficos nutricionales**: Visualiza tu consumo de calorías y proteínas en los últimos 7 días

### 📊 Estadísticas y Progreso
- 📈 **Dashboard completo**: Entrenamientos completados, ejercicios realizados, rachas y % de completitud
- 🏆 **Historial detallado**: Revisa tus entrenamientos pasados
- 📊 **Gráficos de evolución**: Ve tu progreso semanal de forma visual

### 💾 Gestión de Datos
- 📤 **Exportar datos**: Descarga un backup JSON con toda tu información
- 📥 **Importar datos**: Restaura tus datos desde un backup previo
- 🔒 **Privacidad total**: Todos tus datos se guardan localmente en tu dispositivo

### 📱 Optimización Móvil
- 📱 **100% Mobile-friendly**: Diseñada específicamente para usar desde tu celular en el gym
- 🎨 **Interfaz moderna**: Diseño limpio y fácil de usar
- ⚡ **Súper rápida**: Funciona completamente offline una vez cargada

## 📦 Cómo usar en GitHub Pages

### Opción 1: Fork este repositorio

1. Haz click en "Fork" en la esquina superior derecha
2. Ve a Settings → Pages
3. En "Source" selecciona "main branch"
4. Guarda y espera unos minutos
5. Tu app estará disponible en: `https://TU-USUARIO.github.io/NOMBRE-REPO/`

### Opción 2: Crear nuevo repositorio

1. Crea un nuevo repositorio en GitHub
2. Sube el archivo `gym-tracker.html`
3. Renómbralo a `index.html`
4. Ve a Settings → Pages
5. En "Source" selecciona "main branch"
6. Tu app estará en: `https://TU-USUARIO.github.io/NOMBRE-REPO/`

## 📱 Instalar como PWA

Una vez que tengas la app corriendo:

### En Android (Chrome):
1. Abre la app en Chrome
2. Toca el menú (⋮) → "Instalar app" o "Agregar a pantalla de inicio"
3. ¡Listo! Ahora tendrás un ícono como app nativa

### En iPhone (Safari):
1. Abre la app en Safari
2. Toca el botón "Compartir" 
3. Selecciona "Agregar a pantalla de inicio"
4. ¡Listo! Tendrás un ícono en tu home screen

## 🎯 Uso de la App

### 1️⃣ Gestión de Fases

- Haz click en el ícono ⚙️ al lado del selector de fase
- Puedes agregar nuevas fases (Ej: Fase 2 - Hipertrofia)
- Cada fase tiene su propia rutina de ejercicios
- El progreso se trackea por separado para cada fase

### 2️⃣ Entrenar

- Selecciona el día de la semana
- Marca ejercicios como completados
- Registra peso y repeticiones (en ejercicios de fuerza)
- **Usa el timer ⏱️**: Click en el botón del reloj para iniciar el timer de descanso
  - Presets rápidos: 1:00, 1:30, 2:00, 3:00, 4:00, 5:00
  - Pausa/reinicia cuando necesites
  - Notificación sonora al terminar
- Todo se guarda automáticamente

### 3️⃣ Nutrición y Metas

- **Establece tus metas**:
  - Meta de calorías diarias
  - Meta de proteínas diarias (g)
  - Meta de entrenamientos semanales
- **Registra tu comida**:
  - Calorías consumidas
  - Proteínas consumidas
- **Visualiza tu progreso**:
  - Barras de progreso para cada meta
  - Gráfico de evolución de 7 días
  - Promedios semanales

### 4️⃣ Progreso y Estadísticas

- **Dashboard semanal**:
  - Entrenamientos completados
  - Total de ejercicios realizados
  - Racha de días consecutivos
  - Porcentaje de completitud
- **Gráficos interactivos**:
  - Evolución de ejercicios completados
  - Tendencias nutricionales
- **Historial completo** de tus sesiones

### 5️⃣ Backup de Datos

- **Exportar**: Descarga un archivo JSON con todos tus datos
  - Útil para hacer backups periódicos
  - Formato legible y fácil de editar
- **Importar**: Restaura datos desde un backup anterior
  - Útil si cambias de dispositivo
  - O para recuperar datos anteriores

## 🔧 Personalización

Para editar tu rutina de entrenamiento, abre el archivo `index.html` y busca la sección `trainingPhases`. 

Ejemplo:
```javascript
const trainingPhases = {
    1: {
        name: "Fase 1 - Adaptación",
        routine: {
            "Lunes": [
                { 
                    id: 1, 
                    tipo: "FUERZA", 
                    subtipo: "Superior", 
                    ejercicio: "Press de banca", 
                    series: 3, 
                    reps: "10-12" 
                }
            ]
        }
    }
};
```

## 💾 Datos

- Todos los datos se guardan en el **localStorage** de tu navegador
- No se envía ninguna información a servidores externos
- Tus datos son 100% privados
- **Backup**: Exporta/importa tus datos desde la consola del navegador si lo necesitas

## 🤝 Contribuir

¿Tienes ideas para mejorar la app? ¡Abre un issue o pull request!

## 📄 Licencia

MIT - Usa y modifica libremente

---

**Made with 💪 by Alejandro**
