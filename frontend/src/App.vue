<template>
  <div class="h-screen bg-gray-950 overflow-hidden">
    <!-- Splash Screen -->
    <SplashScreen v-if="!appReady || splashVisible" @done="onSplashDone" />

    <!-- App shell -->
    <div
      v-if="appReady"
      class="h-full flex font-mono text-gray-100"
      :class="appReady ? 'app-ready' : 'opacity-0'"
    >
      <!-- SIDEBAR -->
      <div class="app-item" style="--delay: 0ms">
        <SidebarApp
          :modes="modes"
          :selectedMode="selectedMode"
          @update:selectedMode="onModeChange"
        />
      </div>

      <!-- MAIN -->
      <main
        class="flex-1 flex flex-col overflow-hidden app-item"
        style="--delay: 80ms"
      >
        <TopBarApp ref="topBarRef" :activeModeObj="activeModeObj" />

        <div class="flex flex-1 overflow-hidden">
          <section class="flex-1 flex flex-col overflow-hidden">
            <div class="shrink-0 px-6 pt-6 pb-4">
              <div
                class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 app-item"
                style="--delay: 160ms"
                :class="
                  isFocused
                    ? 'border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                    : ''
                "
              >
                <div
                  class="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50"
                >
                  <div class="flex items-center gap-2 text-gray-500 text-xs">
                    <v-icon name="bi-code-slash" class="w-3.5 h-3.5" />
                    <span>Pega tu error, código o log</span>
                  </div>
                  <button
                    @click="loadExample"
                    class="text-xs text-cyan-500 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <v-icon name="bi-lightning-fill" class="w-3 h-3" />
                    Ejemplo rápido
                  </button>
                </div>

                <div class="relative">
                  <textarea
                    v-model="inputText"
                    @focus="isFocused = true"
                    @blur="isFocused = false"
                    rows="7"
                    placeholder="TypeError: Cannot read properties of undefined (reading 'map')&#10;    at App.vue:42:18&#10;    at ..."
                    class="w-full bg-transparent text-gray-200 text-sm px-4 py-4 resize-none outline-none placeholder-gray-700 leading-relaxed font-mono custom-scroll"
                  ></textarea>
                  <div class="absolute bottom-4 right-4">
                    <button
                      @click="analyzeError"
                      :disabled="!inputText.trim() || isLoading"
                      class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      :class="
                        inputText.trim() && !isLoading
                          ? 'bg-cyan-500 text-gray-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
                          : 'bg-gray-800 text-gray-500'
                      "
                    >
                      <v-icon
                        v-if="!isLoading"
                        name="bi-send-fill"
                        class="w-3.5 h-3.5"
                      />
                      <v-icon
                        v-else
                        name="bi-arrow-repeat"
                        class="w-3.5 h-3.5 animate-spin"
                      />
                      <span>{{
                        isLoading ? "Analizando..." : "Analizar"
                      }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex-1 overflow-y-auto px-6 flex flex-col gap-4 custom-scroll"
            >
              <!-- Error banner -->
              <Transition name="slide-up">
                <div
                  v-if="errorMsg"
                  class="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400"
                >
                  <v-icon
                    name="bi-exclamation-triangle"
                    class="w-4 h-4 mt-0.5 shrink-0"
                  />
                  <span>{{ errorMsg }}</span>
                </div>
              </Transition>

              <!-- Loading Skeleton -->
              <div
                v-if="isLoading"
                class="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 animate-pulse"
              >
                <div class="flex items-center gap-3">
                  <div class="w-5 h-5 rounded bg-cyan-500/20"></div>
                  <div class="h-4 w-40 rounded bg-gray-800"></div>
                </div>
                <div class="space-y-2">
                  <div class="h-3 rounded bg-gray-800 w-full"></div>
                  <div class="h-3 rounded bg-gray-800 w-5/6"></div>
                  <div class="h-3 rounded bg-gray-800 w-4/6"></div>
                </div>
                <div class="h-3 rounded bg-gray-800 w-full"></div>
                <div class="h-3 rounded bg-gray-800 w-3/4"></div>
                <div class="h-3 rounded bg-gray-800 w-2/3"></div>
              </div>

              <!-- Response Card -->
              <ResponseCard
                v-if="!isLoading"
                :response="response"
                :provider="aiProvider"
                :model="aiModel"
                @regenerate="analyzeError"
              />

              <!-- Empty state -->
              <div
                v-if="!response && !isLoading && !errorMsg"
                class="flex flex-col items-center justify-center py-16 text-center app-item"
                style="--delay: 240ms"
              >
                <div
                  class="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4"
                >
                  <v-icon name="bi-terminal" class="w-7 h-7 text-gray-700" />
                </div>
                <p class="text-gray-600 text-sm">
                  Pega un error arriba y presiona
                  <span class="text-cyan-600">Analizar</span>
                </p>
              </div>
            </div>
            <br />
          </section>

          <!-- Right Panel -->
          <div>
            <BotCards :activeModeObj="activeModeObj" />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import SplashScreen from "./components/SplashScreen.vue";
import SidebarApp from "./components/SidebarApp.vue";
import BotCards from "./components/BotCards.vue";
import TopBarApp from "./components/TopBarApp.vue";
import ResponseCard from "./components/ResponseCard.vue";
import { getModes } from "./services/mode.js";
import { explainError } from "./services/explain.js";
import { incrementCounter } from "./services/message.js";
import { ERROR_EXAMPLES } from "./data/errorExamples.js";

// ─── Splash ───────────────────────────────────────────────────────────────
const splashVisible = ref(true);
const appReady = ref(false);
function onSplashDone() {
  splashVisible.value = false;
  appReady.value = true;
}

// ─── State ────────────────────────────────────────────────────────────────
const modes = ref([]);
const inputText = ref("");
const response = ref("");
const aiProvider = ref("");
const aiModel = ref("");
const isLoading = ref(false);
const isFocused = ref(false);
const errorMsg = ref("");
const selectedMode = ref("profesor");
const topBarRef = ref(null);

// ─── Modes ────────────────────────────────────────────────────────────────
const getAllModes = async () => {
  try {
    modes.value = await getModes();
  } catch (error) {
    console.error("Error al cargar los modos:", error.message);
  }
};

const activeModeObj = computed(
  () =>
    modes.value.find((m) => m.name === selectedMode.value) || modes.value[0],
);

// Limpiar respuesta al cambiar de modo
function onModeChange(newMode) {
  selectedMode.value = newMode;
  response.value = "";
  aiProvider.value = "";
  aiModel.value = "";
  errorMsg.value = "";
}

// ─── Analyze ──────────────────────────────────────────────────────────────
async function analyzeError() {
  if (!inputText.value.trim() || isLoading.value) return;

  isLoading.value = true;
  response.value = "";
  aiProvider.value = "";
  aiModel.value = "";
  errorMsg.value = "";

  try {
    const result = await explainError(selectedMode.value, inputText.value);

    response.value = result.content;
    aiProvider.value = result.provider;
    aiModel.value = result.model;

    // Incrementar contador en background
    incrementCounter().then(() => {
      topBarRef.value?.fetchCount?.();
    });
  } catch (err) {
    errorMsg.value = err.message || "Error inesperado. Intenta de nuevo.";
  } finally {
    isLoading.value = false;
  }
}

function getRandomExample() {
  const randomIndex = Math.floor(Math.random() * ERROR_EXAMPLES.length);
  return ERROR_EXAMPLES[randomIndex];
}

function loadExample() {
  const example = getRandomExample();
  inputText.value = example.text;
}

// ─────────────────────────────────────────────────────────────────────────
onMounted(() => {
  getAllModes();
});
</script>

<style scoped>
textarea::placeholder {
  color: #374151;
}

@keyframes appItemIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up-enter-active {
  transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Scroll personalizado */
.custom-scroll::-webkit-scrollbar {
  width: 8px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: rgba(20, 20, 20, 0.6);
  border-radius: 10px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgba(34, 211, 238, 0.6),
    rgba(59, 130, 246, 0.4)
  );
  border-radius: 10px;
  transition: all 0.3s ease;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgba(34, 211, 238, 0.9),
    rgba(59, 130, 246, 0.7)
  );
}

/* Firefox */
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(34, 211, 238, 0.6) rgba(20, 20, 20, 0.6);
}
</style>
