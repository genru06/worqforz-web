<template>
  <div>
    <q-card class="my-card q-pa-none">
      <q-card-section class="q-pa-none">
        <q-table
          title=""
          :rows="insuranceDetails"
          :columns="columns"
          row-key="id"
          hide-bottom
        >
          <template v-slot:top>
            <q-space />
            <q-btn
              color="primary"
              :disable="loading"
              label="Add Insurance"
              icon="add"
              @click="insuranceForm = true"
              size="10px"
              dense
            />
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <div v-if="col.name != 'beneficiaries'">
                  {{ col.value }}
                </div>
                <div v-if="col.name == 'beneficiaries'">
                  <q-btn
                    size="sm"
                    color="accent"
                    round
                    dense
                    @click="props.expand = !props.expand"
                    :icon="props.expand ? 'remove' : 'add'"
                  />
                </div>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <q-table
                    title="Beneficiaries"
                    :rows="props.row.beneficiaries"
                    :columns="benColumns"
                    row-key="name"
                  >
                    <template v-slot:top>
                      <q-space />
                      <q-btn
                        color="accent"
                        :disable="loading"
                        label="Add Beneficiaries"
                        icon="add"
                        @click="
                          (addBeneficiary = true),
                            (selectedInsurance = props.row.id)
                        "
                        size="10px"
                        dense
                      />
                    </template>
                    <template v-slot:body-cell-age="props">
                      <q-td :props="props">
                        {{ calcAge(props.row.date_of_birth) }}
                      </q-td>
                    </template>
                  </q-table>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-dialog v-model="insuranceForm" persistent>
      <q-card style="width: 350px !important">
        <q-bar dark class="bg-primary text-white">
          <div class="col text-left text-weight-bold">Add Insurance</div>
          <q-btn
            dense
            round
            icon="close"
            size="7px"
            v-close-popup
            color="red"
          />
        </q-bar>
        <q-card-section class="row items-center">
          <q-input
            class="col-12"
            v-model="addInsuranceForm.policy_num"
            type="text"
            dense
            label="Policy #"
          />
          <q-input
            class="text-md col-12"
            dense
            v-model="addInsuranceForm.date_remitted"
            mask="date"
            label="Date of Remittance : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="addInsuranceForm.date_remitted">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            class="text-md col-12"
            dense
            v-model="addInsuranceForm.date_insured"
            mask="date"
            label="Date Insured : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="addInsuranceForm.date_insured">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            class="text-md col-12"
            dense
            v-model="addInsuranceForm.date_expired"
            mask="date"
            label="Date of Expiration : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="addInsuranceForm.expired">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-select
            class="col-12"
            dense
            v-model="addInsuranceForm.type"
            :options="insuranceType"
            option-label="insurance_type"
            option-value="id"
            label="Insurance Type"
          />
          <q-select
            class="col-12"
            dense
            v-model="addInsuranceForm.supplier"
            :options="insuranceSupplier"
            option-label="short_name"
            option-value="id"
            label="Supplier"
          />
          <q-input
            v-model="addInsuranceForm.premium"
            class="col-12"
            type="text"
            label="Premium"
            dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            dense
            size="12px"
            label="ADD"
            color="primary"
            @click="confirm = true"
          />
        </q-card-actions>
      </q-card>
      <q-dialog v-model="confirm" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm"
              >Are you sure you want to add this insurance?</span
            >
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              dense
              size="12px"
              label="No"
              color="primary"
              v-close-popup="2"
            />
            <q-btn
              dense
              size="12px"
              label="yes"
              @click="addInsurance"
              color="primary"
              v-close-popup="2"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-dialog>
    <q-dialog v-model="addBeneficiary" persistent>
      <q-card style="width: 350px !important">
        <q-bar dark class="bg-primary text-white">
          <div class="col text-left text-weight-bold">Add Beneficiary</div>
          <q-btn
            dense
            round
            icon="close"
            size="7px"
            v-close-popup
            color="red"
          />
        </q-bar>
        <q-card-section class="row items-center">
          <q-input
            class="col-12"
            v-model="addBeneficiaryForm.name_of_beneficiary"
            type="text"
            dense
            label="Name"
          />
          <q-input
            class="text-md col-12"
            dense
            v-model="addBeneficiaryForm.date_of_birth"
            mask="date"
            label="Date of Birth : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="addBeneficiaryForm.date_of_birth">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            class="col-12"
            v-model="addBeneficiaryForm.relationship"
            type="text"
            dense
            label="Relationship"
          />
          <q-input
            class="col-12"
            v-model="addBeneficiaryForm.contact_number"
            type="text"
            dense
            label="Contact Number"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            dense
            size="10px"
            @click="saveBeneficiary"
            label="Add"
            color="primary"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { ref } from "vue";
import { hr_api } from "../../boot/axios";

const props = defineProps({
  profile: [],
});

const $q = useQuasar();
const confirm = ref(false);
const addBeneficiary = ref(false);
const insuranceDetails = ref([]);
const benRows = ref([]);
const insuranceForm = ref(false);
const insuranceSupplier = ref({});
const insuranceType = ref({});
const beneficiaries = ref([]);
const selectedInsurance = ref();
const benColumns = [
  {
    name: "name_of_beneficiary",
    label: "Name",
    align: "center",
    field: "name_of_beneficiary",
  },
  {
    name: "date_of_birth",
    label: "Date of Birth",
    align: "center",
    field: "date_of_birth",
  },
  {
    name: "age",
    label: "Age",
    align: "center",
    field: "age",
  },
  {
    name: "relationship",
    label: "Relationship",
    align: "center",
    field: "relationship",
  },
  {
    name: "contact_number",
    label: "Contact Number",
    align: "center",
    field: "contact_number",
  },
];
const columns = [
  {
    name: "policy_num",
    label: "Policy #",
    align: "center",
    field: "policy_num",
  },
  {
    name: "premium",
    label: "Premium",
    align: "center",
    field: "premium",
  },
  {
    name: "date_insured",
    label: "Date Insured",
    align: "center",
    field: "date_insured",
  },
  {
    name: "date_expired",
    label: "Date of Expiry",
    align: "center",
    field: "date_expired",
  },
  {
    name: "type",
    label: "Type of Insurance",
    align: "center",
    field: "type",
  },
  {
    name: "beneficiaries",
    label: "Beneficiary",
    align: "center",
    field: "beneficiaries",
  },
];

const addInsuranceForm = ref({
  profile: props.profile.user_id,
  policy_num: "",
  date_insured: date.formatDate(Date.now(), "YYYY-MM-DD"),
  date_expired: date.formatDate(Date.now(), "YYYY-MM-DD"),
  date_remitted: date.formatDate(Date.now(), "YYYY-MM-DD"),
  type: {},
  coverage: "",
  supplier: {},
  premium: 0,
});

const addBeneficiaryForm = ref({
  name_of_beneficiary: "",
  date_of_birth: date.formatDate(Date.now(), "YYYY-MM-DD"),
  relationship: "",
  contact_number: "",
  insurance: 0,
});

const addInsurance = async () => {
  await hr_api
    .post("insurance/add", addInsuranceForm.value)
    .then((response) => {
      console.log(response);
      $q.notify({
        color: "positive",
        position: "top",
        message: "Successfully Saved",
        icon: "done",
      });
      fetchInsurance();
    });
};

const calcAge = (bdate) => {
  const dateNow = new Date();
  let age = date.getDateDiff(dateNow, bdate, "years");
  console.log(age);
  return age;
};

const saveBeneficiary = async () => {
  console.log(selectedInsurance.value);
  addBeneficiaryForm.value["insurance"] = selectedInsurance.value;
  await hr_api
    .post("insurance/beneficiary/add", addBeneficiaryForm.value)
    .then((response) => {
      $q.notify({
        color: "positive",
        position: "top",
        message: "Successfully Saved",
        icon: "done",
      });
      fetchInsurance();
    });
};

const fetchInsurance = async () => {
  hr_api.get("insurance/profile/" + props.profile.user_id).then((response) => {
    let ins = [];
    for (const i of response.data) {
      ins.push({
        id: i.id,
        policy_num: i.policy_num,
        premium: i.premium,
        date_insured: i.date_insured,
        date_expired: i.date_expired,
        type: i.type.insurance_type,
        beneficiaries: i.insuranceBen,
      });
    }
    insuranceDetails.value = ins;
  });
};

const fetchInsuranceConstants = async () => {
  await hr_api.get("insurance/constants").then((response) => {
    insuranceType.value = response.data.type;
    insuranceSupplier.value = response.data.supplier;
    fetchInsurance();
  });
};

fetchInsuranceConstants();
</script>

<style lang="scss" scoped></style>
