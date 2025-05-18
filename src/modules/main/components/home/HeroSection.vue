<!-- eslint-disable vue/no-parsing-error -->
<template>
  <section class="bg-indigo-50 bg-image h-screen">
    <div class="flex flex-col items-center justify-start text-center pt-50">
      <h1 class="text-4xl font-extrabold sm:text-5xl md:text-6xl text-white"
        style="text-shadow: 2px 2px 6px rgba(0,0,0,0.6);">
        Peluquería Marta
      </h1>
      <p class="mt-4 text-xl max-w-3xl text-white" style="text-shadow: 2px 2px 6px rgba(0,0,0,0.6);">
        Tu peluquería de confianza, donde la belleza y el cuidado se encuentran
      </p>
      <div class="mt-6">
        <router-link to="/service"
          class="flex items-center px-8 py-3 font-medium rounded-md shadow-2xl text-amber-950 bg-amber-300 hover:bg-amber-200 md:py-4 md:text-lg md:px-10">
          Pedir cita &nbsp
          <SchedulerIcon />
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SchedulerIcon from '@/icons/SchedulerIcon.vue';
</script>

<style scoped>
.bg-image {
  background-image: url('/src/assets/foto-home.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>