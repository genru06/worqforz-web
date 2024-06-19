<template>
  <div>
    <img
      class="background"
      style="width: 150%; right: 0"
      src="../assets/login_bg.jpg"
    />
    <div class="row justify-center">
      <div class="login-wrapper" style="width: 500px">
        <div class="column bg-white">
          <q-card flat class="my-card col-lg-6 self-center">
            <q-card-section class="row justify-center">
              <img style="width: 100%" src="../assets/paceman-header.jpg" />
            </q-card-section>
            <!-- <q-card-section class="text-center q-pt-none">
              <h5 class="q-ma-none">{{ coopName }}</h5>
            </q-card-section> -->
            <q-separator inset />
            <q-card-section class="q-pb-none">
              <q-form @submit="login" @reset="onReset">
                <q-card-section>
                  <q-input
                    outlined
                    v-model="username"
                    type="text"
                    label="username"
                    dense
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Username is Required',
                    ]"
                  />
                </q-card-section>
                <q-card-section class="q-pt-none">
                  <q-input
                    outlined
                    v-model="password"
                    type="password"
                    label="password"
                    @keyup.enter="login"
                    dense
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Password is Required',
                    ]"
                  />
                </q-card-section>
                <q-card-section class="column q-pb-md items-center">
                  <q-btn
                    class="full-width"
                    size="20px"
                    label="Login"
                    type="submit"
                    color="primary"
                    :loading="submitting"
                  >
                    <template v-slot:loading> <q-spinner-facebook /> </template
                  ></q-btn>
                </q-card-section>
                <!-- <q-card-section class="column items-center q-pt-none">
                  <q-btn
                    class="full-width"
                    size="20px"
                    label="REGISTER"
                    color="red"
                    to="/register"
                  />
                </q-card-section> -->
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Please Enter Your Authentication Code</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="authCode"
            autofocus
            @keyup.enter="validateAuthCode"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat @click="validateAuthCode" label="Submit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="alert">
      <q-card>
        <q-card-section>
          <div class="text-center">
            <q-icon
              :name="status == 'error' ? 'warning' : 'info'"
              :color="status == 'error' ? 'negative' : 'info'"
              size="4rem"
            />
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">{{ msg }} </q-card-section>
        <q-card-actions align="center">
          <q-btn to="/login" label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { LocalStorage } from "quasar";
import { auth_api } from "src/boot/axios";
import { useUserStore } from "src/stores/user-store";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const submitting = ref(false);

const userStore = useUserStore();
const alert = ref(false);
const status = ref("");
const msg = ref("");

const route = useRouter();

const login = async () => {
  submitting.value = true;

  await userStore.login(username.value, password.value);
  const response = LocalStorage.getItem("user");
  // console.log(response);
  submitting.value = false;
  if (!response.isActive) {
    if (response.status == "error") {
      status.value = response.status;
      alert.value = true;
      msg.value = response.msg;
    } else if (response.status == "needsActivation") {
      prompt.value = true;
    } else {
      if (response.isValidated) {
        route.push("/dashboard");
      } else {
        alert.value = true;
        msg.value = response.msg;
      }
    }
  } else {
    if (response.isValidated) {
      route.push("/dashboard");
    } else {
      alert.value = true;
      msg.value = response.msg;
    }
  }
};
</script>

<style scoped>
.login-wrapper {
  position: relative;
  opacity: 0.8;
  top: 30vh;
}
@media only screen and (max-width: 1000px) {
  .bg-white {
    min-height: 100vh;
  }
  .login-wrapper {
    min-width: 100%;
  }
  .my-card {
    top: 5vh;
  }
}

.background {
  position: fixed;
  -webkit-background-size: cover !important;
  -moz-background-size: cover !important;
  -o-background-size: cover !important;
  background-size: cover !important;
  z-index: -1;
}
</style>
