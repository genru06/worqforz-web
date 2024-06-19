<template>
  <div class="row justify-center">
    <div class="row col-lg-8 justify-end">
      <q-btn color="primary" icon="edit" flat @click="edit = true" />
    </div>
    <div class="row col-lg-8">
      <label class="row justify-end flex-40">Company Name</label>
      <q-input
        class="flex-grow"
        v-model="settings.company_name"
        type="text"
        dense
      />
    </div>
    <div class="row col-lg-8">
      <label class="row justify-end flex-40">Company Address</label>
      <q-input
        class="flex-grow"
        v-model="settings.company_address"
        type="text"
        dense
      />
    </div>
    <div class="row col-lg-8">
      <label class="row justify-end flex-40">Official Time In</label>

      <q-input
        class="flex-grow"
        dense
        style="font-weight: bold"
        v-model="settings.official_time_in"
        type="time"
      >
        <template v-slot:append>
          <q-icon v-if="edit" name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="settings.official_time_in">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="row col-lg-8">
      <label class="row justify-end flex-40">Official Time Out</label>

      <q-input
        class="flex-grow"
        dense
        style="font-weight: bold"
        v-model="settings.official_time_out"
        type="time"
      >
        <template v-slot:append>
          <q-icon v-if="edit" name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="settings.official_time_out">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
    <div class="row col-lg-8">
      <label class="row justify-end flex-40">Application ID</label>
      <q-input class="flex-grow" v-model="settings.app_id" type="text" dense />
    </div>
    <div class="row col-lg-8">
      <label class="row justify-end flex-40">Application Key</label>
      <q-input
        class="flex-grow"
        v-model="settings.app_secret"
        type="password"
        dense
      />
    </div>
    <div class="row col-lg-8 justify-end">
      <q-btn
        color="primary"
        icon="save"
        label="Edit"
        size="md"
        class="row q-mt-lg"
        @click="submitChanges"
        v-if="edit"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { hr_api } from "src/boot/axios";
import { ref, watch } from "vue";

const $q = useQuasar();
const edit = ref(false);
const settings = ref({
  company_name: "",
  company_address: "",
  official_time_in: "",
  official_time_out: "",
  app_id: "",
  app_secret: "a37fe1c1-0d46-49d5-a008-6e2ba1b41fcb",
});

const submitChanges = async () => {
  await hr_api.patch("settings/edit", settings.value).then((response) => {
    settings.value = response.data;
    $q.notify({
      color: "positive",
      position: "top",
      message: "Successfully Updated",
      icon: "check",
    });
  });
};

const getSettings = () => {
  hr_api.get("settings").then((response) => {
    settings.value = response.data;
  });
};
getSettings();
</script>

<style lang="scss" scoped>
.flex-40 {
  flex: 0 0 30%;
  padding-top: 10px;
  padding-right: 10px;
  color: #737373;
  text-align: right;
}

.flex-grow {
  flex: 1;
}
</style>
