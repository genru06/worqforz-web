<template>
  <div class="q-pa-md">
    <q-card class="addInfractionsCard">
      <q-bar>
        <q-icon name="add" />
        <div>Add Infraction</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="q-pt-none row">
        <q-select
          class="q-pb-none col"
          dense
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          v-model="form.profile"
          :options="profileOptions"
          @filter="profileFn"
          :option-label="(v) => v.firstname + ' ' + v.lastname"
          :option-value="(v) => v.user_id"
          label="Search Employee"
          bg-color="white"
          :rules="[(val) => val || 'Please select an Employee']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="q-pt-none row q-gutter-md">
        <q-input
          class="col"
          dense
          v-model="form.offense_date"
          mask="date"
          label="Offense Date : "
          bg-color="white"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="form.offense_date">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          class="col"
          dense
          v-model="form.date_reported_hr"
          mask="date"
          label="Date Reported to HR : "
          bg-color="white"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="form.date_reported_hr">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="q-pt-none row">
        <q-select
          class="q-pb-none col"
          dense
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          v-model="infractionCategory"
          :options="props.infractionSections"
          :option-label="(v) => v.section"
          option-value="id"
          @update:model-value="(v) => getInfraction(v.infractions)"
          label="Infraction Category"
          bg-color="white"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="q-pt-none row">
        <q-select
          class="q-pb-none col"
          dense
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          v-model="form.infraction"
          :options="infractionOptions"
          :option-label="(v) => v.infraction"
          @filter="infractionFn"
          option-value="id"
          label="Infraction"
          bg-color="white"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="q-pt-none row">
        <q-input
          v-model="form.details"
          class="col"
          label="Description"
          autogrow
          dense
        />
      </q-card-section>
      <q-card-section class="q-pt-none row">
        <q-input
          class="col"
          dense
          v-model="form.date_received"
          mask="date"
          label="Date Received : "
          bg-color="white"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="form.date_received">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="q-pt-none row">
        <q-input
          v-model="form.reported_by"
          class="col"
          label="Reported By"
          dense
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="negative" @click="closeForm" size="12px" label="CANCEL" />
        <q-btn
          color="positive"
          size="12px"
          @click="confirm = true"
          label="SUBMIT"
        />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure you want to Submit this Infraction</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            dense
            label="Yes"
            @click="submitInfraction"
            color="positive"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { hr_api } from "../../boot/axios";
import { date, useQuasar } from "quasar";

const props = defineProps({
  infractionSections: [],
});

const emit = defineEmits(["cancel"]);
const $q = useQuasar();

const closeForm = () => {
  emit("cancel");
};
const confirm = ref(false);
const form = ref({
  profile: {
    firstname: "",
    lastname: "",
    name: "",
  },
  offense_date: date.formatDate(Date.now(), "YYYY-MM-DD"),
  date_reported_hr: date.formatDate(Date.now(), "YYYY-MM-DD"),
  infraction: 0,
  details: "",
  date_received: date.formatDate(Date.now(), "YYYY-MM-DD"),
  reported_by: "",
  status: 0,
});
const profile = [];
const profileOptions = ref(profile);
const infractionOptions = ref([]);
const infractionCategory = ref();

const profileFn = async (val, update, abort) => {
  if (profile.length == 0) {
    await hr_api.get("profile/all/1").then((response) => {
      for (const c in response.data) {
        profile.push({
          user_id: response.data[c].user_id,
          name: response.data[c].lastname + " " + response.data[c].firstname,
          lastname: response.data[c].lastname,
          firstname: response.data[c].firstname,
        });
      }
    });
    console.log("empty");
  }
  update(() => {
    const needle = val.toLowerCase();
    profileOptions.value = profile.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const getInfraction = (details) => {
  for (const d of details) {
    const row = {
      id: d.id,
      infraction: d.infractions,
    };
    infractionOptions.value.push(row);
  }
};

const submitInfraction = async () => {
  api.post("infraction/add", form.value).then((response) => {
    $q.notify({
      color: "positive",
      position: "top",
      message: "Infraction Submitted Successfully",
      icon: "check",
    });
    emit("cancel");
  });
};
</script>

<style lang="scss" scoped>
.addInfractionsCard {
  width: 400px !important;
}
</style>
