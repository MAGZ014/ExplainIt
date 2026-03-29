<template>
  <Transition name="splash-exit">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-gray-950 flex items-center justify-center overflow-hidden"
    >
      <!-- Ambient glow background -->
      <div class="absolute inset-0 pointer-events-none">
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl"
        />
        <div
          class="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-cyan-400/3 blur-2xl"
        />
      </div>

      <!-- Grid overlay -->
      <div
        class="absolute inset-0 opacity-[0.03]"
        style="
          background-image:
            linear-gradient(#06b6d4 1px, transparent 1px),
            linear-gradient(90deg, #06b6d4 1px, transparent 1px);
          background-size: 40px 40px;
        "
      />

      <!-- Main content -->
      <div
        class="relative flex flex-col items-center gap-8 w-full max-w-lg px-8"
      >
        <!-- Terminal window -->
        <div
          class="w-full bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 backdrop-blur-sm"
        >
          <!-- Window chrome -->
          <div
            class="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-900"
          >
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div class="w-3 h-3 rounded-full bg-green-500/70"></div>
            </div>
            <span class="mx-auto text-gray-600 text-xs font-mono"
              >explainit — terminal</span
            >
          </div>

          <!-- Terminal body -->
          <div class="p-5 font-mono text-xs space-y-1 min-h-[200px]">
            <div
              v-for="(line, i) in visibleLines"
              :key="i"
              class="leading-relaxed transition-all duration-300"
              :class="line.class"
            >
              <span v-if="line.prefix" class="text-gray-600">{{
                line.prefix
              }}</span>
              <span>{{ line.text }}</span>
              <span
                v-if="line.tag"
                class="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold"
                :class="line.tagClass"
                >{{ line.tag }}</span
              >
            </div>

            <!-- Blinking cursor at end -->
            <div
              v-if="showCursor && !resolving"
              class="flex items-center gap-1"
            >
              <span class="text-gray-600">❯ </span>
              <span
                class="w-2 h-4 bg-cyan-400 animate-[blink_1s_step-end_infinite] inline-block align-middle"
              ></span>
            </div>

            <!-- Resolving animation -->
            <div v-if="resolving" class="mt-3 space-y-1">
              <div class="text-cyan-400 flex items-center gap-2">
                <span
                  class="inline-block w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"
                ></span>
                <span>{{ resolveText }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Logo + title reveal -->
        <div
          class="flex flex-col items-center gap-3 transition-all duration-700"
          :class="
            showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          "
        >
          <div class="relative">
            <div
              class="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-xl animate-pulse"
            ></div>
            <div
              class="relative w-14 h-14 rounded-2xl bg-gray-900 border border-cyan-500/30 flex items-center justify-center"
            >
              <img :src="logo" alt="ExplainIt" class="w-9 h-9 object-contain" />
            </div>
          </div>
          <div class="text-center">
            <h1 class="text-2xl font-bold text-white tracking-tight">
              Explain<span class="text-cyan-400">It</span>
            </h1>
            <p class="text-gray-500 text-xs mt-1 tracking-widest uppercase">
              Convierte errores en claridad
            </p>
          </div>

          <span class="text-gray-600 text-[10px] tracking-widest">{{
            progress < 100 ? "Iniciando..." : "Listo ✓"
          }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from "vue";
import logo from "@/assets/LogoBiGemini.png";

const emit = defineEmits(["done"]);

const visible = ref(true);
const visibleLines = ref([]);
const showCursor = ref(false);
const resolving = ref(false);
const resolveText = ref("Analizando dependencias...");
const showLogo = ref(false);
const progress = ref(0);

const terminalLines = [
  {
    text: "TypeError: Cannot read properties of undefined",
    class: "text-red-400",
    prefix: "✗ ",
    tag: "ERROR",
    tagClass: "bg-red-500/20 text-red-400",
  },
  {
    text: "    at App.vue:42 (reading 'map')",
    class: "text-gray-500",
    prefix: "  ",
  },
  {
    text: "    at renderComponentRoot: runtime-core.js:939",
    class: "text-gray-600",
    prefix: "  ",
  },
  {
    text: "    at ReactiveEffect.run: reactivity.js:167",
    class: "text-gray-600",
    prefix: "  ",
  },
  { text: "", class: "", prefix: "" },
  {
    text: "▸ ExplainIt detectó 1 error crítico",
    class: "text-yellow-400",
    prefix: "⚡ ",
  },
  {
    text: "▸ Cargando motor de análisis...",
    class: "text-cyan-500",
    prefix: "→ ",
  },
  { text: "▸ Modos disponibles: 5", class: "text-cyan-400", prefix: "→ " },
  {
    text: "▸ Error resuelto",
    class: "text-green-400",
    prefix: "✓ ",
    tag: "OK",
    tagClass: "bg-green-500/20 text-green-400",
  },
];

const resolveTexts = [
  "Analizando stack trace...",
  "Identificando causa raíz...",
  "Cargando explicaciones...",
  "Preparando interfaz...",
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

onMounted(async () => {
  await delay(300);

  for (let i = 0; i < terminalLines.length; i++) {
    visibleLines.value.push(terminalLines[i]);
    await delay(i < 4 ? 120 : 200);
  }

  showCursor.value = true;
  await delay(400);
  showCursor.value = false;

  resolving.value = true;
  showLogo.value = true;

  for (let i = 0; i < resolveTexts.length; i++) {
    resolveText.value = resolveTexts[i];
    await delay(200);
    progress.value = ((i + 1) / resolveTexts.length) * 100;
  }

  await delay(500);
  resolving.value = false;
  progress.value = 100;

  await delay(700);

  visible.value = false;
  emit("done");
});
</script>

<style scoped>
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.splash-exit-leave-active {
  transition:
    opacity 0.6s ease,
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.splash-exit-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.splash-exit-leave-to {
  opacity: 0;
  transform: translateY(-24px) scale(0.98);
}
</style>
