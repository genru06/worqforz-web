<template>
  <router-view />
</template>

<script setup lang="ts">
import { socket } from "./boot/socket";

// if (!localStorage.getItem("socketID")) {
socket.emit("join");
socket.on("socketConnect", (details) => {
  console.log("connected :", details);
});
// }
</script>
