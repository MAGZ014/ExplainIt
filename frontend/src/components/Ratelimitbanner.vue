<template>
  <Transition name="slide-up">
    <div v-if="visible" class="shrink-0 px-6 pb-2">
      <!-- Bloqueado: countdown -->
      <div
        v-if="isBlocked"
        class="flex items-center justify-between gap-4 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3"
      >
        <div class="flex items-center gap-2.5 text-orange-400 text-sm">
          <v-icon
            name="bi-hourglass-split"
            class="w-4 h-4 shrink-0 animate-pulse"
          />
          <span
            >Límite alcanzado — espera
            <strong class="tabular-nums">{{ countdown }}s</strong> para
            continuar</span
          >
        </div>

        <!-- Barra de progreso -->
        <div
          class="flex-1 max-w-32 h-1.5 bg-orange-500/10 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-orange-400 rounded-full transition-all duration-1000 ease-linear"
            :style="{ width: `${progressPct}%` }"
          ></div>
        </div>
      </div>

      <!-- Normal: indicador de peticiones restantes -->
      <div
        v-else-if="showUsage"
        class="flex items-center gap-2 text-xs"
        :class="remaining <= 1 ? 'text-yellow-500' : 'text-gray-600'"
      >
        <div class="flex gap-1">
          <span
            v-for="i in limit"
            :key="i"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="i <= remaining ? activeColor : 'bg-gray-800'"
          ></span>
        </div>
        <span>{{ remaining }}/{{ limit }} peticiones disponibles</span>
        <span v-if="remaining <= 1" class="text-yellow-500/60"
          >— se renueva en ~1 min</span
        >
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";

const props = defineProps({
  remaining: { type: Number, default: 5 },
  limit: { type: Number, default: 5 },
  isBlocked: { type: Boolean, default: false },
  resetAt: { type: Date, default: null },
});

// Mostrar indicador solo cuando se ha usado al menos 1 petición o está bloqueado
const showUsage = computed(
  () => props.remaining < props.limit || props.isBlocked,
);
const visible = computed(() => showUsage.value || props.isBlocked);

// Color de los puntos según cuánto queda
const activeColor = computed(() => {
  if (props.remaining <= 1) return "bg-yellow-400";
  if (props.remaining <= 2) return "bg-orange-400";
  return "bg-cyan-400";
});

// ─── Countdown cuando está bloqueado ─────────────────────────────────────
const countdown = ref(0);
const totalWait = ref(0);
let timer = null;

const progressPct = computed(() => {
  if (!totalWait.value) return 0;
  return (countdown.value / totalWait.value) * 100;
});

function startCountdown() {
  if (!props.resetAt) return;
  const secs = Math.ceil((props.resetAt.getTime() - Date.now()) / 1000);
  countdown.value = Math.max(0, secs);
  totalWait.value = countdown.value;

  clearInterval(timer);
  timer = setInterval(() => {
    countdown.value = Math.max(
      0,
      Math.ceil((props.resetAt.getTime() - Date.now()) / 1000),
    );
    if (countdown.value <= 0) clearInterval(timer);
  }, 1000);
}

watch(
  () => props.isBlocked,
  (blocked) => {
    if (blocked) startCountdown();
    else clearInterval(timer);
  },
  { immediate: true },
);

watch(
  () => props.resetAt,
  (val) => {
    if (val && props.isBlocked) startCountdown();
  },
);

onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.slide-up-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.slide-up-leave-active {
  transition: all 0.2s ease;
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
