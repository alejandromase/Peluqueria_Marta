<template>
  <div class="bg-white p-8 rounded-lg shadow-lg">
    <h3 class="text-xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
    
    <div class="space-y-6">
      <ContactItem
        icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        title="Dirección"
        :lines="['Calle de la Mare Vella, 17', '46020 Valencia, España']"
      />

      <ContactItem
        icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        title="Teléfono"
        :lines="['+34 963 123 456', 'Martes a Sábado: 9:00 - 20:00']"
      />

      <ContactItem
        icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        title="Email"
        :lines="['peluqueria.marta.94@protonmail.com']"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactItem from './ContactItem.vue';
</script> 