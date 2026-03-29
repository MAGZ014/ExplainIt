<template>
  <aside
    class="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col shrink-0"
  >
    <!-- Logo -->
    <div class="px-5 py-6 border-b border-gray-800 flex items-center gap-3">
      <img
        :src="logo"
        alt="ExplainIt Logo"
        class="w-10 h-10 rounded-lg object-contain"
      />
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">
          Explain<span class="text-cyan-400">It</span>
        </h1>
        <p class="text-gray-500 text-xs mt-0.5">Error Decoder</p>
      </div>
    </div>

    <!-- Modos -->
    <div class="px-5 pt-5 pb-2">
      <span class="text-gray-500 text-xs uppercase tracking-widest">Modos</span>
    </div>

    <!-- Modos List -->
    <nav class="flex flex-col gap-1 px-3">
      <button
        v-for="mode in modes"
        :key="mode.name"
        @click="selectMode(mode.name)"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left group cursor-pointer"
        :class="
          selectedMode === mode.name
            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-transparent'
        "
      >
        <v-icon
          :name="mode.icon"
          class="w-4 h-4 shrink-0"
          :class="
            selectedMode === mode.name
              ? 'text-cyan-400'
              : 'text-gray-500 group-hover:text-gray-300'
          "
        />
        <span>{{ mode.label }}</span>
        <span
          v-if="selectedMode === mode.name"
          class="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
        ></span>
      </button>
    </nav>

    <!--  info -->
    <div class="mt-auto px-5 py-5 border-t border-gray-800">
      <div class="flex items-center gap-2 text-gray-600 text-xs">
        <v-icon name="bi-info-circle" class="w-3.5 h-3.5" />
        <span>Hackatón CubePath 2026 - MAGZ014</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
import logo from "@/assets/LogoBiGemini.png";

const { modes, selectedMode } = defineProps({
  modes: { type: Array, required: true },
  selectedMode: { type: String, required: true },
});
const emit = defineEmits(["update:selectedMode"]);

function selectMode(modeId) {
  emit("update:selectedMode", modeId);
}
</script>
