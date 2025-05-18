<template>
  <section class="bg-gray-50">
    <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">Contáctanos</h2>
        <p class="mt-4 text-lg text-gray-500">
          Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ContactInfo />
        <ContactForm />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import ContactInfo from './ContactInfo.vue';
import ContactForm from './ContactForm.vue';
</script> 