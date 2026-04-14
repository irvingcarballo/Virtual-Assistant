# Gestor de Agenda y Rutinas con Asistente IA

Sistema inteligente para la gestión de rutinas de ejercicio y actividades diarias, potenciado con un asistente de IA local que ofrece recomendaciones personalizadas basadas en tu perfil (edad, nombre y ocupación).

## Descripción General

El **Gestor de Agenda y Rutinas** es una aplicación web progresiva que permite a los usuarios organizar, gestionar y dar seguimiento a sus rutinas de ejercicio y actividades diarias. Lo que hace único a este sistema es su **asistente de IA local** (basado en Ollama) que analiza el perfil del usuario (nombre, edad y ocupación) para ofrecer recomendaciones personalizadas y consejos adaptados a su estilo de vida.

## Problema que Resuelve

### Problemáticas Identificadas:
1. **Falta de personalización**: Las aplicaciones de rutinas genéricas no consideran factores como la edad u ocupación del usuario.
2. **Desorganización**: Los usuarios suelen mezclar rutinas de ejercicio con actividades personales sin una herramienta unificada.
3. **Falta de seguimiento**: No hay un registro histórico de las rutinas realizadas ni estadísticas semanales.
4. **Barrera tecnológica**: Las soluciones existentes son complejas o requieren conocimientos técnicos avanzados.

### Nuestra Solución:
-  **IA Local** (Ollama): Todo el procesamiento de IA se realiza en tu máquina.
-  **Personalización inteligente**: El asistente IA analiza tu edad, ocupación y nombre para darte consejos relevantes.
-  **Gestión unificada**: Calendario, rutinas y actividades en un solo lugar.
-  **Seguimiento automático**: Registro de días entrenados y rutinas realizadas por semana.
-  **Interfaz intuitiva**: Diseñada con Vue y Tailwind CSS para máxima usabilidad.

## Características Principales

### 1. **Vista Principal (Main)**
- Calendario interactivo para visualizar tus rutinas por fecha
- Resumen semanal con horas disponibles
- Estadísticas de rutinas realizadas en la semana actual
- Acceso rápido a la creación de nuevas rutinas

### 2. **Gestión de Rutinas**
- Crear, editar y eliminar rutinas de ejercicio
- Cada rutina puede contener múltiples ejercicios
- Asignar rutinas a fechas específicas en el calendario
- Visualización detallada de cada rutina (series, repeticiones, duración)

### 3. **Sección de Actividades**
- Gestión de actividades diarias no relacionadas con ejercicio
- Organización por fecha y prioridad
- Seguimiento de actividades completadas/pendientes

### 4. **Asistente IA (Local)**
- Chat interactivo con IA que se ejecuta localmente (Ollama)
- Recomendaciones personalizadas basadas en:
  - **Nombre**: Trato personalizado y amigable
  - **Edad**: Adaptación de intensidad y tipo de ejercicios
  - **Ocupación**: Sugerencias según estilo de vida (estudiante, empleado, emprendedor, etc.)
- Sin necesidad de conexión a internet (una vez instalado Ollama)
- Privacidad garantizada: los datos nunca salen de tu computadora

### 5. **Perfil de Usuario**
- Registro de datos personales (nombre, edad, ocupación)
- Persistencia de datos con localStorage
- Opción de eliminar todos los datos del sistema

## Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|------------|
| **Vue.js 3** | ^3.3.0 | Framework progresivo para la interfaz de usuario |
| **Pinia** | ^2.1.0 | Manejo del estado global de la aplicación |
| **Vue Router** | ^4.2.0 | Enrutamiento y navegación entre vistas |
| **Tailwind CSS** | ^3.3.0 | Framework de CSS utilitario para diseño responsive |
| **Heroicons** | ^2.0.0 | Iconos SVG profesionales |

### IA y Procesamiento Local
| Tecnología | Propósito |
|------------|------------|
| **Ollama** | Servidor de IA local que ejecuta modelos como Llama 2, Mistral, etc. |
| **Modelo Recomendado** | `llama2` o `mistral` (7B parameters) |

### Persistencia y Almacenamiento
- **localStorage**: Almacenamiento local de datos del usuario y rutinas
- **API Fetch**: Comunicación con el servidor local de Ollama

### Herramientas de Desarrollo
- **Vite**: Bundler ultrarrápido para desarrollo
- **ESLint**: Linting de código JavaScript/Vue

