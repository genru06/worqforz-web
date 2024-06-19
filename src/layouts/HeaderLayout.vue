<template>
  <div>
    <q-toolbar>
      <q-toolbar-title class="w-full">
        <h4 class="text-gray-900 q-ma-none">
          <!-- {{ mainTitle }} -->
          <small class="gt-sm">{{ moduleTitle }}</small>
        </h4>
      </q-toolbar-title>
      <q-space class="gt-sm" />
      <q-btn-group class="gt-sm" flat>
        <slot />
      </q-btn-group>
    </q-toolbar>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  mainTitle: String,
  moduleTitle: String,
});
</script>

<style></style>
