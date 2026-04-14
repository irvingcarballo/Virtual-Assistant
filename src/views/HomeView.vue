<!-- views/HomeView.vue -->
<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-4 relative"
        >
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <!-- Icono de pregunta flotante -->
          <div class="absolute -top-2 -right-2">
            <button
              @click="mostrarInfo"
              class="bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition transform hover:scale-110 shadow-md"
            >
              <svg
                class="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Asistente de Agenda</h2>
        <p class="text-gray-600">Organiza tus rutinas y tiempos con IA</p>
      </div>

      <form @submit.prevent="guardarUsuario" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
          <input
            v-model="formData.nombre"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Edad</label>
          <input
            v-model="formData.edad"
            type="number"
            required
            min="1"
            max="120"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Tu edad"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ocupación</label>
          <select
            v-model="formData.ocupacion"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">Selecciona tu ocupación</option>
            <option value="estudiante">Estudiante</option>
            <option value="empleado">Empleado</option>
            <option value="emprendedor">Emprendedor</option>
            <option value="deportista">Deportista</option>
            <option value="otro">Otro</option>
            <option value="ninguno">Ninguno</option>
          </select>
        </div>
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:opacity-90 transition transform hover:scale-105"
        >
          Comenzar
        </button>
      </form>

      <div class="mt-6 text-center text-xs text-gray-500">
        <p>Regístrate para acceder a todas las funcionalidades</p>
      </div>
    </div>

    <!-- Modal de información -->
    <div
      v-if="showInfoModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showInfoModal = false"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4 transform transition-all">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-800">¿Qué es este asistente?</h3>
          <button
            @click="showInfoModal = false"
            class="text-gray-400 hover:text-gray-600 transition"
          >
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

        <div class="space-y-4 text-gray-600">
          <div class="flex items-start space-x-3">
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5"
            >
              <svg
                class="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p>
              <strong class="text-gray-800">Crear rutinas personalizadas</strong><br />Diseña y
              organiza tus rutinas diarias, semanales o mensuales según tus necesidades.
            </p>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5"
            >
              <svg
                class="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p>
              <strong class="text-gray-800">Administrar agendas</strong><br />Visualiza y gestiona
              tu calendario de manera intuitiva, marcando días importantes.
            </p>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5"
            >
              <svg
                class="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <p>
              <strong class="text-gray-800">Asistente con IA</strong><br />Recibe recomendaciones
              inteligentes para optimizar tus tiempos y mejorar tu productividad.
            </p>
          </div>

          <div class="flex items-start space-x-3">
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5"
            >
              <svg
                class="w-4 h-4 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p>
              <strong class="text-gray-800">Organización de tiempos</strong><br />Analiza tu
              disponibilidad horaria y obtén sugerencias para distribuir mejor tus actividades.
            </p>
          </div>
        </div>

        <div class="mt-6 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800 text-center">
            ✨ Este asistente te ayudará a maximizar tu productividad y mantener un mejor control de
            tus actividades diarias.
          </p>
        </div>

        <button
          @click="showInfoModal = false"
          class="mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Entendido
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDataUserStore } from '@/stores/DataUser'
import Swal from 'sweetalert2'

const router = useRouter()
const userStore = useDataUserStore()
const showInfoModal = ref(false)

const formData = ref({
  nombre: '',
  edad: '',
  ocupacion: '',
})

// Función para mostrar el modal de información
const mostrarInfo = () => {
  showInfoModal.value = true
}

// Función para validar el nombre
const validarNombre = (nombre) => {
  nombre = nombre.trim()
  if (!nombre) return 'El nombre no puede estar vacío'

  const soloLetras = nombre.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]/g, '')
  if (soloLetras.length < 4) return 'El nombre debe tener al menos 4 letras'

  const soloNumeros = /^[0-9]+$/.test(nombre.replace(/\s/g, ''))
  if (soloNumeros) return 'El nombre no puede ser solo números'

  const tieneLetras = /[a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(nombre)
  if (!tieneLetras) return 'El nombre debe contener al menos una letra'

  return ''
}

// Función para validar la edad
const validarEdad = (edad) => {
  if (!edad) return 'La edad no puede estar vacía'
  const edadNum = Number(edad)
  if (isNaN(edadNum)) return 'La edad debe ser un número válido'
  if (edadNum < 1) return 'La edad debe ser mayor a 0 años'
  if (edadNum > 120) return 'La edad no puede ser mayor a 120 años'
  return ''
}

const guardarUsuario = async () => {
  // Validaciones
  const errorNombre = validarNombre(formData.value.nombre)
  const errorEdad = validarEdad(formData.value.edad)

  if (errorNombre) {
    await Swal.fire('Error', errorNombre, 'error')
    return
  }

  if (errorEdad) {
    await Swal.fire('Error', errorEdad, 'error')
    return
  }

  if (!formData.value.ocupacion) {
    await Swal.fire('Error', 'Por favor selecciona una ocupación', 'error')
    return
  }

  // Guardar usuario
  userStore.setUserData({
    nombre: formData.value.nombre.trim(),
    edad: parseInt(formData.value.edad),
    ocupacion: formData.value.ocupacion,
  })

  // Mostrar mensaje de bienvenida
  await Swal.fire({
    title: '¡Bienvenido!',
    text: `Hola ${formData.value.nombre}, tus datos han sido registrados correctamente.`,
    icon: 'success',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Continuar',
    timer: 2000,
    timerProgressBar: true,
  })

  // Redirigir a MainView
  router.push('/main')
}
</script>
