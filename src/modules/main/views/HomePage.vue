<template>
  <div class="min-h-screen bg-gray-100">
    <HeroSection />
    <AboutSection />
    <ContactSection />
  </div>
  <footer class="w-full py-6 mt-8 bg-indigo-600 flex flex-col items-center shadow-inner">
    <div class="flex space-x-2  align-middle justify-center">
      <span class="text-white font-semibold text-lg drop-shadow text-center">Trabajo de fin de curso de DAM, autor:
        Alejandro March Serrano 👌</span>
    </div>
  </footer>
</template>

<script setup lang="ts">
import HeroSection from '../components/home/HeroSection.vue';
import AboutSection from '../components/home/AboutSection.vue';
import ContactSection from '../components/home/ContactSection.vue';

localStorage.setItem('lastPath', '/home');
</script>

<style scoped>
.bg-image {
  background-image: url('/src/assets/foto-home.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>