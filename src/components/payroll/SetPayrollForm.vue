<template>
  <div class="col-lg-sm">
    <q-card>
      <q-bar>
        <q-icon name="add" />
        <div>Set Payroll Period</div>

        <q-space />

        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pt-none q-pb-none">
        <div class="col">
          <q-input
            dense
            v-model="form.per_from"
            mask="date"
            label="From Date : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="form.per_from">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col">
          <q-input
            dense
            v-model="form.per_to"
            mask="date"
            label="To Date : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="form.per_to">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input v-model="form.per_week" dense type="text" label="Week No" />
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-select
          dense
          v-model="form.workplace"
          :options="workplaceOptions"
          option-label="name"
          option-value="id"
          label="Leave Type"
        />
      </q-card-section>
      <q-card-actions horizontal align="right">
        <q-btn
          color="positive"
          size="sm"
          label="Set"
          @click="setPayroll"
          v-close-popup
        />
        <q-btn color="negative" size="sm" label="Cancel" v-close-popup />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { hr_api } from "src/boot/axios";
import { ref } from "vue";
import { useConstants } from "../../stores/constants";

const $q = useQuasar();
const constants = useConstants();
const form = ref({
  per_from: date.formatDate(Date.now(), "YYYY-MM-DD"),
  per_to: date.formatDate(Date.now(), "YYYY-MM-DD"),
  per_code: Date.now(),
  per_week: "",
  workplace: "Select a Workplace",
  headers: "",
});
const workplaceOptions = ref(constants.workplace);

const getColumnUsed = async () => {
  await hr_api.get("payroll/charges/").then((response) => {
    form.value.headers = response.data;
  });
};

const setPayroll = async () => {
  // console.log(form.value);
  hr_api.post("payroll/set", form.value).then(() => {
    $q.notify({
      color: "positive",
      position: "top",
      message: "Successfully Set",
      icon: "done",
    });
  });
};
getColumnUsed();
</script>

<style scoped></style>
