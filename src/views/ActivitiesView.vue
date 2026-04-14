<!-- views/ActivitiesView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar Component -->
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <!-- Instrucciones iniciales -->
      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <div class="flex items-center space-x-3 mb-4">
          <div class="bg-gray-100 rounded-full p-3">
            <svg
              class="h-6 w-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-800">📝 Instrucciones</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
          <div class="border-l-4 border-gray-400 pl-3">
            <p class="font-bold text-gray-800">1. Selecciona un día</p>
            <p class="text-sm">
              Haz clic en cualquier día del calendario (no puedes seleccionar días pasados)
            </p>
          </div>
          <div class="border-l-4 border-gray-400 pl-3">
            <p class="font-bold text-gray-800">2. Completa el formulario</p>
            <p class="text-sm">Nombre, descripción, horario y marca si es importante</p>
          </div>
          <div class="border-l-4 border-gray-400 pl-3">
            <p class="font-bold text-gray-800">3. Validaciones automáticas</p>
            <p class="text-sm">
              No puedes crear actividades que choquen con rutinas obligatorias o con otras
              actividades
            </p>
          </div>
        </div>
      </div>

      <!-- Calendario del mes actual -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-800">{{ nombreMes }} {{ añoActual }}</h3>
          <div class="flex space-x-2">
            <button
              @click="cambiarMes(-1)"
              class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition font-medium text-gray-700"
            >
              ← Mes anterior
            </button>
            <button
              @click="cambiarMes(1)"
              class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition font-medium text-gray-700"
            >
              Mes siguiente →
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
            @click="seleccionarDia(dia)"
            :class="[
              'min-h-[130px] p-2 rounded-lg cursor-pointer transition border',
              dia && dia.fecha ? 'hover:bg-gray-50 hover:shadow-md' : '',
              dia && dia.esHoy ? 'bg-blue-50 border-blue-400 border-2' : 'bg-white border-gray-200',
              dia && dia.esPasado ? 'bg-gray-100 opacity-60 cursor-not-allowed' : '',
              dia && dia.fechaSeleccionada ? 'ring-2 ring-blue-400 bg-blue-50' : '',
            ]"
          >
            <div v-if="dia">
              <!-- Número del día -->
              <div
                class="font-semibold text-lg mb-2"
                :class="dia.esHoy ? 'text-blue-600' : 'text-gray-700'"
              >
                {{ dia.dia }}
              </div>

              <!-- Rutinas del día -->
              <div class="space-y-1 mb-2">
                <div
                  v-for="(rutina, idx) in dia.rutinasDelDia.slice(0, 2)"
                  :key="'r-' + idx"
                  :class="[
                    'text-xs p-1 rounded truncate',
                    rutina.importancia === 'obligatoria'
                      ? 'text-red-600 font-bold'
                      : 'text-green-600',
                  ]"
                  :title="`Rutina: ${rutina.nombre} - ${rutina.horaInicio}:00 a ${rutina.horaFin}:00`"
                >
                  📋 {{ rutina.nombre }} ({{ rutina.horaInicio }}:00)
                </div>
              </div>

              <!-- Actividades del día -->
              <div class="space-y-1">
                <div
                  v-for="(actividad, idx) in dia.activitiesDelDia.slice(0, 2)"
                  :key="'a-' + idx"
                  :class="[
                    'text-xs p-1 rounded truncate',
                    actividad.importante ? 'text-red-700 font-bold' : 'text-gray-700',
                  ]"
                  :title="`${actividad.nombre}: ${formatearHorarioActividad(actividad)}`"
                >
                  ✨ {{ actividad.nombre }}
                  <span class="text-xs"> ({{ formatearHorarioActividad(actividad) }}) </span>
                </div>
              </div>

              <!-- Indicador de más elementos -->
              <div
                v-if="dia.rutinasDelDia.length + dia.activitiesDelDia.length > 4"
                class="text-xs text-gray-400 mt-1"
              >
                +{{ dia.rutinasDelDia.length + dia.activitiesDelDia.length - 4 }} más
              </div>

              <!-- Botón para agregar actividad -->
              <button
                v-if="dia.fecha && !dia.esPasado"
                @click.stop="abrirModalAgregar(dia)"
                class="mt-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition w-full border border-gray-300"
              >
                + Agregar actividad
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para agregar/editar actividad -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-800">
              {{ editingActivity ? '✏️ Editar actividad' : '➕ Nueva actividad' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
            <p class="text-sm text-gray-700">
              📅 Fecha: <strong>{{ fechaSeleccionadaFormateada }}</strong>
            </p>
          </div>

          <form @submit.prevent="guardarActividad" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la actividad *
              </label>
              <input
                v-model="activityForm.nombre"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Reunión importante, Cita médica"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                v-model="activityForm.descripcion"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe brevemente tu actividad..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> Tipo de horario </label>
              <div class="flex space-x-4">
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="puntual"
                    v-model="activityForm.tipoHorario"
                    class="text-blue-500"
                  />
                  <span class="text-gray-700">⏰ Hora puntual</span>
                </label>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="rango"
                    v-model="activityForm.tipoHorario"
                    class="text-blue-500"
                  />
                  <span class="text-gray-700">📊 Rango de horas</span>
                </label>
              </div>
            </div>

            <div v-if="activityForm.tipoHorario === 'puntual'">
              <label class="block text-sm font-medium text-gray-700 mb-2"> Hora </label>
              <select
                v-model="activityForm.horaInicio"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona una hora</option>
                <option v-for="h in 24" :key="h - 1" :value="h - 1">
                  {{ (h - 1).toString().padStart(2, '0') }}:00
                </option>
              </select>
            </div>

            <div v-else>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"> Hora inicio </label>
                  <select
                    v-model="activityForm.horaInicio"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecciona</option>
                    <option v-for="h in 24" :key="h - 1" :value="h - 1">
                      {{ (h - 1).toString().padStart(2, '0') }}:00
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"> Hora fin </label>
                  <select
                    v-model="activityForm.horaFin"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecciona</option>
                    <option v-for="h in 24" :key="h" :value="h">
                      {{ h.toString().padStart(2, '0') }}:00
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label class="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="activityForm.importante"
                  class="w-5 h-5 text-red-500 rounded focus:ring-red-500"
                />
                <span class="text-gray-700">
                  🔴 Marcar como importante (permite sobreescribir rutinas obligatorias)
                </span>
              </label>
            </div>

            <!-- Advertencia de conflictos -->
            <div
              v-if="conflictosHorario.length > 0"
              class="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
            >
              <p class="text-sm font-semibold text-yellow-800 mb-1">⚠️ Conflictos detectados:</p>
              <ul class="text-xs text-yellow-700 space-y-1">
                <li v-for="(conflicto, idx) in conflictosHorario" :key="idx">• {{ conflicto }}</li>
              </ul>
            </div>

            <!-- Resumen -->
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p class="text-sm font-semibold text-gray-700 mb-1">📋 Resumen:</p>
              <p class="text-sm text-gray-800">
                <strong>{{ activityForm.nombre || '(Sin nombre)' }}</strong>
              </p>
              <p class="text-xs text-gray-600">
                {{
                  activityForm.tipoHorario === 'puntual'
                    ? `⏰ ${activityForm.horaInicio !== null ? activityForm.horaInicio.toString().padStart(2, '0') + ':00' : 'Sin horario'}`
                    : `📊 ${activityForm.horaInicio !== null ? activityForm.horaInicio.toString().padStart(2, '0') + ':00' : '?'} - ${activityForm.horaFin !== null ? activityForm.horaFin.toString().padStart(2, '0') + ':00' : '?'}`
                }}
              </p>
              <p
                class="text-xs"
                :class="activityForm.importante ? 'text-red-600' : 'text-gray-600'"
              >
                {{
                  activityForm.importante
                    ? '⭐ Importante (puede coincidir con obligatorias)'
                    : '📌 Normal'
                }}
              </p>
            </div>

            <div class="flex space-x-3 pt-4">
              <button
                type="submit"
                :disabled="!validarHorarioSinConflictos()"
                class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {{ editingActivity ? 'Actualizar' : 'Guardar' }} actividad
              </button>
              <button
                type="button"
                @click="closeModal"
                class="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </form>

          <!-- Botón eliminar si es edición -->
          <button
            v-if="editingActivity"
            @click="eliminarActividad"
            class="w-full mt-3 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            🗑️ Eliminar actividad
          </button>
        </div>
      </div>

      <!-- Modal de detalles del día -->
      <div
        v-if="showDetailsModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="showDetailsModal = false"
      >
        <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
          <h3 class="text-xl font-bold text-gray-800 mb-4">{{ modalTitulo }}</h3>

          <!-- Rutinas del día -->
          <div v-if="modalRutinas.length > 0" class="mb-4">
            <p class="text-gray-700 font-semibold mb-2 border-b pb-1">📋 Rutinas programadas:</p>
            <div
              v-for="(rutina, idx) in modalRutinas"
              :key="'r-' + idx"
              class="p-2 border rounded-lg mb-2"
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
              <p class="text-xs text-gray-600">
                {{ rutina.horaInicio }}:00 - {{ rutina.horaFin }}:00
              </p>
            </div>
          </div>

          <!-- Actividades del día -->
          <div>
            <p class="text-gray-700 font-semibold mb-2 border-b pb-1">
              ✨ Actividades registradas:
            </p>
            <div v-if="modalActivities.length > 0">
              <div
                v-for="(act, idx) in modalActivities"
                :key="'a-' + idx"
                class="p-3 border rounded-lg mb-2"
                :class="act.importante ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <p
                      class="font-semibold"
                      :class="act.importante ? 'text-red-600' : 'text-gray-800'"
                    >
                      {{ act.nombre }}
                    </p>
                    <p class="text-sm text-gray-600">🕐 {{ formatearHorarioActividad(act) }}</p>
                    <p v-if="act.descripcion" class="text-xs text-gray-500 mt-1">
                      📝 {{ act.descripcion }}
                    </p>
                  </div>
                  <button
                    @click="editarActividadDesdeModal(act)"
                    class="text-blue-500 hover:text-blue-700 text-sm ml-2"
                  >
                    ✏️ Editar
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-gray-500 text-center py-4">
              ✨ No hay actividades registradas para este día
            </div>
          </div>

          <button
            @click="showDetailsModal = false"
            class="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDataUserStore } from '@/stores/DataUser'
import { useRoutinesStore } from '@/stores/Routines'
import { useActivitiesStore } from '@/stores/Activities'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Swal from 'sweetalert2'

const router = useRouter()
const userStore = useDataUserStore()
const routinesStore = useRoutinesStore()
const activitiesStore = useActivitiesStore()

// Estado del modal
const showModal = ref(false)
const showDetailsModal = ref(false)
const editingActivity = ref(null)
const fechaSeleccionada = ref(null)
const modalTitulo = ref('')
const modalRutinas = ref([])
const modalActivities = ref([])
const conflictosHorario = ref([])

// Formulario de actividad
const activityForm = ref({
  nombre: '',
  descripcion: '',
  tipoHorario: 'puntual',
  horaInicio: null,
  horaFin: null,
  importante: false,
})

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

// Mapeo de días para rutinas
const diaSemanaMap = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
}

// Formatear horario de actividad
const formatearHorarioActividad = (actividad) => {
  if (actividad.tipoHorario === 'puntual') {
    return `${actividad.horaInicio?.toString().padStart(2, '0') || '?'}:00`
  } else {
    return `${actividad.horaInicio?.toString().padStart(2, '0') || '?'}:00 - ${actividad.horaFin?.toString().padStart(2, '0') || '?'}:00`
  }
}

// Obtener rutinas para un día específico
const obtenerRutinasDelDia = (fecha) => {
  const diaSemana = diaSemanaMap[fecha.getDay()]
  const rutinasDelDia = []

  if (!routinesStore.routines || routinesStore.routines.length === 0) {
    return []
  }

  routinesStore.routines.forEach((rutina) => {
    const diasSeleccionados = rutina.diasSeleccionados || []

    if (diasSeleccionados.includes(diaSemana)) {
      let horaInicio = null
      let horaFin = null

      if (rutina.horariosPorDia && rutina.horariosPorDia[diaSemana]) {
        const horario = rutina.horariosPorDia[diaSemana]
        horaInicio = horario.inicio
        horaFin = horario.fin
      }

      if (horaInicio !== null && horaFin !== null) {
        rutinasDelDia.push({
          id: rutina.id,
          nombre: rutina.nombre,
          importancia: rutina.importancia || 'pasiva',
          horaInicio: horaInicio,
          horaFin: horaFin,
        })
      }
    }
  })

  return rutinasDelDia.sort((a, b) => (a.horaInicio || 99) - (b.horaInicio || 99))
}

// Verificar conflictos de horario
const verificarConflictos = (
  fecha,
  horaInicio,
  horaFin,
  tipoHorario,
  esImportante,
  actividadId = null,
) => {
  const conflictos = []
  const fechaStr = fecha.toISOString().split('T')[0]

  // Obtener rutinas del día
  const rutinasDelDia = obtenerRutinasDelDia(fecha)

  // Obtener actividades del día (excluyendo la actual si es edición)
  let actividadesDelDia = activitiesStore.getActivitiesForDate(fechaStr)
  if (actividadId) {
    actividadesDelDia = actividadesDelDia.filter((a) => a.id !== actividadId)
  }

  // Determinar horas de la nueva actividad
  let nuevaInicio = horaInicio
  let nuevaFin = tipoHorario === 'puntual' ? horaInicio + 1 : horaFin

  // 1. Verificar conflictos con rutinas obligatorias
  for (const rutina of rutinasDelDia) {
    if (rutina.importancia === 'obligatoria') {
      const haySolapamiento = !(nuevaFin <= rutina.horaInicio || nuevaInicio >= rutina.horaFin)

      if (haySolapamiento) {
        if (!esImportante) {
          conflictos.push(
            `⚠️ Coincide con rutina OBLIGATORIA "${rutina.nombre}" (${rutina.horaInicio}:00 - ${rutina.horaFin}:00). Marca la actividad como IMPORTANTE para permitirlo.`,
          )
        }
      }
    }
  }

  // 2. Verificar conflictos con otras actividades
  for (const actividad of actividadesDelDia) {
    let actInicio = actividad.horaInicio
    let actFin = actividad.tipoHorario === 'puntual' ? actividad.horaInicio + 1 : actividad.horaFin

    const haySolapamiento = !(nuevaFin <= actInicio || nuevaInicio >= actFin)

    if (haySolapamiento) {
      conflictos.push(
        `⚠️ Coincide con actividad "${actividad.nombre}" (${formatearHorarioActividad(actividad)}). No puede haber dos actividades en el mismo horario.`,
      )
    }
  }

  return conflictos
}

// Validar si se puede guardar
const validarHorarioSinConflictos = () => {
  if (!fechaSeleccionada.value) return false
  if (!activityForm.value.nombre.trim()) return false

  if (activityForm.value.tipoHorario === 'puntual') {
    if (activityForm.value.horaInicio === null) return false
  } else {
    if (activityForm.value.horaInicio === null || activityForm.value.horaFin === null) return false
    if (activityForm.value.horaInicio >= activityForm.value.horaFin) return false
  }

  const conflictos = verificarConflictos(
    fechaSeleccionada.value,
    activityForm.value.horaInicio,
    activityForm.value.horaFin,
    activityForm.value.tipoHorario,
    activityForm.value.importante,
    editingActivity.value?.id,
  )

  conflictosHorario.value = conflictos
  return conflictos.length === 0
}

// Generar calendario
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
    const esPasado = fecha < hoy && !esHoy
    const fechaStr = fecha.toISOString().split('T')[0]

    const rutinasDelDia = obtenerRutinasDelDia(fecha)
    const activitiesDelDia = activitiesStore.getActivitiesForDate(fechaStr)

    calendario.push({
      dia: i,
      fecha: fecha,
      fechaStr: fechaStr,
      esHoy: esHoy,
      esPasado: esPasado,
      fechaSeleccionada: fechaSeleccionada.value?.toDateString() === fecha.toDateString(),
      rutinasDelDia: rutinasDelDia,
      activitiesDelDia: activitiesDelDia,
    })
  }

  return calendario
})

// Fecha seleccionada formateada
const fechaSeleccionadaFormateada = computed(() => {
  if (!fechaSeleccionada.value) return ''
  return fechaSeleccionada.value.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// Funciones
const seleccionarDia = (dia) => {
  if (!dia || !dia.fecha || dia.esPasado) return
  fechaSeleccionada.value = dia.fecha
  verDetallesDia(dia)
}

const verDetallesDia = (dia) => {
  if (!dia || !dia.fecha) return

  const fechaFormateada = dia.fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  modalTitulo.value = `📅 ${fechaFormateada}`
  modalRutinas.value = dia.rutinasDelDia
  modalActivities.value = dia.activitiesDelDia
  showDetailsModal.value = true
}

const abrirModalAgregar = (dia) => {
  if (!dia || !dia.fecha || dia.esPasado) return

  fechaSeleccionada.value = dia.fecha
  editingActivity.value = null
  activityForm.value = {
    nombre: '',
    descripcion: '',
    tipoHorario: 'puntual',
    horaInicio: null,
    horaFin: null,
    importante: false,
  }
  conflictosHorario.value = []
  showModal.value = true
}

const editarActividadDesdeModal = (actividad) => {
  showDetailsModal.value = false
  editingActivity.value = actividad
  fechaSeleccionada.value = new Date(actividad.fecha)
  activityForm.value = {
    nombre: actividad.nombre,
    descripcion: actividad.descripcion || '',
    tipoHorario: actividad.tipoHorario || 'puntual',
    horaInicio: actividad.horaInicio,
    horaFin: actividad.horaFin,
    importante: actividad.importante || false,
  }
  conflictosHorario.value = []
  showModal.value = true
}

const guardarActividad = async () => {
  // Validaciones finales
  if (!activityForm.value.nombre.trim()) {
    await Swal.fire('Error', 'El nombre de la actividad es obligatorio', 'error')
    return
  }

  if (activityForm.value.tipoHorario === 'puntual' && activityForm.value.horaInicio === null) {
    await Swal.fire('Error', 'Selecciona una hora para la actividad', 'error')
    return
  }

  if (activityForm.value.tipoHorario === 'rango') {
    if (activityForm.value.horaInicio === null || activityForm.value.horaFin === null) {
      await Swal.fire('Error', 'Selecciona el rango de horas completo', 'error')
      return
    }
    if (activityForm.value.horaInicio >= activityForm.value.horaFin) {
      await Swal.fire('Error', 'La hora de inicio debe ser menor que la hora de fin', 'error')
      return
    }
  }

  // Verificar conflictos una última vez
  const conflictos = verificarConflictos(
    fechaSeleccionada.value,
    activityForm.value.horaInicio,
    activityForm.value.horaFin,
    activityForm.value.tipoHorario,
    activityForm.value.importante,
    editingActivity.value?.id,
  )

  if (conflictos.length > 0) {
    await Swal.fire({
      title: '❌ No se puede guardar',
      html: conflictos.join('<br>'),
      icon: 'error',
      confirmButtonText: 'Entendido',
    })
    return
  }

  const fechaStr = fechaSeleccionada.value.toISOString().split('T')[0]

  const activityData = {
    nombre: activityForm.value.nombre.trim(),
    descripcion: activityForm.value.descripcion,
    fecha: fechaStr,
    tipoHorario: activityForm.value.tipoHorario,
    horaInicio: activityForm.value.horaInicio,
    horaFin: activityForm.value.tipoHorario === 'rango' ? activityForm.value.horaFin : null,
    importante: activityForm.value.importante,
  }

  if (editingActivity.value) {
    activitiesStore.updateActivity(editingActivity.value.id, activityData)
    await Swal.fire({
      icon: 'success',
      title: 'Actividad actualizada',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    })
  } else {
    activitiesStore.addActivity(activityData)
    await Swal.fire({
      icon: 'success',
      title: 'Actividad agregada',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    })
  }

  closeModal()
}

const eliminarActividad = async () => {
  const result = await Swal.fire({
    title: '¿Eliminar actividad?',
    text: `¿Estás seguro de que quieres eliminar "${activityForm.value.nombre}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  })

  if (result.isConfirmed) {
    activitiesStore.deleteActivity(editingActivity.value.id)
    await Swal.fire({
      icon: 'success',
      title: 'Actividad eliminada',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
    })
    closeModal()
  }
}

const closeModal = () => {
  showModal.value = false
  editingActivity.value = null
  conflictosHorario.value = []
}

const cambiarMes = (direccion) => {
  mesActual.value += direccion
  if (mesActual.value < 0) {
    mesActual.value = 11
    añoActual.value--
  } else if (mesActual.value > 11) {
    mesActual.value = 0
    añoActual.value++
  }
}

// Watcher para validar en tiempo real
import { watch } from 'vue'
watch(
  () => [
    activityForm.value.horaInicio,
    activityForm.value.horaFin,
    activityForm.value.tipoHorario,
    activityForm.value.importante,
    activityForm.value.nombre,
  ],
  () => {
    if (fechaSeleccionada.value && activityForm.value.nombre.trim()) {
      validarHorarioSinConflictos()
    }
  },
  { deep: true },
)

// Inicializar
onMounted(() => {
  if (!userStore.userData) {
    router.push('/')
  }

  routinesStore.loadFromLocalStorage()
  activitiesStore.loadFromLocalStorage()
})
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.min-h-[130px] {
  min-height: 130px;
}

.cursor-pointer {
  cursor: pointer;
}

.transition {
  transition: all 0.2s ease;
}
</style>
