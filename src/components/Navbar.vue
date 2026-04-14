<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Botones izquierda con router-link -->
        <div class="flex space-x-4">
          <!-- Nuevo botón Inicio -->
          <router-link
            to="/main"
            class="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            active-class="bg-blue-100 text-blue-700"
          >
            <HomeIcon class="h-5 w-5" />
            <span class="hidden sm:inline">Inicio</span>
          </router-link>

          <router-link
            to="/routines"
            class="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            active-class="bg-blue-100 text-blue-700"
          >
            <ClipboardDocumentListIcon class="h-5 w-5" />
            <span class="hidden sm:inline">Rutinas</span>
          </router-link>

          <router-link
            to="/activities"
            class="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            active-class="bg-blue-100 text-blue-700"
          >
            <CalendarIcon class="h-5 w-5" />
            <span class="hidden sm:inline">Actividades</span>
          </router-link>

          <router-link
            to="/assistant"
            class="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            active-class="bg-blue-100 text-blue-700"
          >
            <UserGroupIcon class="h-5 w-5" />
            <span class="hidden sm:inline">Asistente</span>
          </router-link>
        </div>

        <!-- Perfil derecha con menú -->
        <div class="relative">
          <div
            @click="toggleMenu"
            class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
          >
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">
                {{ userStore.userData?.nombre || 'Usuario' }}
              </p>
              <p class="text-xs text-gray-500">
                {{ userStore.userData?.ocupacion || 'Sin ocupación' }}
              </p>
            </div>
            <div
              class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold"
            >
              {{ userStore.userData?.nombre?.charAt(0) || 'U' }}
            </div>
          </div>

          <!-- Menú desplegable -->
          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div class="p-4 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-900">{{ userStore.userData?.nombre }}</p>
              <p class="text-xs text-gray-500">
                {{ userStore.userData?.edad }} años -
                {{ obtenerTextoOcupacion(userStore.userData?.ocupacion) }}
              </p>
            </div>
            <div class="py-2">
              <button
                @click="openEditModal"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition flex items-center space-x-2"
              >
                <PencilIcon class="h-4 w-4" />
                <span>Cambiar datos</span>
              </button>
              <div class="border-t border-gray-100 my-1"></div>
              <button
                @click="confirmarEliminarDatos"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center space-x-2"
              >
                <TrashIcon class="h-4 w-4" />
                <span>Eliminar mis datos</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de edición de datos -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-semibold mb-4">Cambiar mis datos</h3>
        <form @submit.prevent="confirmarCambios">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                v-model="formData.nombre"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre"
              />
              <p v-if="errores.nombre" class="text-red-500 text-xs mt-1">{{ errores.nombre }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Edad</label>
              <input
                v-model="formData.edad"
                type="number"
                required
                min="1"
                max="120"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu edad"
              />
              <p v-if="errores.edad" class="text-red-500 text-xs mt-1">{{ errores.edad }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ocupación</label>
              <select
                v-model="formData.ocupacion"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              @click="closeEditModal"
              class="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDataUserStore } from '@/stores/DataUser'
import Swal from 'sweetalert2'
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'

const userStore = useDataUserStore()
const showMenu = ref(false)
const showEditModal = ref(false)
const formData = ref({
  nombre: '',
  edad: '',
  ocupacion: '',
})

const errores = ref({
  nombre: '',
  edad: '',
})

// Función para obtener el texto legible de la ocupación
const obtenerTextoOcupacion = (ocupacion) => {
  const ocupaciones = {
    estudiante: 'Estudiante',
    empleado: 'Empleado',
    emprendedor: 'Emprendedor',
    deportista: 'Deportista',
    otro: 'Otro',
    ninguno: 'Ninguno',
  }
  return ocupaciones[ocupacion] || ocupacion || 'Sin ocupación'
}

// Función para validar el nombre
const validarNombre = (nombre) => {
  // Eliminar espacios al inicio y final
  nombre = nombre.trim()

  // Verificar que no esté vacío
  if (!nombre) {
    return 'El nombre no puede estar vacío'
  }

  // Verificar que tenga al menos 4 letras
  const soloLetras = nombre.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]/g, '')
  if (soloLetras.length < 4) {
    return 'El nombre debe tener al menos 4 letras'
  }

  // Verificar que no sean solo números o caracteres especiales
  const soloNumeros = /^[0-9]+$/.test(nombre.replace(/\s/g, ''))
  if (soloNumeros) {
    return 'El nombre no puede ser solo números'
  }

  // Verificar que tenga al menos una letra
  const tieneLetras = /[a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(nombre)
  if (!tieneLetras) {
    return 'El nombre debe contener al menos una letra'
  }

  return ''
}

// Función para validar la edad
const validarEdad = (edad) => {
  if (!edad) {
    return 'La edad no puede estar vacía'
  }

  const edadNum = Number(edad)
  if (isNaN(edadNum)) {
    return 'La edad debe ser un número válido'
  }

  if (edadNum < 1) {
    return 'La edad debe ser mayor a 0 años'
  }

  if (edadNum > 120) {
    return 'La edad no puede ser mayor a 120 años'
  }

  return ''
}

// Toggle menú
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// Cerrar menú al hacer click fuera
const handleClickOutside = (event) => {
  if (showMenu.value && !event.target.closest('.relative')) {
    showMenu.value = false
  }
}

// Abrir modal de edición
const openEditModal = () => {
  // Cargar datos actuales del usuario
  formData.value = {
    nombre: userStore.userData?.nombre || '',
    edad: userStore.userData?.edad || '',
    ocupacion: userStore.userData?.ocupacion || '',
  }
  // Limpiar errores
  errores.value = {
    nombre: '',
    edad: '',
  }
  showEditModal.value = true
  showMenu.value = false
}

// Cerrar modal de edición
const closeEditModal = () => {
  showEditModal.value = false
}

// Confirmar cambios con SweetAlert
const confirmarCambios = async () => {
  // Validar nombre
  const errorNombre = validarNombre(formData.value.nombre)
  errores.value.nombre = errorNombre

  // Validar edad
  const errorEdad = validarEdad(formData.value.edad)
  errores.value.edad = errorEdad

  // Si hay errores, no continuar
  if (errorNombre || errorEdad) {
    return
  }

  // Preguntar al usuario si desea realizar los cambios
  const result = await Swal.fire({
    title: '¿Guardar cambios?',
    text: 'Se actualizarán tus datos personales',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    width: '300px',
    padding: '1em',
    showClass: {
      popup: 'animate__animated animate__fadeInUp animate__faster',
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutDown animate__faster',
    },
  })

  if (result.isConfirmed) {
    // Actualizar datos del usuario usando setUserData
    const updatedData = {
      nombre: formData.value.nombre.trim(),
      edad: parseInt(formData.value.edad),
      ocupacion: formData.value.ocupacion,
    }

    // Si ya existe userData, actualizar sus propiedades
    if (userStore.userData.value) {
      userStore.userData.value.nombre = updatedData.nombre
      userStore.userData.value.edad = updatedData.edad
      userStore.userData.value.ocupacion = updatedData.ocupacion
    } else {
      // Si no existe, crearlo con setUserData
      userStore.setUserData(updatedData)
    }

    // Mostrar SweetAlert pequeño de éxito
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
    })

    await Toast.fire({
      icon: 'success',
      title: 'Datos actualizados',
    })

    closeEditModal()
  }
}

// Confirmar eliminación de datos
const confirmarEliminarDatos = async () => {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará todos tus datos. Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  })

  if (result.isConfirmed) {
    // Limpiar todos los datos del usuario
    userStore.userData.value = null
    userStore.registros.value = []

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    })

    await Toast.fire({
      icon: 'success',
      title: 'Datos eliminados',
    })

    showMenu.value = false
    // Recargar la página para resetear la vista
    window.location.reload()
  }
}

// Agregar event listener para cerrar menú
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
