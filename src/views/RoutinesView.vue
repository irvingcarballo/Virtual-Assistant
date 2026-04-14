<!-- views/RoutinesView.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navbar Component -->
    <Navbar @change-view="handleViewChange" />

    <div class="max-w-7xl mx-auto p-8">
      <!-- Header con botón y estadísticas -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Mis Rutinas</h1>
          <p class="text-gray-600">Organiza y gestiona tus rutinas semanales</p>
        </div>

        <div class="flex gap-3">
          <!-- Botón para configurar horario -->
          <button
            @click="openConfigModal"
            class="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition flex items-center space-x-2 shadow-md"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Configurar horario</span>
          </button>

          <button
            @click="openModal()"
            class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition transform hover:scale-105 flex items-center space-x-2 shadow-lg"
          >
            <PlusIcon class="h-5 w-5" />
            <span>Agregar nueva rutina</span>
          </button>
        </div>
      </div>

      <!-- Tarjeta de estadísticas -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <p class="text-gray-500 text-sm mb-1">Horas disponibles a la semana</p>
            <p class="text-3xl font-bold text-blue-600">{{ horasDisponiblesSemanales }}h</p>
            <p class="text-xs text-gray-400 mt-1">{{ rangoHorarioTexto }}</p>
          </div>
          <div class="text-center">
            <p class="text-gray-500 text-sm mb-1">Horas usadas en rutinas</p>
            <p
              class="text-3xl font-bold"
              :class="{
                'text-green-600': totalHorasUsadas <= horasDisponiblesSemanales * 0.5,
                'text-yellow-600':
                  totalHorasUsadas > horasDisponiblesSemanales * 0.5 &&
                  totalHorasUsadas <= horasDisponiblesSemanales * 0.8,
                'text-red-600': totalHorasUsadas > horasDisponiblesSemanales * 0.8,
              }"
            >
              {{ totalHorasUsadas }}h
            </p>
          </div>
          <div class="text-center">
            <p class="text-gray-500 text-sm mb-1">Horas restantes</p>
            <p
              class="text-3xl font-bold"
              :class="{
                'text-green-600': horasRestantes >= horasDisponiblesSemanales * 0.5,
                'text-yellow-600':
                  horasRestantes < horasDisponiblesSemanales * 0.5 && horasRestantes > 0,
                'text-red-600': horasRestantes === 0,
              }"
            >
              {{ horasRestantes }}h
            </p>
          </div>
        </div>

        <!-- Barra de progreso -->
        <div class="mt-4">
          <div class="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progreso de uso</span>
            <span>{{ porcentajeUso }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              class="h-3 rounded-full transition-all duration-500"
              :class="{
                'bg-green-500': porcentajeUso <= 50,
                'bg-yellow-500': porcentajeUso > 50 && porcentajeUso <= 80,
                'bg-red-500': porcentajeUso > 80,
              }"
              :style="{ width: `${Math.min(porcentajeUso, 100)}%` }"
            ></div>
          </div>
        </div>

        <!-- Indicador de estado -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex items-center justify-center space-x-2">
            <span class="text-2xl">{{ indicadorInfo.emoji }}</span>
            <span class="text-gray-700">{{ indicadorInfo.texto }}</span>
          </div>
        </div>
      </div>

      <!-- Lista de rutinas -->
      <div v-if="routines.length === 0" class="bg-white rounded-xl shadow-md p-12 text-center">
        <CalendarIcon class="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-600 mb-2">No tienes rutinas aún</h3>
        <p class="text-gray-500">Haz clic en "Agregar nueva rutina" para comenzar</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="routine in routines"
          :key="routine.id"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd(routine)"
          @contextmenu.prevent="showContextMenu(routine, $event)"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105 cursor-pointer"
        >
          <div class="p-6">
            <div class="flex justify-between items-start mb-3">
              <h3 class="text-xl font-semibold text-gray-800">{{ routine.nombre }}</h3>
              <div class="flex space-x-1">
                <span
                  :class="{
                    'bg-green-100 text-green-700': routine.importancia === 'pasiva',
                    'bg-red-100 text-red-700': routine.importancia === 'obligatoria',
                  }"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ routine.importancia === 'pasiva' ? '🌿 Pasiva' : '⚡ Obligatoria' }}
                </span>
              </div>
            </div>

            <p class="text-gray-600 text-sm mb-4">{{ routine.descripcion || 'Sin descripción' }}</p>

            <div class="space-y-2">
              <div class="flex items-center text-sm text-gray-500">
                <CalendarIcon class="h-4 w-4 mr-2" />
                <span>{{
                  Object.keys(routine.horariosPorDia || routine.horasPorDia || {}).join(', ')
                }}</span>
              </div>
              <div class="flex flex-col space-y-1 text-sm text-gray-500">
                <div
                  v-for="(horario, dia) in routine.horariosPorDia || routine.horasPorDia"
                  :key="dia"
                  class="flex items-center justify-between"
                >
                  <span class="flex items-center">
                    <ClockIcon class="h-4 w-4 mr-2" />
                    {{ dia }}:
                  </span>
                  <span class="font-medium">
                    <span v-if="typeof horario === 'object'">
                      {{ horario.inicio }}:00 - {{ horario.fin }}:00 ({{
                        horario.fin - horario.inicio
                      }}h)
                    </span>
                    <span v-else> {{ horario }} hora{{ horario !== 1 ? 's' : '' }} </span>
                  </span>
                </div>
              </div>
              <div
                class="flex items-center text-sm font-semibold mt-2 pt-2 border-t"
                :class="{
                  'text-green-600': routine.totalHoras <= horasDisponiblesSemanales * 0.3,
                  'text-yellow-600':
                    routine.totalHoras > horasDisponiblesSemanales * 0.3 &&
                    routine.totalHoras <= horasDisponiblesSemanales * 0.6,
                  'text-red-600': routine.totalHoras > horasDisponiblesSemanales * 0.6,
                }"
              >
                <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Total: {{ routine.totalHoras }}h/semana</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para configurar horario -->
    <div
      v-if="showConfigModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-semibold">Configurar horario disponible</h3>
          <button @click="closeConfigModal" class="text-gray-400 hover:text-gray-600">
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

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hora de inicio</label>
            <select
              v-model="configHorario.inicio"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="h in 24" :key="h - 1" :value="h - 1">
                {{ h - 1 }}:00 {{ h - 1 >= 12 ? 'PM' : 'AM' }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hora de fin</label>
            <select
              v-model="configHorario.fin"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="h in 24" :key="h" :value="h">
                {{ h }}:00 {{ h >= 12 ? 'PM' : 'AM' }}
              </option>
            </select>
          </div>

          <div class="bg-blue-50 rounded-lg p-3">
            <div class="text-sm text-gray-600">
              <p>📊 Resumen:</p>
              <p class="font-semibold mt-1">
                Horas por día: {{ configHorario.fin - configHorario.inicio }}h
              </p>
              <p class="font-semibold">
                Horas totales a la semana: {{ (configHorario.fin - configHorario.inicio) * 7 }}h
              </p>
            </div>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              @click="saveConfiguracion"
              class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              Guardar configuración
            </button>
            <button
              @click="closeConfigModal"
              class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar rutina con selectores mejorados -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-2xl font-semibold">
            {{ editingRoutine ? 'Editar rutina' : 'Nueva rutina' }}
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

        <form @submit.prevent="saveRoutine" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Nombre de la rutina *</label
            >
            <input
              v-model="routineForm.nombre"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Ejercicio, Estudio, Trabajo"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descripción breve</label>
            <textarea
              v-model="routineForm.descripcion"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Describe brevemente tu rutina..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Horario por día *</label>
            <div class="grid grid-cols-1 gap-3">
              <div
                v-for="dia in diasSemana"
                :key="dia"
                class="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition cursor-pointer"
                :class="{
                  'ring-2 ring-blue-500 bg-blue-50': routineForm.diasSeleccionados.includes(dia),
                }"
                @click="toggleDia(dia)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-6 h-6 rounded-full flex items-center justify-center transition"
                      :class="{
                        'bg-blue-500 text-white': routineForm.diasSeleccionados.includes(dia),
                        'bg-gray-300 text-gray-500': !routineForm.diasSeleccionados.includes(dia),
                      }"
                    >
                      <svg
                        v-if="routineForm.diasSeleccionados.includes(dia)"
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span class="font-medium text-gray-700">{{ dia }}</span>
                  </div>

                  <div
                    v-if="routineForm.diasSeleccionados.includes(dia)"
                    class="flex items-center space-x-2"
                    @click.stop
                  >
                    <select
                      v-model="routineForm.horariosPorDia[dia].inicio"
                      class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option v-for="h in horasDisponibles" :key="h" :value="h">
                        {{ h }}:00 {{ h >= 12 ? 'PM' : 'AM' }}
                      </option>
                    </select>
                    <span class="text-gray-500">→</span>
                    <select
                      v-model="routineForm.horariosPorDia[dia].fin"
                      class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                      <option v-for="h in horasDisponibles" :key="h" :value="h">
                        {{ h }}:00 {{ h >= 12 ? 'PM' : 'AM' }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Mostrar horas calculadas -->
                <div
                  v-if="
                    routineForm.diasSeleccionados.includes(dia) && routineForm.horariosPorDia[dia]
                  "
                  class="mt-2 ml-9 text-xs text-green-600"
                >
                  ⏱️
                  {{ routineForm.horariosPorDia[dia].fin - routineForm.horariosPorDia[dia].inicio }}
                  horas
                </div>
              </div>
            </div>
            <p v-if="routineForm.diasSeleccionados.length === 0" class="text-red-500 text-xs mt-1">
              Selecciona al menos un día
            </p>
          </div>

          <!-- Mostrar horas totales calculadas en tiempo real -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">📊 Horas totales a la semana:</span>
              <span
                class="text-2xl font-bold"
                :class="{
                  'text-green-600': horasTotalesCalculadas <= horasDisponiblesSemanales * 0.3,
                  'text-yellow-600':
                    horasTotalesCalculadas > horasDisponiblesSemanales * 0.3 &&
                    horasTotalesCalculadas <= horasDisponiblesSemanales * 0.6,
                  'text-red-600': horasTotalesCalculadas > horasDisponiblesSemanales * 0.6,
                }"
              >
                {{ horasTotalesCalculadas }}h
              </span>
            </div>
            <div class="text-xs text-gray-500 mt-2 space-y-1">
              <div
                v-for="(horario, dia) in routineForm.horariosPorDia"
                :key="dia"
                class="flex justify-between"
              >
                <span>{{ dia }}:</span>
                <span
                  >{{ horario.inicio }}:00 - {{ horario.fin }}:00 ({{
                    horario.fin - horario.inicio
                  }}h)</span
                >
              </div>
              <div class="border-t pt-1 mt-1 font-semibold text-gray-700">
                Total acumulado: {{ horasTotalesCalculadas }} horas a la semana
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Importancia *</label>
            <div class="flex space-x-4">
              <label
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  value="pasiva"
                  v-model="routineForm.importancia"
                  class="text-green-500 focus:ring-green-500"
                />
                <span>🌿 Pasiva</span>
              </label>
              <label
                class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  value="obligatoria"
                  v-model="routineForm.importancia"
                  class="text-red-500 focus:ring-red-500"
                />
                <span>⚡ Obligatoria</span>
              </label>
            </div>
          </div>

          <div class="flex space-x-3 pt-4">
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:opacity-90 transition transform hover:scale-105"
            >
              {{ editingRoutine ? 'Actualizar' : 'Guardar' }} rutina
            </button>
            <button
              type="button"
              @click="closeModal"
              class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Menú contextual -->
    <div
      v-if="contextMenu.show"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
      class="fixed bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
    >
      <button
        @click="editRoutine(contextMenu.routine)"
        class="w-full text-left px-6 py-3 text-gray-700 hover:bg-blue-50 transition flex items-center space-x-2"
      >
        <PencilIcon class="h-4 w-4" />
        <span>Editar rutina</span>
      </button>
      <button
        @click="confirmDelete(contextMenu.routine)"
        class="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 transition flex items-center space-x-2"
      >
        <TrashIcon class="h-4 w-4" />
        <span>Eliminar rutina</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoutinesStore } from '@/stores/Routines'
import Navbar from '@/components/Navbar.vue'
import { PlusIcon, CalendarIcon, ClockIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import Swal from 'sweetalert2'

const routinesStore = useRoutinesStore()
const routines = computed(() => routinesStore.routines)
const horasDisponiblesSemanales = computed(() => routinesStore.horasDisponiblesSemanales)
const totalHorasUsadas = computed(() => routinesStore.totalHorasUsadas)
const horasRestantes = computed(() => routinesStore.horasRestantes)
const indicadorInfo = computed(() => routinesStore.indicadorColor)

// Calcular porcentaje de uso
const porcentajeUso = computed(() => {
  return Math.round((totalHorasUsadas.value / horasDisponiblesSemanales.value) * 100)
})

// Texto del rango horario
const rangoHorarioTexto = computed(() => {
  const inicio = routinesStore.horaInicio
  const fin = routinesStore.horaFin
  const formatoHora = (hora) => {
    const periodo = hora >= 12 ? 'PM' : 'AM'
    const hora12 = hora % 12 || 12
    return `${hora12}:00 ${periodo}`
  }
  return `${formatoHora(inicio)} a ${formatoHora(fin)}`
})

// Horas disponibles para seleccionar (dentro del rango configurado)
const horasDisponibles = computed(() => {
  const horas = []
  for (let i = routinesStore.horaInicio; i <= routinesStore.horaFin; i++) {
    horas.push(i)
  }
  return horas
})

// Calcular horas totales en tiempo real para el formulario
const horasTotalesCalculadas = computed(() => {
  let total = 0
  for (const dia of routineForm.value.diasSeleccionados) {
    const horario = routineForm.value.horariosPorDia[dia]
    if (horario && horario.inicio && horario.fin) {
      const horas = horario.fin - horario.inicio
      total += horas > 0 ? horas : 0
    }
  }
  return total
})

const showModal = ref(false)
const showConfigModal = ref(false)
const editingRoutine = ref(null)
const contextMenu = ref({ show: false, x: 0, y: 0, routine: null })

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const routineForm = ref({
  nombre: '',
  descripcion: '',
  diasSeleccionados: [],
  horariosPorDia: {},
  importancia: 'pasiva',
  totalHoras: 0,
})

const configHorario = ref({
  inicio: 8,
  fin: 21,
})

let touchTimer = null

const toggleDia = (dia) => {
  const index = routineForm.value.diasSeleccionados.indexOf(dia)
  if (index === -1) {
    routineForm.value.diasSeleccionados.push(dia)
    if (!routineForm.value.horariosPorDia[dia]) {
      routineForm.value.horariosPorDia[dia] = {
        inicio: routinesStore.horaInicio,
        fin: routinesStore.horaInicio + 1,
      }
    }
  } else {
    routineForm.value.diasSeleccionados.splice(index, 1)
    delete routineForm.value.horariosPorDia[dia]
  }
}

const handleTouchStart = () => {
  touchTimer = setTimeout(() => {}, 500)
}

const handleTouchEnd = (routine) => {
  if (touchTimer) {
    clearTimeout(touchTimer)
    showContextMenu(routine)
  }
}

const showContextMenu = (routine, event) => {
  event = event || window.event
  const x = event.clientX || event.touches?.[0]?.clientX || 0
  const y = event.clientY || event.touches?.[0]?.clientY || 0

  contextMenu.value = {
    show: true,
    x: x,
    y: y,
    routine: routine,
  }

  setTimeout(() => {
    const closeMenu = () => {
      contextMenu.value.show = false
      document.removeEventListener('click', closeMenu)
    }
    document.addEventListener('click', closeMenu)
  }, 100)
}

const openConfigModal = () => {
  configHorario.value = {
    inicio: routinesStore.horaInicio,
    fin: routinesStore.horaFin,
  }
  showConfigModal.value = true
}

const closeConfigModal = () => {
  showConfigModal.value = false
}

const saveConfiguracion = async () => {
  if (configHorario.value.inicio >= configHorario.value.fin) {
    await Swal.fire('Error', 'La hora de inicio debe ser menor que la hora de fin', 'error')
    return
  }

  routinesStore.setRangoHorario(configHorario.value.inicio, configHorario.value.fin)
  await Swal.fire({
    title: 'Configuración guardada',
    text: `Horario actualizado: ${rangoHorarioTexto.value}`,
    icon: 'success',
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
  })
  closeConfigModal()
}

const openModal = (routine = null) => {
  if (routine) {
    editingRoutine.value = routine
    routineForm.value = {
      nombre: routine.nombre,
      descripcion: routine.descripcion,
      diasSeleccionados: Object.keys(routine.horariosPorDia || routine.horasPorDia || {}),
      horariosPorDia: { ...(routine.horariosPorDia || routine.horasPorDia) },
      importancia: routine.importancia,
      totalHoras: routine.totalHoras,
    }
  } else {
    editingRoutine.value = null
    routineForm.value = {
      nombre: '',
      descripcion: '',
      diasSeleccionados: [],
      horariosPorDia: {},
      importancia: 'pasiva',
      totalHoras: 0,
    }
  }
  showModal.value = true
}

const editRoutine = (routine) => {
  contextMenu.value.show = false
  openModal(routine)
}

const confirmDelete = async (routine) => {
  contextMenu.value.show = false

  const result = await Swal.fire({
    title: '¿Eliminar rutina?',
    text: `¿Estás seguro de que quieres eliminar "${routine.nombre}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  })

  if (result.isConfirmed) {
    routinesStore.deleteRoutine(routine.id)
    Swal.fire('Eliminada', 'La rutina ha sido eliminada', 'success')
  }
}

const saveRoutine = () => {
  // Validaciones
  if (routineForm.value.diasSeleccionados.length === 0) {
    Swal.fire('Error', 'Selecciona al menos un día para la rutina', 'error')
    return
  }

  // Validar que cada día tenga horario asignado y válido
  for (const dia of routineForm.value.diasSeleccionados) {
    const horario = routineForm.value.horariosPorDia[dia]
    if (!horario || !horario.inicio || !horario.fin) {
      Swal.fire('Error', `Por favor asigna el horario para el día ${dia}`, 'error')
      return
    }

    if (horario.inicio < routinesStore.horaInicio || horario.fin > routinesStore.horaFin) {
      Swal.fire(
        'Error',
        `El horario para ${dia} debe estar dentro del rango disponible (${rangoHorarioTexto.value})`,
        'error',
      )
      return
    }

    if (horario.inicio >= horario.fin) {
      Swal.fire(
        'Error',
        `La hora de inicio debe ser menor que la hora de fin para el día ${dia}`,
        'error',
      )
      return
    }
  }

  // Calcular horas totales
  const horasTotales = horasTotalesCalculadas.value

  // Verificar si excede las horas disponibles semanales
  let nuevasHorasUsadas = totalHorasUsadas.value
  if (editingRoutine.value) {
    const horasAntiguas = editingRoutine.value.totalHoras
    nuevasHorasUsadas = totalHorasUsadas.value - horasAntiguas + horasTotales
  } else {
    nuevasHorasUsadas = totalHorasUsadas.value + horasTotales
  }

  if (nuevasHorasUsadas > horasDisponiblesSemanales.value) {
    Swal.fire({
      title: '⚠️ Excedes las horas disponibles',
      html: `Esta rutina consumiría <strong>${horasTotales}h</strong> a la semana.<br>
             Te quedarían <strong>${Math.max(0, horasDisponiblesSemanales.value - nuevasHorasUsadas)}h</strong> disponibles.<br><br>
             ¿Deseas continuar de todos modos?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        guardarRutina(horasTotales)
      }
    })
    return
  }

  guardarRutina(horasTotales)
}

const guardarRutina = (horasTotales) => {
  // Crear un objeto con los horarios por día
  const horariosPorDiaFinal = {}
  for (const dia of routineForm.value.diasSeleccionados) {
    if (routineForm.value.horariosPorDia[dia]) {
      horariosPorDiaFinal[dia] = {
        inicio: parseInt(routineForm.value.horariosPorDia[dia].inicio),
        fin: parseInt(routineForm.value.horariosPorDia[dia].fin),
      }
    }
  }

  const routineData = {
    nombre: routineForm.value.nombre,
    descripcion: routineForm.value.descripcion,
    diasSeleccionados: routineForm.value.diasSeleccionados,
    horariosPorDia: horariosPorDiaFinal,
    importancia: routineForm.value.importancia,
    totalHoras: horasTotales,
  }

  if (editingRoutine.value) {
    routinesStore.updateRoutine(editingRoutine.value.id, routineData)
    Swal.fire('Actualizada', 'Rutina actualizada correctamente', 'success')
  } else {
    routinesStore.addRoutine(routineData)
    Swal.fire('Agregada', 'Nueva rutina agregada correctamente', 'success')
  }

  closeModal()
}

const closeModal = () => {
  showModal.value = false
  editingRoutine.value = null
}

onMounted(() => {
  routinesStore.loadFromLocalStorage()
})

onUnmounted(() => {
  if (touchTimer) clearTimeout(touchTimer)
})
</script>
