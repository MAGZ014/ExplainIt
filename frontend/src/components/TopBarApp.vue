<template>
  <header
    class="flex items-center justify-between px-8 py-4 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm shrink-0"
  >
    <div class="flex items-center gap-3">
      <span class="text-gray-400 text-sm">Modo activo:</span>
      <span
        class="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5"
      >
        <v-icon :name="activeModeObj.icon" class="w-3 h-3" />
        {{ activeModeObj.label }}
      </span>
    </div>

    <div class="flex items-center gap-4">
      <!-- counter -->
      <div class="flex items-center gap-2 text-xs">
        <div
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800"
        >
          <v-icon name="bi-chat-dots" class="w-3 h-3 text-cyan-500" />
          <span class="text-gray-500">interacciones:</span>
          <span
            class="font-bold tabular-nums transition-all duration-300"
            :class="messageCount > 0 ? 'text-cyan-400' : 'text-gray-600'"
          >
            <span
              v-if="loadingCount"
              class="inline-block w-8 h-2 rounded bg-gray-800 animate-pulse align-middle"
            ></span>
            <span v-else>{{ messageCount.toLocaleString() }}</span>
          </span>
        </div>
      </div>

      <div class="w-px h-4 bg-gray-800"></div>

      <!-- API Status -->
      <div class="flex items-center gap-2 text-xs">
        <template v-if="loadingStatus">
          <div class="w-2 h-2 rounded-full bg-gray-700 animate-pulse"></div>
          <span class="text-gray-600">Verificando...</span>
        </template>

        <!-- Online -->
        <template v-else-if="apiOnline">
          <div class="relative flex items-center">
            <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
            <div
              class="absolute w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-60"
            ></div>
          </div>
          <span class="text-gray-500"
            >API <span class="text-cyan-400 font-medium">activa</span></span
          >
        </template>

        <!-- Offline -->
        <template v-else>
          <div class="w-2 h-2 rounded-full bg-red-500"></div>
          <span class="text-gray-500"
            >API <span class="text-red-400 font-medium">inactiva</span></span
          >
        </template>

        <!-- Retry button offline -->
        <button
          v-if="!loadingStatus && !apiOnline"
          @click="checkStatus"
          class="ml-1 p-1 rounded text-gray-600 hover:text-gray-400 hover:bg-gray-800 transition-all"
          title="Reintentar conexión"
        >
          <v-icon
            name="bi-arrow-repeat"
            class="w-3 h-3"
            :class="loadingStatus ? 'animate-spin' : ''"
          />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { getMessagesCounter } from "@/services/message";
import { getStatusApi } from "@/services/moreServices";

const props = defineProps({
  activeModeObj: { type: Object, required: true },
});

const messageCount = ref(0);
const apiOnline = ref(false);
const loadingCount = ref(true);
const loadingStatus = ref(true);

let statusInterval = null;

const fetchCount = async () => {
  loadingCount.value = true;
  try {
    const [data] = await getMessagesCounter();
    messageCount.value = data?.count ?? data?.total ?? 0;
  } finally {
    loadingCount.value = false;
  }
};

const checkStatus = async () => {
  loadingStatus.value = true;
  try {
    const data = await getStatusApi();
    apiOnline.value =
      data && !data.error && (data.status === "ok" || data.success !== false);
  } finally {
    loadingStatus.value = false;
  }
};

onMounted(async () => {
  await Promise.all([fetchCount(), checkStatus()]);

  statusInterval = setInterval(checkStatus, 30_000);
});

onUnmounted(() => {
  clearInterval(statusInterval);
});

defineExpose({ fetchCount });
</script>
