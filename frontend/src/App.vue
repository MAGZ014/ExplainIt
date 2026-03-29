<template>
  <div class="h-screen bg-gray-950 overflow-hidden">
    <!-- Splash Screen -->
    <SplashScreen v-if="!appReady || splashVisible" @done="onSplashDone" />

    <!-- App shell with staggered reveal -->
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
          @update:selectedMode="selectedMode = $event"
        />
      </div>

      <!-- MAIN  -->
      <main
        class="flex-1 flex flex-col overflow-hidden app-item"
        style="--delay: 80ms"
      >
        <TopBarApp :activeModeObj="activeModeObj" />

        <div class="flex flex-1 overflow-hidden">
          <section class="flex-1 flex flex-col gap-4 p-6 overflow-y-auto">
            <!-- Input Card -->
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
                  class="w-full bg-transparent text-gray-200 text-sm px-4 py-4 resize-none outline-none placeholder-gray-700 leading-relaxed font-mono"
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
                    <span>{{ isLoading ? "Analizando..." : "Analizar" }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Loading Skeleton -->
            <div
              v-if="isLoading"
              class="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 animate-pulse"
            >
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 rounded bg-cyan-500/20"></div>
                <div class="h-4 w-32 rounded bg-gray-800"></div>
              </div>
              <div class="space-y-2">
                <div class="h-3 rounded bg-gray-800 w-full"></div>
                <div class="h-3 rounded bg-gray-800 w-5/6"></div>
                <div class="h-3 rounded bg-gray-800 w-4/6"></div>
              </div>
              <div class="h-3 rounded bg-gray-800 w-full"></div>
              <div class="h-3 rounded bg-gray-800 w-3/4"></div>
            </div>

            <!-- Output Card -->
            <Transition name="slide-up">
              <div
                v-if="response && !isLoading"
                class="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
              >
                <div
                  class="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/60"
                >
                  <div
                    class="flex items-center gap-2 text-sm font-semibold text-gray-200"
                  >
                    <v-icon name="bi-stars" class="w-4 h-4 text-cyan-400" />
                    Explicación generada
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="regenerate"
                      class="p-1.5 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                    >
                      <v-icon name="bi-arrow-repeat" class="w-3.5 h-3.5" />
                    </button>
                    <button
                      @click="copyResponse"
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      :class="
                        copied
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                      "
                    >
                      <v-icon
                        :name="copied ? 'bi-check2' : 'bi-clipboard'"
                        class="w-3 h-3"
                      />
                      {{ copied ? "Copiado!" : "Copiar" }}
                    </button>
                  </div>
                </div>
                <div class="divide-y divide-gray-800/60">
                  <div
                    v-for="(section, i) in parsedSections"
                    :key="i"
                    class="px-5 py-4 section-reveal"
                    :style="{ '--si': i }"
                  >
                    <div class="flex items-start gap-3">
                      <div
                        class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        :class="sectionColors[i % sectionColors.length].bg"
                      >
                        <v-icon
                          :name="sectionIcons[i % sectionIcons.length]"
                          class="w-3.5 h-3.5"
                          :class="sectionColors[i % sectionColors.length].text"
                        />
                      </div>
                      <div class="flex-1">
                        <h4
                          class="text-xs font-bold uppercase tracking-wider mb-1.5"
                          :class="sectionColors[i % sectionColors.length].text"
                        >
                          {{ section.title }}
                        </h4>
                        <p
                          class="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap"
                        >
                          {{ section.content }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Empty state -->
            <div
              v-if="!response && !isLoading"
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
import { getModes } from "./services/mode.js";

// ─── Splash ──────────────────────────────────────────────────────────────
const splashVisible = ref(true);
const appReady = ref(false);

function onSplashDone() {
  splashVisible.value = false;
  appReady.value = true;
}

// ─── State ───────────────────────────────────────────────────────────────
const modes = ref([]);
const inputText = ref("");
const response = ref("");
const isLoading = ref(false);
const isFocused = ref(false);
const copied = ref(false);
const selectedMode = ref("profesor");

// ─── Modes ───────────────────────────────────────────────────────────────
const getAllModes = async () => {
  try {
    modes.value = await getModes();
    console.log(modes.value);
  } catch (error) {
    console.error("Error al cargar los modelos:", error.message);
  }
};

const activeModeObj = computed(
  () =>
    modes.value.find((m) => m.name === selectedMode.value) || modes.value[0],
);

// ─── Response parsing ─────────────────────────────────────────────────────
const sectionIcons = [
  "bi-patch-question",
  "bi-lightning-fill",
  "bi-code-slash",
  "bi-file-earmark-text",
];

const sectionColors = [
  { bg: "bg-cyan-500/10", text: "text-cyan-400" },
  { bg: "bg-yellow-500/10", text: "text-yellow-400" },
  { bg: "bg-green-500/10", text: "text-green-400" },
  { bg: "bg-purple-500/10", text: "text-purple-400" },
];

const parsedSections = computed(() => {
  if (!response.value) return [];
  const sections = [];
  const blocks = response.value.split(/\n(?=##\s)/);
  for (const block of blocks) {
    const match = block.match(/^##\s+(.+)\n([\s\S]*)/);
    if (match) {
      sections.push({ title: match[1].trim(), content: match[2].trim() });
    } else if (block.trim()) {
      sections.push({ title: "Respuesta", content: block.trim() });
    }
  }
  return sections.length
    ? sections
    : [{ title: "Explicación", content: response.value }];
});

// ─── Actions ─────────────────────────────────────────────────────────────
async function analyzeError() {
  if (!inputText.value.trim() || isLoading.value) return;
  isLoading.value = true;
  response.value = "";
  try {
    // TODO
  } catch {
    response.value =
      "## Error de conexión\nNo se pudo conectar con la API. Verifica tu conexión.";
  } finally {
    isLoading.value = false;
  }
}

function regenerate() {
  analyzeError();
}

async function copyResponse() {
  await navigator.clipboard.writeText(response.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

function loadExample() {
  inputText.value = `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList.vue:42:18
    at renderComponentRoot (runtime-core.esm-bundler.js:939:12)
    at ReactiveEffect.componentUpdateFn [as fn] (runtime-core.esm-bundler.js:4160:46)
    at ReactiveEffect.run (reactivity.esm-bundler.js:167:19)`;
}

// ─────────────────────────────────────────────────────────────
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

.section-reveal {
  animation: sectionIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--si, 0) * 80ms + 100ms);
}

@keyframes sectionIn {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
