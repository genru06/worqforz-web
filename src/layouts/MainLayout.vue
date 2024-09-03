<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated reveal class="bg-secondary text-primary">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawer = !drawer"
          class="lt-lg"
        />
        <q-item class="q-pl-none lt-lg" clickable tag="a" :href="baseUrl">
          <q-toolbar-title class="text-sm">
            <q-avatar>
              <img :src="logo" class="toolbar-img" />
            </q-avatar>
            {{ shortName }}
          </q-toolbar-title>
        </q-item>
        <q-item class="q-pl-none gt-md" clickable tag="a" :href="baseUrl">
          <q-toolbar-title class="text-sm">
            <q-avatar>
              <img src="../assets/logo.png" class="toolbar-img" />
            </q-avatar>
            {{ appName }}
          </q-toolbar-title>
        </q-item>
        <MenuLayout :routes="showRoutes" />

        <q-space />
        <q-btn-dropdown
          auto-close
          shrink
          flat
          icon="person"
          :label="'HI ' + name"
          class="gt-md"
        >
          <q-list>
            <q-item clickable>
              <q-icon name="person" size="1.5rem" left></q-icon>
              <q-item-section>User Profile</q-item-section>
            </q-item>
            <q-item clickable>
              <q-icon name="settings" size="1.5rem" left></q-icon>
              <q-item-section>Change Password</q-item-section>
            </q-item>
            <q-separator />
            <q-item clickable v-if="!isTL">
              <q-icon name="settings" size="1.5rem" left></q-icon>
              <q-item-section>Access Control</q-item-section>
            </q-item>
            <q-item clickable @click="logout">
              <q-icon name="logout" size="1.5rem" left></q-icon>
              <q-item-section icon="logout">Logout</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          class="lt-sm"
          dense
          flat
          round
          icon="menu"
          @click="leftDrawer = !leftDrawer"
        />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="drawer" overlay :width="220">
      <q-list>
        <q-item clickable to="/dashboard">
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset />
        <q-item clickable to="/scan">
          <q-item-section>
            <q-item-label>Scan Attendance</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-drawer v-model="leftDrawer" overlay side="right" auto :width="220">
      <q-list>
        <q-item clickable>
          <q-icon name="person" size="1.5rem" left></q-icon>
          <q-item-section>User Profile</q-item-section>
        </q-item>
        <q-item clickable>
          <q-icon name="settings" size="1.5rem" left></q-icon>
          <q-item-section>Change Password</q-item-section>
        </q-item>
        <q-separator />
        <!-- <q-item clickable>
          <q-icon name="settings" size="1.5rem" left></q-icon>
          <q-item-section>Access Control</q-item-section>
        </q-item> -->
        <q-item clickable @click="logout">
          <q-icon name="logout" size="1.5rem" left></q-icon>
          <q-item-section icon="logout">Logout</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view :appName="appName" />
    </q-page-container>

    <q-footer bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="gt-md">
          <div class="float-right text-lg">Powered By : Worqforz</div>

          <strong class="text-lg"
            >Copyright © 2024
            <a href="https://paceman.com">Canaan ICT Solutions Inc</a>.</strong
          >
          All rights reserved.
        </q-toolbar-title>
        <q-toolbar-title class="lt-lg">
          <div class="float-right text-lg">Powered By : Worqforz</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>
<script setup>
import { LocalStorage } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user-store";
import MenuLayout from "./MenuLayout.vue";
import routes from "../router/routes";
const showRoutes = ref(routes[0].children);

const userStore = useUserStore();
const router = useRouter();
const appName = ref(process.env.COMPANY_NAME);
const baseUrl = ref(process.env.BASE_URL);
const isTL = ref(true);
const shortName = ref(process.env.SHORT_NAME);
const drawer = ref(false);
const leftDrawer = ref(false);

const name = ref(userStore.$state.name || "");

isTL.value =
  localStorage.getItem("is_TL") == null ||
  localStorage.getItem("is_TL") == "undefined" ||
  localStorage.getItem("is_TL") == "null"
    ? false
    : true;

console.log(isTL.value);

const logout = () => {
  userStore.clearUser();
  router.push("/login");
};
</script>
<style lang="scss" scoped>
.toolbar-img {
  width: 50px !important;
}
</style>
