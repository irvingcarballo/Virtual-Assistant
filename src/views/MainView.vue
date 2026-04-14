<!-- views/MainView.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navbar Component -->
    <Navbar />

    <!-- Contenido principal -->
    <div class="container mx-auto px-4 py-8">
      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:scale-105"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Días registrados (este mes)</p>
              <p class="text-3xl font-bold text-gray-800">{{ estadisticas.diasRegistrados }}</p>
            </div>
            <CalendarIcon class="h-12 w-12 text-blue-400" />
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:scale-105"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Rutinas registradas</p>
              <p class="text-3xl font-bold text-gray-800">{{ estadisticas.totalRutinas }}</p>
            </div>
            <ClipboardDocumentListIcon class="h-12 w-12 text-green-400" />
          </div>
        </div>

        <div
          class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:scale-105"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm">Horas disponibles (semana)</p>
              <p class="text-3xl font-bold text-gray-800">{{ estadisticas.horasDisponibles }}</p>
            </div>
            <ClockIcon class="h-12 w-12 text-purple-400" />
          </div>
        </div>
      </div>

      <!-- Calendario del mes actual con rutinas -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold">{{ nombreMes }} {{ añoActual }}</h3>
          <div class="flex space-x-2">
            <button
              @click="cambiarMes(-1)"
              class="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              ←
            </button>
            <button
              @click="cambiarMes(1)"
              class="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              →
            </button>
          </div>
        </div>

        <!-- Días de la semana -->
        <div class="grid grid-cols-7 gap-2 mb-2">
          <div
            v-for="dia in diasSemana"
            :key="dia"
            class="text-center font-semibold text-gray-600 py-2"
          >
            {{ dia }}
          </div>
        </div>

        <!-- Calendario -->
        <div class="grid grid-cols-7 gap-2">
          <div
            v-for="(dia, index) in diasCalendario"
            :key="index"
            @click="verDetallesDia(dia)"
            :class="[
              'min-h-[140px] p-2 rounded-lg cursor-pointer transition border',
              dia && dia.fecha ? 'hover:bg-blue-50 hover:shadow-md' : '',
              dia && dia.esHoy
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-white border-gray-200',
            ]"
          >
            <div v-if="dia">
              <!-- Número del día -->
              <div
                class="font-semibold text-lg mb-2"
                :class="dia.esHoy ? 'text-white' : 'text-gray-700'"
              >
                {{ dia.dia }}
              </div>

              <!-- Rutinas del día -->
              <div class="space-y-1">
                <div
                  v-for="(rutina, idx) in dia.rutinasDelDia.slice(0, 3)"
                  :key="idx"
                  :class="[
                    'text-xs p-1 rounded truncate',
                    rutina.importancia === 'obligatoria'
                      ? 'text-red-600 font-bold'
                      : 'text-green-600',
                    dia.esHoy ? 'text-white' : '',
                  ]"
                  :title="`${rutina.nombre}: ${rutina.horaInicio}:00 - ${rutina.horaFin}:00`"
                >
                  • {{ rutina.nombre }}
                  <span class="text-xs opacity-75"> ({{ rutina.horaInicio }}:00) </span>
                </div>
              </div>

              <!-- Indicador de más rutinas -->
              <div v-if="dia.rutinasDelDia.length > 3" class="text-xs text-gray-400 mt-1">
                +{{ dia.rutinasDelDia.length - 3 }} más
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de acción -->
      <div class="flex flex-wrap gap-4 justify-center">
        <button
          @click="irARutinas"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center space-x-2 transform hover:scale-105"
        >
          <ClipboardDocumentListIcon class="h-5 w-5" />
          <span>Gestionar rutinas</span>
        </button>
      </div>

      <!-- Modal de detalles del día -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
          <h3 class="text-xl font-semibold mb-4">{{ modalTitulo }}</h3>
          <div class="space-y-3">
            <p class="text-gray-600 font-medium">📋 Rutinas programadas:</p>
            <div v-if="modalRutinas.length > 0">
              <div
                v-for="(rutina, idx) in modalRutinas"
                :key="idx"
                class="p-3 border rounded-lg mb-2"
                :class="
                  rutina.importancia === 'obligatoria'
                    ? 'border-red-200 bg-red-50'
                    : 'border-green-200 bg-green-50'
                "
              >
                <p
                  class="font-semibold"
                  :class="rutina.importancia === 'obligatoria' ? 'text-red-600' : 'text-green-600'"
                >
                  {{ rutina.nombre }}
                </p>
                <p class="text-sm text-gray-600">
                  🕐 {{ rutina.horaInicio }}:00 - {{ rutina.horaFin }}:00
                </p>
                <p class="text-xs text-gray-500">
                  ⭐ Importancia:
                  {{ rutina.importancia === 'obligatoria' ? 'Obligatoria' : 'Pasiva' }}
                </p>
                <p v-if="rutina.descripcion" class="text-xs text-gray-500 mt-1">
                  📝 {{ rutina.descripcion }}
                </p>
              </div>
            </div>
            <div v-else class="text-gray-500 text-center py-4">
              ✨ No hay rutinas programadas para este día
            </div>
          </div>
          <button
            @click="showModal = false"
            class="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useDataUserStore } from '@/stores/DataUser'
import { useRoutinesStore } from '@/stores/Routines'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { ClipboardDocumentListIcon, CalendarIcon, ClockIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const userStore = useDataUserStore()
const routinesStore = useRoutinesStore()
const showModal = ref(false)
const modalTitulo = ref('')
const modalRutinas = ref([])

// Calendario
const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const fechaActual = new Date()
const añoActual = ref(fechaActual.getFullYear())
const mesActual = ref(fechaActual.getMonth())

const nombreMes = computed(() => {
  const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]
  return meses[mesActual.value]
})

// Mapeo de días de la semana (español con mayúscula inicial como viene de la rutina)
const diaSemanaMap = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
}

// Obtener rutinas para un día específico
const obtenerRutinasDelDia = (fecha) => {
  const diaSemana = diaSemanaMap[fecha.getDay()]
  const rutinasDelDia = []

  if (!routinesStore.routines || routinesStore.routines.length === 0) {
    return []
  }

  routinesStore.routines.forEach((rutina) => {
    // Verificar si la rutina está programada para este día de la semana
    const diasSeleccionados = rutina.diasSeleccionados || []

    if (diasSeleccionados.includes(diaSemana)) {
      let horaInicio = null
      let horaFin = null

      // Obtener horarios específicos del día desde horariosPorDia
      if (rutina.horariosPorDia && rutina.horariosPorDia[diaSemana]) {
        const horario = rutina.horariosPorDia[diaSemana]
        horaInicio = horario.inicio
        horaFin = horario.fin
      }
      // Compatibilidad con formato anterior (horasPorDia)
      else if (rutina.horasPorDia && rutina.horasPorDia[diaSemana]) {
        const horas = rutina.horasPorDia[diaSemana]
        const inicio = routinesStore.horaInicio || 8
        horaInicio = inicio
        horaFin = inicio + (typeof horas === 'number' ? horas : parseFloat(horas) || 1)
      }

      if (horaInicio !== null && horaFin !== null) {
        rutinasDelDia.push({
          id: rutina.id,
          nombre: rutina.nombre,
          importancia: rutina.importancia || 'pasiva',
          horaInicio: horaInicio,
          horaFin: horaFin,
          descripcion: rutina.descripcion || '',
        })
      }
    }
  })

  // Ordenar por hora de inicio
  return rutinasDelDia.sort((a, b) => (a.horaInicio || 99) - (b.horaInicio || 99))
}

// Estadísticas
const estadisticas = computed(() => {
  // Días registrados del mes actual (días que tienen rutinas programadas)
  const diasConRutinas = new Set()
  const fechaInicio = new Date(añoActual.value, mesActual.value, 1)
  const fechaFin = new Date(añoActual.value, mesActual.value + 1, 0)

  for (let d = new Date(fechaInicio); d <= fechaFin; d.setDate(d.getDate() + 1)) {
    const rutinasDelDia = obtenerRutinasDelDia(d)
    if (rutinasDelDia.length > 0) {
      diasConRutinas.add(d.toISOString().split('T')[0])
    }
  }

  // IMPORTANTE: horasDisponiblesSemanales es un computed, no una ref
  const horasDisponibles = routinesStore.horasDisponiblesSemanales

  return {
    diasRegistrados: diasConRutinas.size,
    totalRutinas: routinesStore.routines?.length || 0,
    horasDisponibles: horasDisponibles || 0,
  }
})

// Generar calendario con rutinas
const diasCalendario = computed(() => {
  const primerDiaMes = new Date(añoActual.value, mesActual.value, 1)
  const ultimoDiaMes = new Date(añoActual.value, mesActual.value + 1, 0)
  const diasEnMes = ultimoDiaMes.getDate()
  const diaInicioSemana = primerDiaMes.getDay()

  const calendario = []
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  // Días vacíos al inicio
  for (let i = 0; i < diaInicioSemana; i++) {
    calendario.push(null)
  }

  // Días del mes
  for (let i = 1; i <= diasEnMes; i++) {
    const fecha = new Date(añoActual.value, mesActual.value, i)
    const esHoy = fecha.toDateString() === hoy.toDateString()
    const rutinasDelDia = obtenerRutinasDelDia(fecha)

    calendario.push({
      dia: i,
      fecha: fecha,
      fechaStr: fecha.toISOString().split('T')[0],
      esHoy: esHoy,
      tieneRegistro: rutinasDelDia.length > 0,
      rutinasDelDia: rutinasDelDia,
    })
  }

  return calendario
})

// Funciones
function verDetallesDia(dia) {
  if (!dia || !dia.fecha) return

  const fechaFormateada = dia.fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  modalTitulo.value = `📅 ${fechaFormateada}`
  modalRutinas.value = dia.rutinasDelDia
  showModal.value = true
}

function irARutinas() {
  router.push('/routines')
}

function cambiarMes(direccion) {
  mesActual.value += direccion
  if (mesActual.value < 0) {
    mesActual.value = 11
    añoActual.value--
  } else if (mesActual.value > 11) {
    mesActual.value = 0
    añoActual.value++
  }
}

// Inicializar
onMounted(() => {
  // Verificar si hay usuario
  if (!userStore.userData) {
    router.push('/')
  }

  // Cargar rutinas desde localStorage
  routinesStore.loadFromLocalStorage()

  // Mostrar ejemplo de cómo se ven los días seleccionados
  if (routinesStore.routines && routinesStore.routines.length > 0) {
    routinesStore.routines.forEach((rutina) => {})
  }
})
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.min-h-[140px] {
  min-height: 140px;
}

.cursor-pointer {
  cursor: pointer;
}

.transition {
  transition: all 0.2s ease;
}
</style>
