<!-- views/AssistantView.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar Component -->
    <Navbar />

    <div class="container mx-auto px-4 py-8">
      <div class="flex gap-6">
        <!-- Panel izquierdo - Semana actual con actividades detalladas -->
        <div class="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <!-- Perfil del usuario -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
            <div class="flex items-center space-x-3">
              <div
                class="h-12 w-12 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-xl font-bold"
              >
                {{ userStore.userData?.nombre?.charAt(0) || 'U' }}
              </div>
              <div>
                <h3 class="font-semibold">{{ userStore.userData?.nombre || 'Usuario' }}</h3>
                <p class="text-xs opacity-90">
                  {{ userStore.userData?.edad || '?' }} años •
                  {{ userStore.userData?.ocupacion || 'Sin ocupación' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Semana actual con actividades detalladas -->
          <div class="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <h4 class="font-semibold text-gray-800 mb-3 sticky top-0 bg-white py-2">
              📅 Semana actual
            </h4>
            <div class="space-y-4">
              <div
                v-for="dia in semanaActual"
                :key="dia.fechaStr"
                :class="[
                  'rounded-lg transition overflow-hidden',
                  dia.esHoy
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-gray-50 border border-gray-100',
                ]"
              >
                <!-- Encabezado del día -->
                <div
                  class="flex items-center justify-between p-3 cursor-pointer"
                  @click="toggleDia(dia.fechaStr)"
                >
                  <div class="flex items-center space-x-3">
                    <span
                      class="text-sm font-semibold w-24"
                      :class="dia.esHoy ? 'text-blue-600' : 'text-gray-700'"
                    >
                      {{ dia.nombre }}
                    </span>
                    <span class="text-xs text-gray-500">{{ dia.dia }}/{{ dia.mes }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-400">{{ dia.expandido ? '▼' : '▶' }}</span>
                  </div>
                </div>

                <!-- Contenido expandido del día -->
                <div v-if="dia.expandido" class="px-3 pb-3 space-y-3 border-t border-gray-200 pt-2">
                  <!-- Rutinas del día -->
                  <div v-if="dia.rutinasDetalle.length > 0">
                    <p class="text-xs font-semibold text-gray-500 mb-1">📋 RUTINAS</p>
                    <div class="space-y-1">
                      <div
                        v-for="rutina in dia.rutinasDetalle"
                        :key="rutina.id"
                        class="text-xs p-1.5 rounded"
                        :class="
                          rutina.importancia === 'obligatoria'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-green-50 text-green-700'
                        "
                      >
                        <span class="font-medium">{{ rutina.nombre }}</span>
                        <span class="text-gray-500 ml-1"
                          >{{ rutina.horaInicio }}:00 - {{ rutina.horaFin }}:00</span
                        >
                      </div>
                    </div>
                  </div>

                  <!-- Actividades del día -->
                  <div v-if="dia.actividadesDetalle.length > 0">
                    <p class="text-xs font-semibold text-gray-500 mb-1">✨ ACTIVIDADES</p>
                    <div class="space-y-1">
                      <div
                        v-for="act in dia.actividadesDetalle"
                        :key="act.id"
                        class="text-xs p-1.5 rounded"
                        :class="
                          act.importante ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
                        "
                      >
                        <span class="font-medium">{{ act.nombre }}</span>
                        <span class="text-gray-500 ml-1">{{ formatearHorarioActividad(act) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Mensaje si no hay nada -->
                  <div
                    v-if="dia.rutinasDetalle.length === 0 && dia.actividadesDetalle.length === 0"
                    class="text-center py-2 text-gray-400 text-xs"
                  >
                    ✨ Sin actividades programadas
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel derecho - Chat (67% ancho) -->
        <div
          class="w-2/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-120px)]"
        >
          <!-- Header del chat -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-t-xl">
            <div class="flex items-center space-x-3">
              <div
                class="h-10 w-10 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-xl"
              >
                🤖
              </div>
              <div>
                <h3 class="font-semibold text-white">Asistente Virtual</h3>
                <p class="text-xs text-blue-100">Siempre aquí para ayudarte</p>
              </div>
            </div>
          </div>

          <!-- Mensajes del chat -->
          <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
            <div
              v-for="(msg, idx) in mensajes"
              :key="idx"
              class="flex"
              :class="msg.rol === 'usuario' ? 'justify-end' : 'justify-start'"
            >
              <div
                :class="[
                  'max-w-[80%] rounded-lg p-3',
                  msg.rol === 'usuario' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800',
                ]"
              >
                <p class="text-sm whitespace-pre-wrap">{{ msg.texto }}</p>
                <p class="text-xs mt-1 opacity-70">{{ msg.hora }}</p>
              </div>
            </div>

            <!-- Indicador de escritura -->
            <div v-if="estaEscribiendo" class="flex justify-start">
              <div class="bg-gray-100 rounded-lg p-3">
                <div class="flex space-x-1">
                  <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span
                    class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style="animation-delay: 0.1s"
                  ></span>
                  <span
                    class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style="animation-delay: 0.2s"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Opciones rápidas -->
          <div class="border-t border-gray-200 p-4">
            <div class="flex flex-wrap gap-2 mb-3">
              <button
                v-for="opcion in opcionesRapidas"
                :key="opcion"
                @click="enviarMensaje(opcion)"
                :disabled="estaEscribiendo"
                class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ opcion }}
              </button>
            </div>

            <!-- Input del chat -->
            <div class="flex space-x-2">
              <input
                v-model="mensajeInput"
                @keypress.enter="enviarMensaje()"
                :disabled="estaEscribiendo"
                type="text"
                placeholder="Escribe tu mensaje..."
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                @click="enviarMensaje()"
                :disabled="estaEscribiendo"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useDataUserStore } from '@/stores/DataUser'
import { useRoutinesStore } from '@/stores/Routines'
import { useActivitiesStore } from '@/stores/Activities'
import Navbar from '@/components/Navbar.vue'

const router = useRouter()
const userStore = useDataUserStore()
const routinesStore = useRoutinesStore()
const activitiesStore = useActivitiesStore()

// Estado del chat
const mensajes = ref([])
const mensajeInput = ref('')
const estaEscribiendo = ref(false)
const chatContainer = ref(null)
const diasExpandidos = ref(new Set())

// Persistencia de conversación
const STORAGE_KEY = 'assistant_chat_history'

// Guardar conversación en localStorage
const guardarConversacion = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mensajes.value))
}

// Cargar conversación guardada
const cargarConversacion = () => {
  const guardado = localStorage.getItem(STORAGE_KEY)
  if (guardado) {
    try {
      const historial = JSON.parse(guardado)
      if (historial.length > 0) {
        mensajes.value = historial
        return true
      }
    } catch (e) {
      console.error('Error al cargar conversación:', e)
    }
  }
  return false
}

// Mapeo de días
const diaSemanaMap = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
}

// Formatear horario
const formatearHorarioActividad = (actividad) => {
  if (actividad.tipoHorario === 'puntual') {
    return `${actividad.horaInicio?.toString().padStart(2, '0') || '?'}:00`
  } else {
    return `${actividad.horaInicio?.toString().padStart(2, '0') || '?'}:00 - ${actividad.horaFin?.toString().padStart(2, '0') || '?'}:00`
  }
}

// Obtener rutinas para un día específico con detalles
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

// Semana actual con actividades detalladas
const semanaActual = computed(() => {
  const hoy = new Date()
  const diaSemanaHoy = hoy.getDay()
  const inicioSemana = new Date(hoy)
  inicioSemana.setDate(hoy.getDate() - diaSemanaHoy)

  const semana = []

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(inicioSemana)
    fecha.setDate(inicioSemana.getDate() + i)
    const fechaStr = fecha.toISOString().split('T')[0]
    const esHoy = fecha.toDateString() === hoy.toDateString()

    const rutinasDelDia = obtenerRutinasDelDia(fecha)
    const actividadesDelDia = activitiesStore.getActivitiesForDate(fechaStr)

    semana.push({
      nombre: diaSemanaMap[fecha.getDay()],
      fecha: fecha,
      fechaStr: fechaStr,
      dia: fecha.getDate(),
      mes: fecha.getMonth() + 1,
      esHoy: esHoy,
      totalRutinas: rutinasDelDia.length,
      totalActividades: actividadesDelDia.length,
      rutinasDetalle: rutinasDelDia,
      actividadesDetalle: actividadesDelDia,
      expandido: diasExpandidos.value.has(fechaStr) || esHoy,
    })
  }

  return semana
})

// Toggle día expandido
const toggleDia = (fechaStr) => {
  if (diasExpandidos.value.has(fechaStr)) {
    diasExpandidos.value.delete(fechaStr)
  } else {
    diasExpandidos.value.add(fechaStr)
  }
}

// Rutinas y actividades de hoy
const hoy = new Date()
const diaActualNombre = computed(() => diaSemanaMap[hoy.getDay()])
const rutinasHoy = computed(() => obtenerRutinasDelDia(hoy))
const actividadesHoy = computed(() =>
  activitiesStore.getActivitiesForDate(hoy.toISOString().split('T')[0]),
)

// Opciones rápidas
const opcionesRapidas = computed(() => {
  const tieneRutinas = routinesStore.routines?.length > 0
  const tieneActividades = activitiesStore.activities?.length > 0

  const opciones = [
    '¿Cómo va mi semana?',
    '¿Qué rutinas tengo hoy?',
    '¿Qué actividades tengo pendientes?',
    'Quiero organizar mejor mi agenda',
    'Quiero acomodar una actividad pero no sé dónde',
  ]

  return opciones
})

// Scroll al último mensaje
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Agregar mensaje
const agregarMensaje = (rol, texto) => {
  const ahora = new Date()
  const hora = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`

  mensajes.value.push({
    rol: rol,
    texto: texto,
    hora: hora,
    timestamp: Date.now(),
  })
  scrollToBottom()
  guardarConversacion()
}

// Construir contexto del usuario para la IA
const construirContexto = () => {
  const usuario = userStore.userData

  const rutinasTexto = routinesStore.routines
    .map((r) => {
      const dias = r.diasSeleccionados?.join(', ') || 'ninguno'
      const horarios = Object.entries(r.horariosPorDia || {})
        .map(([dia, horario]) => `${dia}: ${horario.inicio}:00-${horario.fin}:00`)
        .join(', ')
      return `- ${r.nombre} (${r.importancia === 'obligatoria' ? 'OBLIGATORIA' : 'pasiva'}): ${dias} - ${horarios}`
    })
    .join('\n')

  const actividadesTexto = activitiesStore.activities
    .slice(0, 30)
    .map((a) => {
      const fecha = new Date(a.fecha)
      const fechaStr = `${fecha.getDate()}/${fecha.getMonth() + 1}`
      return `- ${a.nombre} (${fechaStr}): ${formatearHorarioActividad(a)} ${a.importante ? '🔴 IMPORTANTE' : ''}`
    })
    .join('\n')

  return {
    nombre: usuario?.nombre || 'Usuario',
    edad: usuario?.edad || 'No especificada',
    ocupacion: usuario?.ocupacion || 'No especificada',
    totalRutinas: routinesStore.routines.length,
    totalActividades: activitiesStore.activities.length,
    horasDisponibles: routinesStore.horasDisponiblesSemanales || 168,
    horasUsadas: routinesStore.totalHorasUsadas || 0,
    rutinas: rutinasTexto || 'Ninguna rutina registrada',
    actividades: actividadesTexto || 'Ninguna actividad registrada',
    diaActual: diaActualNombre.value,
    rutinasHoy:
      rutinasHoy.value.map((r) => `${r.nombre} (${r.horaInicio}:00-${r.horaFin}:00)`).join(', ') ||
      'Ninguna',
    actividadesHoy:
      actividadesHoy.value.map((a) => `${a.nombre} (${formatearHorarioActividad(a)})`).join(', ') ||
      'Ninguna',
  }
}

// Responder con Ollama (IA local)
const responderConOllama = async (mensajeUsuario) => {
  const contexto = construirContexto()

  const prompt = `Eres un asistente virtual personal experto en organización y productividad llamado "Asistente Virtual".

INFORMACIÓN ACTUAL DEL USUARIO:
- Nombre: ${contexto.nombre}
- Edad: ${contexto.edad} años
- Ocupación: ${contexto.ocupacion}
- Día actual: ${contexto.diaActual}
- Rutinas programadas hoy: ${contexto.rutinasHoy}
- Actividades programadas hoy: ${contexto.actividadesHoy}

ESTADÍSTICAS GENERALES:
- Total de rutinas registradas: ${contexto.totalRutinas}
- Total de actividades registradas: ${contexto.totalActividades}
- Horas disponibles a la semana: ${contexto.horasDisponibles}h
- Horas usadas en rutinas: ${contexto.horasUsadas}h

RUTINAS REGISTRADAS:
${contexto.rutinas}

ACTIVIDADES REGISTRADAS:
${contexto.actividades}

PREGUNTA DEL USUARIO: "${mensajeUsuario}"

INSTRUCCIONES IMPORTANTES:
1. Responde de manera amable, empática y profesional
2. Usa el nombre del usuario para personalizar la respuesta
3. Da consejos prácticos basados en SUS datos reales de rutinas y actividades
4. Si menciona una rutina o actividad específica, analiza su horario e importancia
5. Sé conciso (máximo 3-4 párrafos)
6. Usa emojis ocasionalmente para ser más amigable
7. Si no hay datos, sugiere crear rutinas o actividades

RESPUESTA:`

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 600,
        },
      }),
    })

    if (!response.ok) return null
    const data = await response.json()
    return data.response
  } catch (error) {
    console.error('Error con Ollama:', error)
    return null
  }
}

// Respuesta simulada (fallback)
const responderSimulado = async (mensaje) => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const tieneRutinas = routinesStore.routines?.length > 0
  const tieneActividades = activitiesStore.activities?.length > 0
  const usuario = userStore.userData
  const mensajeLower = mensaje.toLowerCase()

  if (!tieneRutinas && !tieneActividades) {
    agregarMensaje(
      'bot',
      `Hola ${usuario?.nombre || 'usuario'}! 👋\n\nVeo que aún no tienes ninguna rutina o actividad registrada. Para poder ayudarte mejor, primero necesitas crear algunas.\n\n¿Te gustaría crear una rutina o una actividad?`,
    )
    setTimeout(() => {
      agregarMensaje(
        'bot',
        '🔘 **Opciones:**\n- [Crear Rutina](/routines)\n- [Crear Actividad](/activities)',
      )
    }, 500)
    return
  }

  if (mensajeLower.includes('cómo va mi semana') || mensajeLower.includes('semana')) {
    const diasConActividades = semanaActual.value.filter(
      (d) => d.totalRutinas > 0 || d.totalActividades > 0,
    ).length
    let respuesta = `📊 **Resumen de tu semana ${usuario?.nombre}:**\n\n`
    respuesta += `• ${diasConActividades}/7 días tienen actividades programadas\n`
    respuesta += `• Total de rutinas: ${routinesStore.routines.length}\n`
    respuesta += `• Total de actividades: ${activitiesStore.activities.length}\n`
    respuesta += `• Horas disponibles semanales: ${routinesStore.horasDisponiblesSemanales}h\n\n`

    if (rutinasHoy.value.length > 0 || actividadesHoy.value.length > 0) {
      respuesta += `📅 **Para hoy:**\n`
      if (rutinasHoy.value.length > 0)
        respuesta += `• ${rutinasHoy.value.length} rutinas pendientes\n`
      if (actividadesHoy.value.length > 0)
        respuesta += `• ${actividadesHoy.value.length} actividades pendientes\n`
    }

    agregarMensaje('bot', respuesta)
  } else if (
    mensajeLower.includes('qué rutinas tengo hoy') ||
    mensajeLower.includes('rutinas hoy')
  ) {
    if (rutinasHoy.value.length === 0) {
      agregarMensaje(
        'bot',
        `📋 Hoy no tienes rutinas programadas, ${usuario?.nombre}. ¡Aprovecha para descansar! 🎉`,
      )
    } else {
      let respuesta = `📋 **Rutinas para hoy (${diaActualNombre.value}):**\n\n`
      rutinasHoy.value.forEach((r) => {
        const tipo = r.importancia === 'obligatoria' ? '⚡ Obligatoria' : '🌿 Pasiva'
        respuesta += `• **${r.nombre}** - ${tipo}\n  🕐 ${r.horaInicio}:00 a ${r.horaFin}:00\n`
      })
      agregarMensaje('bot', respuesta)
    }
  } else if (
    mensajeLower.includes('qué actividades tengo pendientes') ||
    mensajeLower.includes('actividades pendientes')
  ) {
    const actividadesFuturas = activitiesStore.activities.filter(
      (a) => a.fecha >= hoy.toISOString().split('T')[0],
    )
    if (actividadesFuturas.length === 0) {
      agregarMensaje(
        'bot',
        `✨ No tienes actividades pendientes próximas, ${usuario?.nombre}. ¡Qué bien!`,
      )
    } else {
      let respuesta = `✨ **Actividades pendientes:**\n\n`
      const agrupadas = {}
      actividadesFuturas.forEach((a) => {
        if (!agrupadas[a.fecha]) agrupadas[a.fecha] = []
        agrupadas[a.fecha].push(a)
      })
      Object.keys(agrupadas)
        .slice(0, 5)
        .forEach((fecha) => {
          const fechaObj = new Date(fecha)
          respuesta += `📅 **${diaSemanaMap[fechaObj.getDay()]} ${fechaObj.getDate()}/${fechaObj.getMonth() + 1}:**\n`
          agrupadas[fecha].forEach(
            (a) => (respuesta += `   • ${a.nombre} - ${formatearHorarioActividad(a)}\n`),
          )
          respuesta += `\n`
        })
      agregarMensaje('bot', respuesta)
    }
  } else if (mensajeLower.includes('organizar mejor mi agenda')) {
    const diasLibres = semanaActual.value.filter(
      (d) => d.totalRutinas === 0 && d.totalActividades === 0,
    )
    let respuesta = `📅 **Consejos para organizar tu agenda, ${usuario?.nombre}:**\n\n`
    if (diasLibres.length > 0)
      respuesta += `✅ Tienes ${diasLibres.length} días libres esta semana:\n${diasLibres.map((d) => `   • ${d.nombre} ${d.dia}/${d.mes}\n`).join('')}\n💡 Aprovecha esos días para descansar o agregar actividades.\n\n`
    respuesta += `🎯 **Recomendaciones:**\n• Distribuye actividades en diferentes horarios\n• Prioriza rutinas obligatorias por la mañana\n• Marca como IMPORTANTES las que no puedan moverse`
    agregarMensaje('bot', respuesta)
  } else if (
    mensajeLower.includes('acomodar una actividad') ||
    mensajeLower.includes('no sé dónde')
  ) {
    const diasConEspacio = semanaActual.value.filter(
      (d) => d.rutinasDetalle.length + d.actividadesDetalle.length < 3 && !d.esHoy,
    )
    if (diasConEspacio.length === 0) {
      agregarMensaje(
        'bot',
        `😅 Tu semana está bastante ocupada, ${usuario?.nombre}. Revisa si puedes mover alguna actividad.`,
      )
    } else {
      let respuesta = `📅 **Te sugiero estos días con espacio disponible:**\n\n`
      diasConEspacio
        .slice(0, 3)
        .forEach(
          (d) =>
            (respuesta += `• **${d.nombre} ${d.dia}/${d.mes}** - ${d.rutinasDetalle.length + d.actividadesDetalle.length} actividades actualmente\n`),
        )
      respuesta += `\n💡 Los horarios de tarde (15:00-18:00) son ideales para nuevas actividades.`
      agregarMensaje('bot', respuesta)
    }
  } else {
    agregarMensaje(
      'bot',
      `Hola ${usuario?.nombre}! 👋\n\n¿En qué puedo ayudarte hoy?\n\nPuedes preguntarme:\n• ¿Cómo va mi semana?\n• ¿Qué rutinas tengo hoy?\n• ¿Qué actividades tengo pendientes?\n• Quiero organizar mejor mi agenda\n• Quiero acomodar una actividad pero no sé dónde`,
    )
  }
}

// Responder como bot
const responderComoBot = async (mensaje) => {
  estaEscribiendo.value = true

  try {
    const respuestaIA = await responderConOllama(mensaje)
    if (respuestaIA) {
      agregarMensaje('bot', respuestaIA)
    } else {
      await responderSimulado(mensaje)
    }
  } catch (error) {
    console.error('Error:', error)
    await responderSimulado(mensaje)
  }

  estaEscribiendo.value = false
}

// Enviar mensaje
const enviarMensaje = async (textoPersonalizado = null) => {
  if (estaEscribiendo.value) return

  const texto = textoPersonalizado || mensajeInput.value.trim()
  if (!texto) return

  agregarMensaje('usuario', texto)
  mensajeInput.value = ''
  await responderComoBot(texto)
}

// Mensaje de bienvenida (solo si no hay conversación guardada)
const mensajeBienvenida = () => {
  const tieneDatos = routinesStore.routines?.length > 0 || activitiesStore.activities?.length > 0
  const usuario = userStore.userData

  let bienvenida = `¡Hola ${usuario?.nombre || 'usuario'}! 👋\n\nSoy tu asistente virtual personal. `

  if (!tieneDatos) {
    bienvenida += `Veo que aún no tienes ninguna rutina o actividad registrada. ¡Comencemos creando algunas!\n\nPuedes crear rutinas en la sección de Rutinas y actividades en la sección de Actividades.`
    agregarMensaje('bot', bienvenida)
    setTimeout(() => {
      agregarMensaje(
        'bot',
        '🔘 **Para comenzar:**\n- [Crear Rutina](/routines)\n- [Crear Actividad](/activities)',
      )
    }, 800)
  } else {
    bienvenida += `Estoy aquí para ayudarte a organizar tu semana. ¿Qué te gustaría saber hoy?`
    agregarMensaje('bot', bienvenida)
    setTimeout(() => {
      agregarMensaje(
        'bot',
        '💡 Puedes preguntarme:\n• ¿Cómo va mi semana?\n• ¿Qué rutinas tengo hoy?\n• ¿Qué actividades tengo pendientes?\n• Quiero organizar mejor mi agenda',
      )
    }, 500)
  }
}

// Inicializar
onMounted(async () => {
  if (!userStore.userData) {
    router.push('/')
    return
  }

  routinesStore.loadFromLocalStorage()
  activitiesStore.loadFromLocalStorage()

  // Cargar conversación guardada
  const tieneHistorial = cargarConversacion()

  if (!tieneHistorial || mensajes.value.length === 0) {
    mensajeBienvenida()
  } else {
    scrollToBottom()
  }
})

// Guardar conversación antes de cerrar
onBeforeUnmount(() => {
  guardarConversacion()
})
</script>

<style scoped>
.animate-bounce {
  animation: bounce 1.4s infinite;
}

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
}

:deep(a) {
  color: #3b82f6;
  text-decoration: underline;
  cursor: pointer;
}

:deep(a:hover) {
  color: #2563eb;
}
</style>
