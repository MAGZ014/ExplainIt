<template>
  <aside
    class="w-72 border border-gray-800 bg-gray-900/40 p-5 overflow-y-auto shrink-0 hidden xl:block"
  >
    <h3 class="text-gray-500 text-xs uppercase tracking-widest mb-4">
      Modo activo
    </h3>

    <!-- Solo muestra la card del modo seleccionado -->
    <div class="flex flex-col gap-3">
      <div
        class="border rounded-xl p-4 transition-all duration-200 border-cyan-500/40 bg-cyan-500/5"
      >
        <div class="flex items-center gap-3 mb-2">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 bg-cyan-500/15"
          >
            <v-icon
              :name="activeModeObj.icon"
              class="w-4 h-4 shrink-0 text-cyan-400"
            />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-200">
              {{ activeModeObj.label }}
            </p>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ activeModeObj.sublabel }}
            </p>
          </div>
        </div>

        <p class="text-xs text-gray-500 leading-relaxed mb-4">
          {{ activeModeObj.description }}
        </p>

        <!-- Indicador de modo activo -->
        <div class="flex items-center justify-between">
          <span class="text-xs text-cyan-400 font-medium"> ✓ Modo activo </span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { defineProps } from "vue";

const { activeModeObj } = defineProps({
  activeModeObj: { type: Object, required: true },
});
</script>
