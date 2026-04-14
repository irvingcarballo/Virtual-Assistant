// stores/Routines.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRoutinesStore = defineStore('Routines', () => {
  // Estado
  const routines = ref([])
  const horaInicio = ref(8) // 8 AM por defecto
  const horaFin = ref(21) // 9 PM por defecto

  // Calcular horas disponibles basadas en el rango horario
  const horasDisponiblesSemanales = computed(() => {
    const horasPorDia = horaFin.value - horaInicio.value
    return horasPorDia * 7 // 7 días a la semana
  })

  // Computed - Total de horas usadas sumando todas las rutinas
  const totalHorasUsadas = computed(() => {
    return routines.value.reduce((total, routine) => {
      // Nueva estructura con horariosPorDia
      if (routine.horariosPorDia && typeof routine.horariosPorDia === 'object') {
        const totalHorasRutina = Object.values(routine.horariosPorDia).reduce(
          (sum, horario) => sum + (horario.fin - horario.inicio || 0),
          0,
        )
        return total + totalHorasRutina
      }
      // Estructura anterior (horasPorDia como objeto)
      if (routine.horasPorDia && typeof routine.horasPorDia === 'object') {
        const totalHorasRutina = Object.values(routine.horasPorDia).reduce(
          (sum, horas) => sum + (parseFloat(horas) || 0),
          0,
        )
        return total + totalHorasRutina
      }
      // Compatibilidad con versiones anteriores (horasPorDia como número)
      if (routine.horasPorDia && routine.diasSeleccionados) {
        return total + routine.horasPorDia * routine.diasSeleccionados.length
      }
      return total + (routine.totalHoras || 0)
    }, 0)
  })

  const horasRestantes = computed(() => {
    return Math.max(0, horasDisponiblesSemanales.value - totalHorasUsadas.value)
  })

  const indicadorColor = computed(() => {
    const porcentaje = (totalHorasUsadas.value / horasDisponiblesSemanales.value) * 100
    if (porcentaje <= 50)
      return { color: 'green', emoji: '🟢', texto: 'Bien distribuido, ¡sigue así!' }
    if (porcentaje <= 80)
      return { color: 'yellow', emoji: '🟡', texto: 'Cuidado, cerca del límite de horas' }
    return { color: 'red', emoji: '🔴', texto: '⚠️ Sobrecargado, ajusta tus rutinas' }
  })

  // Acciones
  function setRangoHorario(inicio, fin) {
    horaInicio.value = inicio
    horaFin.value = fin
    saveSettingsToLocalStorage()
  }

  function addRoutine(routine) {
    // Calcular totalHoras basado en horariosPorDia o horasPorDia
    let totalHoras = routine.totalHoras
    if (!totalHoras) {
      if (routine.horariosPorDia) {
        totalHoras = Object.values(routine.horariosPorDia).reduce(
          (sum, horario) => sum + (horario.fin - horario.inicio || 0),
          0,
        )
      } else if (routine.horasPorDia) {
        totalHoras = Object.values(routine.horasPorDia).reduce(
          (sum, horas) => sum + (parseFloat(horas) || 0),
          0,
        )
      }
    }

    const newRoutine = {
      id: Date.now(),
      nombre: routine.nombre,
      descripcion: routine.descripcion || '',
      diasSeleccionados: routine.diasSeleccionados || [],
      horariosPorDia: routine.horariosPorDia || {}, // Guardar horarios
      horasPorDia: routine.horasPorDia || {}, // Para compatibilidad
      importancia: routine.importancia || 'pasiva',
      totalHoras: totalHoras,
      createdAt: new Date().toISOString(),
    }

    routines.value.push(newRoutine)
    saveToLocalStorage()
  }

  function updateRoutine(id, updatedRoutine) {
    const index = routines.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      // Calcular totalHoras basado en horariosPorDia o horasPorDia
      let totalHoras = updatedRoutine.totalHoras
      if (!totalHoras) {
        if (updatedRoutine.horariosPorDia) {
          totalHoras = Object.values(updatedRoutine.horariosPorDia).reduce(
            (sum, horario) => sum + (horario.fin - horario.inicio || 0),
            0,
          )
        } else if (updatedRoutine.horasPorDia) {
          totalHoras = Object.values(updatedRoutine.horasPorDia).reduce(
            (sum, horas) => sum + (parseFloat(horas) || 0),
            0,
          )
        }
      }

      routines.value[index] = {
        ...routines.value[index],
        nombre: updatedRoutine.nombre,
        descripcion: updatedRoutine.descripcion,
        diasSeleccionados: updatedRoutine.diasSeleccionados,
        horariosPorDia: updatedRoutine.horariosPorDia || updatedRoutine.horasPorDia || {}, // Guardar horarios
        horasPorDia: updatedRoutine.horasPorDia || {}, // Para compatibilidad
        importancia: updatedRoutine.importancia,
        totalHoras: totalHoras,
        updatedAt: new Date().toISOString(),
      }
      saveToLocalStorage()
    }
  }

  function deleteRoutine(id) {
    routines.value = routines.value.filter((r) => r.id !== id)
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('routines', JSON.stringify(routines.value))
  }

  function saveSettingsToLocalStorage() {
    localStorage.setItem('horaInicio', horaInicio.value)
    localStorage.setItem('horaFin', horaFin.value)
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('routines')
    if (saved) {
      try {
        const parsedRoutines = JSON.parse(saved)
        // Asegurar que todas las rutinas tengan la estructura correcta
        routines.value = parsedRoutines.map((routine) => {
          // Si la rutina tiene el formato antiguo (horasPorDia como número)
          if (
            routine.horasPorDia &&
            typeof routine.horasPorDia === 'number' &&
            routine.diasSeleccionados
          ) {
            const horasPorDiaObj = {}
            routine.diasSeleccionados.forEach((dia) => {
              horasPorDiaObj[dia] = routine.horasPorDia
            })
            return {
              ...routine,
              horasPorDia: horasPorDiaObj,
              totalHoras: routine.horasPorDia * routine.diasSeleccionados.length,
            }
          }

          // Si la rutina tiene horariosPorDia pero es un objeto plano (valores numéricos)
          if (routine.horariosPorDia && typeof routine.horariosPorDia === 'object') {
            // Verificar si los valores son números (formato antiguo) u objetos (nuevo formato)
            const primerDia = Object.keys(routine.horariosPorDia)[0]
            if (primerDia && typeof routine.horariosPorDia[primerDia] === 'number') {
              // Convertir formato antiguo a nuevo
              const nuevosHorarios = {}
              Object.keys(routine.horariosPorDia).forEach((dia) => {
                const horas = routine.horariosPorDia[dia]
                nuevosHorarios[dia] = {
                  inicio: routine.horaInicio || 8,
                  fin: (routine.horaInicio || 8) + horas,
                }
              })
              routine.horariosPorDia = nuevosHorarios
            }
          }

          // Si falta totalHoras, calcularlo
          if (!routine.totalHoras) {
            if (routine.horariosPorDia) {
              routine.totalHoras = Object.values(routine.horariosPorDia).reduce(
                (sum, horario) => sum + (horario.fin - horario.inicio || 0),
                0,
              )
            } else if (routine.horasPorDia) {
              routine.totalHoras = Object.values(routine.horasPorDia).reduce(
                (sum, horas) => sum + (parseFloat(horas) || 0),
                0,
              )
            }
          }

          return routine
        })
      } catch (e) {
        console.error('Error al cargar rutinas:', e)
        routines.value = []
      }
    }

    const savedInicio = localStorage.getItem('horaInicio')
    const savedFin = localStorage.getItem('horaFin')
    if (savedInicio && savedFin) {
      horaInicio.value = parseInt(savedInicio)
      horaFin.value = parseInt(savedFin)
    }
  }

  return {
    routines,
    horaInicio,
    horaFin,
    horasDisponiblesSemanales,
    totalHorasUsadas,
    horasRestantes,
    indicadorColor,
    setRangoHorario,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    loadFromLocalStorage,
  }
})
