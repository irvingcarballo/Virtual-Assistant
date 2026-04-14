// stores/Activities.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useActivitiesStore = defineStore('Activities', () => {
  // Estado
  const activities = ref([])

  // Computed - Actividades por fecha
  const getActivitiesByDate = computed(() => {
    const grouped = {}
    activities.value.forEach((activity) => {
      if (!grouped[activity.fecha]) {
        grouped[activity.fecha] = []
      }
      grouped[activity.fecha].push(activity)
    })
    return grouped
  })

  // Obtener actividades de una fecha específica
  function getActivitiesForDate(fecha) {
    return activities.value.filter((activity) => activity.fecha === fecha)
  }

  // Agregar actividad
  function addActivity(activity) {
    const newActivity = {
      id: Date.now(),
      nombre: activity.nombre,
      descripcion: activity.descripcion || '',
      fecha: activity.fecha,
      tipoHorario: activity.tipoHorario || 'puntual', // 'puntual' o 'rango'
      horaInicio: activity.horaInicio || null,
      horaFin: activity.horaFin || null,
      importante: activity.importante || false,
      createdAt: new Date().toISOString(),
    }
    activities.value.push(newActivity)
    saveToLocalStorage()
    return newActivity
  }

  // Actualizar actividad
  function updateActivity(id, updatedActivity) {
    const index = activities.value.findIndex((a) => a.id === id)
    if (index !== -1) {
      activities.value[index] = {
        ...activities.value[index],
        nombre: updatedActivity.nombre,
        descripcion: updatedActivity.descripcion,
        fecha: updatedActivity.fecha,
        tipoHorario: updatedActivity.tipoHorario,
        horaInicio: updatedActivity.horaInicio,
        horaFin: updatedActivity.horaFin,
        importante: updatedActivity.importante,
        updatedAt: new Date().toISOString(),
      }
      saveToLocalStorage()
    }
  }

  // Eliminar actividad
  function deleteActivity(id) {
    activities.value = activities.value.filter((a) => a.id !== id)
    saveToLocalStorage()
  }

  // Guardar en localStorage
  function saveToLocalStorage() {
    localStorage.setItem('activities', JSON.stringify(activities.value))
  }

  // Cargar desde localStorage
  function loadFromLocalStorage() {
    const saved = localStorage.getItem('activities')
    if (saved) {
      try {
        activities.value = JSON.parse(saved)
      } catch (e) {
        console.error('Error al cargar actividades:', e)
        activities.value = []
      }
    }
  }

  // Eliminar todas las actividades
  function clearAllActivities() {
    activities.value = []
    saveToLocalStorage()
  }

  return {
    activities,
    getActivitiesByDate,
    getActivitiesForDate,
    addActivity,
    updateActivity,
    deleteActivity,
    loadFromLocalStorage,
    clearAllActivities,
  }
})
