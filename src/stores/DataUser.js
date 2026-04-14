// stores/DataUser.js
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useDataUserStore = defineStore('DataUser', () => {
  // Estado del usuario
  const userData = ref(null)
  const registros = ref([])

  // Acciones
  function setUserData(data) {
    userData.value = data
    // Inicializar registros si no existen
    if (!registros.value.length) {
      registros.value = []
    }
    // Guardar en localStorage
    localStorage.setItem('userData', JSON.stringify(data))
  }

  function addRegistro(fecha) {
    const existing = registros.value.find((r) => r.fecha === fecha)
    if (!existing) {
      registros.value.push({
        fecha: fecha,
        rutinas: [],
      })
      // Guardar cambios
      localStorage.setItem('registros', JSON.stringify(registros.value))
    }
  }

  function updateRegistro(fecha, rutinas) {
    const index = registros.value.findIndex((r) => r.fecha === fecha)
    if (index !== -1) {
      registros.value[index].rutinas = rutinas
    } else {
      registros.value.push({ fecha, rutinas })
    }
    // Guardar cambios
    localStorage.setItem('registros', JSON.stringify(registros.value))
  }

  function getDiasRegistrados() {
    return registros.value.length
  }

  function getRutinasSemanales() {
    // Calcular rutinas de la semana actual
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    let totalRutinas = 0
    registros.value.forEach((registro) => {
      const fechaRegistro = new Date(registro.fecha)
      if (fechaRegistro >= startOfWeek && fechaRegistro <= endOfWeek) {
        totalRutinas += registro.rutinas.length
      }
    })

    return totalRutinas
  }

  function getHorasDisponibles() {
    // Horas disponibles estimadas (ejemplo: 40 horas a la semana)
    const rutinasUsadas = getRutinasSemanales()
    const horasPorRutina = 2 // 2 horas por rutina
    return Math.max(0, 40 - rutinasUsadas * horasPorRutina)
  }

  // Watchers para guardar automáticamente cuando cambien los datos
  watch(
    userData,
    (newValue) => {
      if (newValue) {
        localStorage.setItem('userData', JSON.stringify(newValue))
      }
    },
    { deep: true },
  )

  watch(
    registros,
    (newValue) => {
      localStorage.setItem('registros', JSON.stringify(newValue))
    },
    { deep: true },
  )

  return {
    userData,
    registros,
    setUserData,
    addRegistro,
    updateRegistro,
    getDiasRegistrados,
    getRutinasSemanales,
    getHorasDisponibles,
  }
})
