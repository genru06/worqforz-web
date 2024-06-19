<template>
  <div>
    <q-tabs v-model="tab" inline-label class="gt-sm text-dark">
      <q-route-tab
        v-for="item in menuItems"
        :key="item.name"
        :name="item.meta.name"
        :to="item.path"
        :label="item.meta.name"
      >
      </q-route-tab>
    </q-tabs>
  </div>
</template>

<script setup>
import { LocalStorage } from "quasar";
import MenuLayout from "./MenuLayout.vue";
import { ref } from "vue";

// const user = LocalStorage.getItem("user");
// const roles = user.roles;
const props = defineProps({
  routes: {
    type: Object,
    required: true,
  },
});
const user = LocalStorage.getItem("user");
const menuItems = ref([]);
const roles = user.roles.split(",");
for (const r of props.routes) {
  if (
    r.meta.roles.some((role) => roles.includes(role)) ||
    r.meta.roles.includes("any")
  ) {
    menuItems.value.push(r);
  }
}

console.log(props.routes);
</script>

<style lang="scss" scoped></style>
