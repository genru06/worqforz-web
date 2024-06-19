<template>
  <q-card class="q-pa-none" style="width: 600px">
    <q-bar dark class="bg-primary text-white">
      <div class="col text-left text-weight-bold">Edit About Me</div>
      <q-btn flat round dense icon="save" @click="saveEditAboutMe" />
      <q-btn flat round dense icon="close" v-close-popup />
    </q-bar>
    <q-card-section>
      <q-input
        dense
        v-model="editInfo.basic.birthdate"
        mask="date"
        label="Birthdate"
        bg-color="white"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="editInfo.basic.birthdate">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input v-model="editInfo.addressInfo.street" dense label="street" />
      <q-input
        v-model="editInfo.addressInfo.barangay.barangay"
        dense
        label="barangay"
      />
      <q-select
        dense
        v-model="editInfo.addressInfo.city"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="cityOptions"
        @filter="cityFn"
        option-label="mun_city"
        option-value="id"
        label="Select City / Municipality"
        bg-color="white"
        :rules="[(val) => val || 'Please Select a City']"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input dense v-model="editInfo.basic.mobile" label="Contact #" />
      <q-input dense v-model="editInfo.basic.eyes_color" label="Eyes Color" />
      <q-input dense v-model="editInfo.basic.hair_color" label="Hair Color" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { hr_api } from "src/boot/axios";
import { ref } from "vue";

const $q = useQuasar();
const props = defineProps({
  basicDetails: {},
  addressDetails: {},
});

const emit = defineEmits(["update"]);

console.log(props.addressDetails);
const editInfo = ref({
  basic: {
    user_id: props.basicDetails.user_id,
    birthdate: props.basicDetails.birthdate,
    mobile: props.basicDetails.mobile,
    eyes_color: props.basicDetails.eyes_color,
    hair_color: props.basicDetails.hair_color,
    religion: props.basicDetails.religion,
  },
  addressInfo: {
    profile: props.basicDetails.user_id,
    street: props.addressDetails.street,
    barangay: props.addressDetails.barangay,
    city: props.addressDetails.city,
  },
});

const saveEditAboutMe = async () => {
  await hr_api
    .patch("profile/basic_info/edit", editInfo.value)
    .then((response) => {
      if (response.status == 200) {
        // $q.notify({
        //   color: "positive",
        //   position: "top",
        //   message: "Successfully Updated",
        //   icon: "check",
        // });
      }
    });
  emit("update");
};

const city = [];
const cityOptions = ref(city);

const cityFn = async (val, update, abort) => {
  if (city.length == 0) {
    await hr_api.get("profile/address/cities").then((response) => {
      for (const c in response.data) {
        city.push(response.data[c]);
      }
    });
  }

  update(() => {
    const needle = val.toLowerCase();
    cityOptions.value = city.filter(
      (v) => v.mun_city.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>

<style lang="scss" scoped></style>
