<template>
  <div class="flex items-start">
    <div class="flex-shrink-0">
      <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
      </svg>
    </div>
    <div class="ml-3">
      <h4 class="text-lg font-medium text-gray-900">{{ title }}</h4>
      <p class="mt-1 text-gray-500">
        <template v-for="(line, index) in lines" :key="index">
          {{ line }}<br v-if="index < lines.length - 1" />
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  lines: string[];
}>();
</script> 