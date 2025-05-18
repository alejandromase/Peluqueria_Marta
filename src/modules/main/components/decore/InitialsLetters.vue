<template>
  <div v-if="fullName" class="rounded-full bg-indigo-100 flex items-center justify-center">
    <span class="font-bold text-indigo-800">{{ getInitials(fullName) }} </span>
  </div>
  <div v-else class="rounded-full flex items-center justify-center">
    <UserIcon class="w-6 h-6" />
  </div>
</template>

<script setup lang="ts">
import UserIcon from '@/icons/UserIcon.vue';

interface Props {
  fullName?: string;
}

defineProps<Props>();

/**
 * Función para obtener las iniciales del nombre.
 * @param name Nombre completo.
 * @returns Iniciales del nombre (máximo 2 caracteres).
 */
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
</script>
