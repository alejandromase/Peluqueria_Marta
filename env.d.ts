/// <reference types="vite/client" />

// Esto le dice a TS (y a Typedoc) cómo importar .vue
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // props como objeto, setup returns unknown
  const component: DefineComponent<Record<string, unknown>, unknown, unknown>
  export default component
}