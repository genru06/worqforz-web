<template>
  <q-form ref="addEmployeeForm" class="mx-1 grid grid-cols-1 gap-5 bg-white">
    <q-card class="my-card">
      <q-card-section class="bg-positive pt-2 pb-2 pl-3">
        <div class="text-white">Main Profile</div>
      </q-card-section>
      <q-card-section class="row q-gutter-sm">
        <q-input
          class="col"
          borderless
          v-model="basicInfo.lastname"
          dense
          type="text"
          label="Last Name :"
          :rules="[(val) => (val && val.length > 0) || 'Last Name is Required']"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="basicInfo.firstname"
          type="text"
          label="First Name :"
          :rules="[
            (val) => (val && val.length > 0) || 'First Name is Required',
          ]"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="basicInfo.middlename"
          type="text"
          label="Middle Name :"
        />
        <q-input
          borderless
          dense
          v-model="basicInfo.mobile"
          type="text"
          label="Mobile Number :"
          class="q-pt-none col"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="basicInfo.email"
          type="text"
          label="Email :"
        />
      </q-card-section>
      <q-card-section class="row q-gutter-sm">
        <q-input
          class="col"
          borderless
          dense
          v-model="addressInfo.street"
          type="text"
          label="Street :"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="addressInfo.barangay"
          type="text"
          label="Barangay :"
          :rules="[(val) => (val && val.length > 0) || 'Barangay is Required']"
        />

        <q-select
          class="col"
          dense
          filled
          v-model="addressInfo.city"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="cityOptions"
          @filter="cityFn"
          option-label="mun_city"
          option-value="city_id"
          label="Select City / Municipality"
          bg-color="white"
          @update:model-value="populateAddress"
          :rules="[(val) => val || 'Please Select a City']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-input
          class="col"
          borderless
          dense
          v-model="addressInfo.province"
          type="text"
          label="Province :"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="addressInfo.zipCode"
          type="text"
          label="Postal Code :"
        />
      </q-card-section>
      <q-card-section class="row q-gutter-sm">
        <q-input
          class="text-md col"
          filled
          dense
          v-model="basicInfo.birthdate"
          mask="date"
          label="Birthdate : "
          bg-color="white"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="basicInfo.birthdate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-select
          class="col"
          filled
          dense
          v-model="basicInfo.sex"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="genderOptions"
          @filter="filterFn"
          label="Select Gender"
          bg-color="white"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          class="col"
          filled
          dense
          v-model="basicInfo.civilStatus"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="maritalOptions"
          @filter="maritalFn"
          label="Select Civil Status"
          bg-color="white"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          class="col"
          filled
          dense
          v-model="basicInfo.religion"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="religionOptions"
          option-label="religion"
          option-value="id"
          @filter="getReligion"
          label="Select Religion"
          bg-color="white"
          :rules="[(val) => val || 'Please Select a Religion']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>
      <q-card-section class="row q-gutter-sm">
        <q-input
          class="col"
          borderless
          dense
          v-model="basicInfo.nationality"
          type="text"
          label="Nationality :"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="basicInfo.height"
          type="text"
          label="Height :"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="basicInfo.weight"
          type="text"
          label="Weight :"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="basicInfo.eyeColor"
          type="text"
          label="Color of Eyes :"
        />
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-card-section class="bg-info pt-2 pb-2 pl-3">
        <div class="text-white">Emergency Contact Information</div>
      </q-card-section>
      <q-card-section class="row q-gutter-sm">
        <q-input
          class="col"
          borderless
          dense
          v-model="emergencyInfo.name"
          type="text"
          label="Contact Name :"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="emergencyInfo.relation"
          type="text"
          label="Relation :"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="emergencyInfo.number"
          type="text"
          label="Contact Number :"
        />
      </q-card-section>
    </q-card>
    <q-card class="my-card">
      <q-card-section class="bg-negative pt-2 pb-2 pl-3">
        <div class="text-white">HR Information</div>
      </q-card-section>
      <q-card-section class="row q-gutter-sm">
        <q-select
          class="col"
          filled
          dense
          v-model="employeeInfo.workplace"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="workplaceOptions"
          @filter="workplaceFn"
          option-label="name"
          option-value="id"
          label="Workplace :"
          bg-color="white"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          class="col"
          filled
          dense
          v-model="departmentSelect"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="departmentOptions"
          @filter="departmentFn"
          option-label="department"
          option-value="id"
          label="Department :"
          bg-color="white"
          :rules="[(val) => val || 'Please Select a Department']"
          @update:model-value="fetchPosition"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          class="col"
          filled
          dense
          v-model="employeeInfo.position"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="positionOptions"
          @filter="positionFn"
          option-label="position"
          option-value="position_id"
          label="Position :"
          bg-color="white"
          :rules="[(val) => val || 'Please Select a Position']"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-input
          class="col text-md"
          dense
          filled
          v-model="employeeInfo.dateHired"
          mask="date"
          label="Date Hired : "
          bg-color="white"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="employeeInfo.dateHired">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="row q-gutter-sm">
        <q-select
          class="col"
          filled
          dense
          v-model="employeeInfo.emStatus"
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          :options="emStatusOptions"
          @filter="emStatusFn"
          option-label="employmentStatus"
          option-value="id"
          label="Employment Status :"
          bg-color="white"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> No results </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-input
          class="col"
          borderless
          dense
          v-model="employeeInfo.salary"
          type="text"
          label="Salary :"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="employeeInfo.bankAccount"
          type="text"
          label="Bank Account # :"
        />
      </q-card-section>
    </q-card>

    <q-card class="my-card">
      <q-card-section class="bg-grey pt-2 pb-2 pl-3">
        <div class="text-h6 text-black">Statutory Benefits</div>
      </q-card-section>

      <q-card-section class="row q-gutter-sm">
        <q-input
          class="col"
          borderless
          dense
          v-model="employeeInfo.sss"
          type="text"
          label="SSS # :"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="employeeInfo.philHealth"
          type="text"
          label="Philhealth # :"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="employeeInfo.pagIbig"
          type="text"
          label="Pag-Ibig # :"
        />
        <q-input
          class="col"
          borderless
          dense
          v-model="employeeInfo.tin"
          type="text"
          label="TIN :"
        />
      </q-card-section>
    </q-card>
    <q-dialog
      v-model="confirmDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section class="text-h6 text-center">
          Are you sure you want to add this Employee?
        </q-card-section>

        <q-card-actions align="right" class="text-teal bg-white">
          <q-btn class="text-red" flat label="CANCEL" v-close-popup="2" />
          <q-btn flat label="YES" @click="saveEmployee" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>

<script setup>
import { ref } from "vue";
import { hr_api } from "boot/axios";
import { date, useQuasar } from "quasar";

const $q = useQuasar();

const addEmployeeForm = ref(null);

const gender = ["Male", "Female"];
const genderOptions = ref(gender);

const marital = ["Single", "Married", "Window"];
const maritalOptions = ref(marital);

const religion = [];
const religionOptions = ref(religion);

const city = [];
const cityOptions = ref(city);

const department = [];
const departmentOptions = ref(department);
const departmentSelect = ref(null);

const pos = [];
const positionOptions = ref(pos);

const emStatus = [
  {
    id: 1,
    employmentStatus: "REGULAR",
  },
  {
    id: 2,
    employmentStatus: "CONTRACTUAL",
  },
  {
    id: 3,
    employmentStatus: "PROBATIONARY",
  },
  {
    id: 4,
    employmentStatus: "PROJECT-BASE",
  },
  {
    id: 5,
    employmentStatus: "ON-CALL",
  },
];
const emStatusOptions = ref(emStatus);

const workplace = [];
const workplaceOptions = ref(workplace);

const basicInfo = ref({
  lastname: "",
  firstname: "",
  middlename: "",
  birthdate: "",
  nationality: "Filipino",
  occupation: 0,
  accountType: 5,
  sex: "Male",
  civilStatus: "Single",
  mobile: "0",
  email: "",
  religion: 0,
  height: 0,
  weight: 0,
  eyeColor: "Black",
});

const employeeInfo = ref({
  date_hired: "",
  em_status: {
    id: 2,
    employmentStatus: "CONTRACTUAL",
  },
  position: 0,
  sss: 0,
  pag_ibig: 0,
  phil_health: 0,
  tin: 0,
  bank_account: 0,
  salary: 0,
  workplace: "",
  act_status: 1,
});

const addressInfo = ref({
  street: "",
  barangay: "",
  city: { id: 998, mun_city: "Cagayan de Oro" },
  province: "Misamis Oriental",
  zipCode: 9000,
});

const emergencyInfo = ref({
  name: "",
  number: "",
  relation: "",
});

const filterFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    genderOptions.value = gender.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const maritalFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    maritalOptions.value = marital.filter(
      (v) => v.toLowerCase().indexOf(needle) > -1
    );
  });
};

const emStatusFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    emStatusOptions.value = emStatus.filter(
      (v) => v.employmentStatus.toLowerCase().indexOf(needle) > -1
    );
  });
};

const departmentFn = async (val, update, abort) => {
  if (department.length == 0) {
    await hr_api.get("employee/department/all").then((response) => {
      for (const c in response.data) {
        department.push(response.data[c]);
      }
    });
  }

  update(() => {
    const needle = val.toLowerCase();
    departmentOptions.value = department.filter(
      (v) => v.department.toLowerCase().indexOf(needle) > -1
    );
  });
};

const fetchPosition = async () => {
  const dept_id = departmentSelect.value.department;

  const needle = dept_id.toLowerCase();
  const details = department.filter(
    (v) => v.department.toLowerCase().indexOf(needle) > -1
  );
  const position = details[0].position;
  for (const p in position) {
    pos.push(position[p]);
  }
};

const positionFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase();
    positionOptions.value = pos.filter(
      (v) => v.position.toLowerCase().indexOf(needle) > -1
    );
  });
};

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

const populateAddress = () => {
  addressInfo.value.zipCode = addressInfo.value.city.zip_code;
  addressInfo.value.province = addressInfo.value.city.province.name;
};

const getReligion = async (val, update, abort) => {
  if (religion.length == 0) {
    await hr_api.get("profile/religion/all").then((response) => {
      for (const res in response.data) {
        religion.push(response.data[res]);
      }
    });
  }

  update(() => {
    const needle = val.toLowerCase();
    religionOptions.value = religion.filter(
      (v) => v.religion.toLowerCase().indexOf(needle) > -1
    );
  });
};

const getWorkplace = async () => {
  await hr_api.get("profile/workplace/all").then((response) => {
    for (const res in response.data) {
      workplaceOptions.value.push(response.data[res]);
    }
  });
};

const showPopUp = (popModel) => {
  popModel.show();
};

const confirmDialog = ref();

const emit = defineEmits(["closeAddForm"]);

const addEmployee = () => {
  // const bday = new Date(bdate.value);
  confirmDialog.value = true;
};
const saveEmployee = () => {
  addEmployeeForm.value.validate().then(async (success) => {
    if (success) {
      const formData = {
        basicInfo: basicInfo.value,
        employeeInfo: employeeInfo.value,
        addressInfo: addressInfo.value,
        emergencyInfo: emergencyInfo.value,
      };
      await hr_api.post("profile/create", formData).then((result) => {
        // emit('closeAddForm');
        if (result.data.status) {
        }
        $q.notify({
          color: result.data.color,
          position: "top",
          message: result.data.msg,
          icon: result.data.icon,
        });
      });
    }
  });
};
getWorkplace();
defineExpose({ addEmployee });
</script>

<style lang="scss" scoped></style>
