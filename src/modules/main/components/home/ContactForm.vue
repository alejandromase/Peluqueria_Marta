<template>
  <div class="bg-white p-8 rounded-lg shadow-lg">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">
          Nombre
        </label>
        <input id="name" v-model="formData.name" type="text" required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input id="email" v-model="formData.email" type="email" required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>

      <div>
        <label for="subject" class="block text-sm font-medium text-gray-700">
          Asunto
        </label>
        <input id="subject" v-model="formData.subject" type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
      </div>

      <div>
        <label for="message" class="block text-sm font-medium text-gray-700">
          Mensaje
        </label>
        <textarea id="message" v-model="formData.message" rows="4" required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
      </div>

      <div>
        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
                 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Enviar mensaje
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

// Estado para almacenar los datos del formulario
const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

/**
 * Función para manejar el envío del formulario.
 * Crea un enlace mailto con los datos del formulario y lo abre en el cliente de correo.
 */
function handleSubmit() {
  const to = 'peluqueria.marta.94@protonmail.com'
  // encodeSubject and encodeBody usan %20 y %0A, no "+"
  const encodeSubject = encodeURIComponent(formData.subject || 'Contacto desde web')
  const bodyRaw =
    `Nombre: ${formData.name}\n` +
    `Email: ${formData.email}\n\n` +
    formData.message
  const encodeBody = encodeURIComponent(bodyRaw)

  // Abre el cliente de correo con los parámetros correctamente codificados
  window.location.href = `mailto:${to}?subject=${encodeSubject}&body=${encodeBody}`
}
</script>
