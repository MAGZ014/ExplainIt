<template>
  <Transition name="slide-up">
    <div v-if="response" class="bg-gray-900 border border-gray-800 rounded-2xl">
      <!-- Header -->
      <div
        class="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/60"
      >
        <div class="flex items-center gap-2.5">
          <v-icon name="bi-stars" class="w-4 h-4 text-cyan-400" />
          <span class="text-sm font-semibold text-gray-200"
            >Explicación generada</span
          >
          <!-- Provider badge -->
          <span
            v-if="provider"
            class="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border"
            :class="providerStyle.badge"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="providerStyle.dot"
            ></span>
            {{ providerLabel }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="$emit('regenerate')"
            class="p-1.5 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
            title="Regenerar"
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

      <!-- Sections -->
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
            <div class="flex-1 min-w-0">
              <h4
                class="text-xs font-bold uppercase tracking-wider mb-2"
                :class="sectionColors[i % sectionColors.length].text"
              >
                {{ section.title }}
              </h4>

              <!-- Render content: code blocks + text -->
              <div class="space-y-2">
                <template v-for="(chunk, ci) in section.chunks" :key="ci">
                  <!-- Code block -->
                  <div v-if="chunk.type === 'code'" class="relative group">
                    <div
                      class="flex items-center justify-between px-3 py-1.5 bg-gray-950 rounded-t-lg border border-gray-700/60 border-b-0"
                    >
                      <span class="text-[10px] text-gray-500 font-mono">{{
                        chunk.lang || "code"
                      }}</span>
                      <button
                        @click="copyCode(chunk.code, ci)"
                        class="text-[10px] text-gray-600 hover:text-cyan-400 transition-colors flex items-center gap-1"
                      >
                        <v-icon
                          :name="
                            copiedCode === ci ? 'bi-check2' : 'bi-clipboard'
                          "
                          class="w-2.5 h-2.5"
                        />
                        {{ copiedCode === ci ? "Copiado" : "Copiar" }}
                      </button>
                    </div>
                    <pre
                      class="bg-gray-950 border border-gray-700/60 rounded-b-lg px-4 py-3 overflow-x-auto text-xs text-green-300 font-mono leading-relaxed"
                    ><code>{{ chunk.code }}</code></pre>
                  </div>

                  <!-- Text -->
                  <p
                    v-else
                    class="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap"
                  >
                    {{ chunk.text }}
                  </p>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  response: { type: String, default: "" },
  provider: { type: String, default: "" },
  model: { type: String, default: "" },
});

const emit = defineEmits(["regenerate"]);

const copied = ref(false);
const copiedCode = ref(null);

// ─── Provider badge style ─────────────────────────────────────────────────
const providerStyle = computed(() => {
  const map = {
    groq: {
      badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      dot: "bg-orange-400",
    },
    openrouter: {
      badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      dot: "bg-purple-400",
    },
    gemini: {
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      dot: "bg-blue-400",
    },
  };
  return (
    map[props.provider] || {
      badge: "bg-gray-700/30 text-gray-400 border-gray-700",
      dot: "bg-gray-400",
    }
  );
});

const providerLabel = computed(() => {
  const map = { groq: "Groq", openrouter: "OpenRouter", gemini: "Gemini" };
  return map[props.provider] || props.provider;
});

// ─── Section parsing ──────────────────────────────────────────────────────
const sectionIcons = [
  "bi-patch-question",
  "bi-lightning-fill",
  "bi-code-slash",
  "bi-file-earmark-text",
  "bi-check2-circle",
];

const sectionColors = [
  { bg: "bg-cyan-500/10", text: "text-cyan-400" },
  { bg: "bg-yellow-500/10", text: "text-yellow-400" },
  { bg: "bg-green-500/10", text: "text-green-400" },
  { bg: "bg-purple-500/10", text: "text-purple-400" },
  { bg: "bg-pink-500/10", text: "text-pink-400" },
];

/**
 * Divide el texto de una sección en chunks: { type: 'text'|'code', text, code, lang }
 */
function parseChunks(raw) {
  const chunks = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      const text = raw.slice(lastIndex, match.index).trim();
      if (text) chunks.push({ type: "text", text });
    }
    chunks.push({
      type: "code",
      lang: match[1] || "code",
      code: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  const remaining = raw.slice(lastIndex).trim();
  if (remaining) chunks.push({ type: "text", text: remaining });

  return chunks.length ? chunks : [{ type: "text", text: raw.trim() }];
}

const parsedSections = computed(() => {
  if (!props.response) return [];
  const sections = [];
  const blocks = props.response.split(/\n(?=##\s)/);

  for (const block of blocks) {
    const match = block.match(/^##\s+(.+)\n([\s\S]*)/);
    if (match) {
      sections.push({
        title: match[1].trim(),
        chunks: parseChunks(match[2]),
      });
    } else if (block.trim()) {
      sections.push({
        title: "Respuesta",
        chunks: parseChunks(block.trim()),
      });
    }
  }

  return sections.length
    ? sections
    : [{ title: "Explicación", chunks: parseChunks(props.response) }];
});

// ─── Copy actions ─────────────────────────────────────────────────────────
async function copyResponse() {
  await navigator.clipboard.writeText(props.response);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

async function copyCode(code, idx) {
  await navigator.clipboard.writeText(code);
  copiedCode.value = idx;
  setTimeout(() => (copiedCode.value = null), 2000);
}
</script>

<style scoped>
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

pre {
  scrollbar-width: thin;
  scrollbar-color: #374151 transparent;
}
pre::-webkit-scrollbar {
  height: 4px;
}
pre::-webkit-scrollbar-track {
  background: transparent;
}
pre::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 2px;
}
</style>
