// ============================================
// CONFIGURACIÓN DE LA APLICACIÓN GYM MONITOR
// ============================================

// URL del Google Apps Script desplegado
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzyQXRKEEmWUKUeRNsgnEoWApRJXkdkENhsgiRrzgoBxpPFW6KPwscaJpTM7O2mnAAV3g/exec';

// Cliente API para comunicarse con Google Sheets
const GymAPI = {
    // URL base del script
    baseUrl: SCRIPT_URL,

    // Realizar petición GET
    async get(action, params = {}) {
        const url = new URL(this.baseUrl);
        url.searchParams.append('action', action);
        
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });

        const response = await fetch(url);
        return await response.json();
    },

    // Realizar petición POST
    async post(action, payload) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script requiere no-cors
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: action,
                ...payload
            })
        });
        
        // Con no-cors no podemos leer la respuesta, asumimos éxito
        return { success: true };
    },

    // ==================== ENTRENAMIENTOS ====================
    
    async saveWorkout(date, phase, exerciseId, completed, weight, actualReps) {
        return await this.post('save_workout', {
            payload: {
                date,
                phase,
                exerciseId,
                completed,
                weight,
                actualReps
            }
        });
    },

    async getWorkouts(startDate, endDate, phase) {
        return await this.get('get_workouts', { startDate, endDate, phase });
    },

    // ==================== NUTRICIÓN ====================
    
    async saveNutrition(date, calories, protein) {
        return await this.post('save_nutrition', {
            payload: { date, calories, protein }
        });
    },

    async getNutrition(startDate, endDate) {
        return await this.get('get_nutrition', { startDate, endDate });
    },

    // ==================== METAS ====================
    
    async saveGoals(goals) {
        return await this.post('save_goals', {
            payload: goals
        });
    },

    async getGoals() {
        return await this.get('get_goals');
    },

    // ==================== FASES ====================
    
    async savePhase(phaseNumber, name, routine) {
        return await this.post('save_phase', {
            payload: { phaseNumber, name, routine }
        });
    },

    async getPhases() {
        return await this.get('get_phases');
    },

    async getCurrentPhase() {
        return await this.get('get_current_phase');
    },

    async setCurrentPhase(phaseId) {
        return await this.post('set_current_phase', {
            phaseId: phaseId
        });
    },

    // ==================== GESTIÓN DE EJERCICIOS ====================
    
    async addExerciseToPhase(phaseNumber, day, exercise) {
        return await this.post('add_exercise_to_phase', {
            phaseNumber,
            day,
            exercise
        });
    },

    async removeExerciseFromPhase(phaseNumber, day, exerciseId) {
        return await this.post('remove_exercise_from_phase', {
            phaseNumber,
            day,
            exerciseId
        });
    },

    async updateExerciseInPhase(phaseNumber, day, exerciseId, updates) {
        return await this.post('update_exercise_in_phase', {
            phaseNumber,
            day,
            exerciseId,
            updates
        });
    },

    // ==================== MIGRACIÓN ====================
    
    async migrateRoutine() {
        return await this.post('migrate_routine', {});
    }
};

// Exportar para uso en la aplicación
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SCRIPT_URL, GymAPI };
}
