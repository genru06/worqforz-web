<template>
  <div>
    <q-tabs align="justify" v-model="tab" class="text-primary">
      <q-tab name="items" label="Addition / Deduction Items" />
      <q-tab name="sched" label="Premium Deduction Schedule / details" />
      <q-tab name="sssTable" label="SSS Table Matrix" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="items">
        <q-table
          :table-style="
            'counter-reset: cssRowCounter ' +
            (pagination.page - 1) * pagination.rowsPerPage +
            ';'
          "
          title="List of Items"
          :rows="itemRows"
          :columns="columns"
          dense
          :pagination="{
            rowsPerPage: 20,
          }"
          :rows-per-page-options="[10, 20, 50]"
        >
          <template v-slot:body-cell-id>
            <q-td>
              <span class="rowNumber"></span>
            </q-td>
          </template>
          <template v-slot:body-cell-pi_show="props">
            <q-td :props="props">
              <q-icon
                :name="props.value ? 'check_circle' : 'cancel'"
                :color="props.value ? 'green' : 'red'"
                size="18px"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-pi_is_recurring="props">
            <q-td :props="props">
              <q-icon
                :name="props.value ? 'check_circle' : 'cancel'"
                :color="props.value ? 'green' : 'red'"
                size="18px"
              />
            </q-td>
          </template>
          <template v-slot:top-right="">
            <q-btn
              color="primary"
              icon="add"
              label="Add An item"
              @click="addItemModal = true"
            />
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                class="q-mr-xs"
                dense
                color="positive"
                size="xs"
                icon="edit"
                @click="
                  (itemForm = props.row),
                    (addItemModal = true),
                    (actionType = 'Edit')
                "
              />
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>
      <q-tab-panel name="sched">
        <div class="row items-center justify-center">
          <q-table
            :table-style="
              'counter-reset: cssRowCounter ' +
              (pagination.page - 1) * pagination.rowsPerPage +
              ';'
            "
            class="col-lg-8"
            title="Add / Deduction Schedule"
            :rows="scheduleRows"
            :columns="scheduleColumns"
            row-key="name"
            dense
          >
            <template v-slot:top-right="">
              <q-btn
                color="primary"
                icon="add"
                dense
                label="Add A Schedule"
                @click="addDeductModal = true"
              />
            </template>
            <template v-slot:body-cell-id>
              <q-td>
                <span class="rowNumber"></span>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-tab-panel>
      <q-tab-panel name="sssTable">
        <div class="text-h6">SSS Table</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
    <q-dialog v-model="addItemModal">
      <q-card style="width: 300px">
        <q-bar dark class="bg-primary text-white">
          <div class="col text-left text-weight-bold">
            {{ actionType }} an Item
          </div>
          <q-space />
          <q-btn
            @click="addItemModal = false"
            dense
            flat
            round
            icon="close"
            size="8.5px"
            color="red"
          />
        </q-bar>
        <q-card-section class="row items-center">
          <q-input
            dense
            class="col-12"
            v-model="itemForm.pi_item_name"
            type="text"
            label="Item Name"
          />
          <q-select
            v-model="itemForm.pi_item_type"
            :options="itemOptions"
            label="Item Type"
            class="col-12"
            dense
          />
          <q-input
            dense
            class="col-12"
            v-model="itemForm.pi_formula"
            type="text"
            label="Item Formula"
          />
          <q-toggle
            v-model="itemForm.pi_show"
            label="Include in Current Payroll"
            color="green"
            left-label
          />
          <q-toggle
            v-model="itemForm.pi_is_recurring"
            label="Is Item Recurring ?"
            color="green"
            left-label
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="SUBMIT" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addDeductModal">
      <q-card style="width: 350px">
        <q-bar dark class="bg-primary text-white">
          <div class="col text-left text-weight-bold">Add a Schedule</div>
          <q-space />
          <q-btn
            dense
            flat
            round
            icon="close"
            size="8.5px"
            color="white"
            v-close-popup
          />
        </q-bar>
        <q-card-section class="q-py-none row">
          <q-select
            class="q-pa-none col"
            dense
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            v-model="formInput.profile"
            :options="profileOptions"
            @filter="profileFn"
            :option-label="(v) => v.name"
            :option-value="(v) => v.user_id"
            label="Search Employee"
            bg-color="white"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No results </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>
        <q-card-section class="row q-py-none">
          <q-select
            class="col"
            v-model="formInput.payroll_item"
            :options="payrollItems"
            label="Payroll Item"
            :option-label="(v) => v.pi_item_name"
            :option-value="(v) => v.pi_item_id"
            dense
          />
        </q-card-section>
        <q-card-section class="q-py-none row">
          <q-input
            dense
            class="col"
            v-model="formInput.startDate"
            label="Start Date"
            mask="date"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="formInput.startDate">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>
        <q-card-section class="q-py-none row">
          <q-input
            dense
            type="number"
            class="col"
            v-model="formInput.amount"
            label="Amount"
          />
        </q-card-section>
        <q-card-section class="q-py-none row">
          <q-input
            dense
            type="number"
            class="col"
            v-model="formInput.frequency"
            label="Frequency"
          />
        </q-card-section>
        <q-card-section class="q-pt-none row">
          <q-input
            dense
            type="number"
            class="col"
            v-model="formInput.months"
            label="Months"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="Clear"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
          <q-btn
            :loading="submitting"
            label="Save"
            type="submit"
            color="primary"
            @click="submitAddDeductSchedule"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { date } from "quasar";
import { hr_api } from "src/boot/axios";
import { ref } from "vue";

const tab = ref("sched");
const actionType = ref("ADD");
const addItemModal = ref(false);
const addDeductModal = ref(false);
const itemRows = ref([]);
const scheduleRows = ref([]);
const submitting = ref(false);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 15,
  // rowsNumber: xx if getting data from a server
});

const profile = [];
const profileOptions = ref(profile);

const payrollItems = ref();

const formInput = ref({
  profile: {
    name: "",
  },
  payroll_item: "",
  amount: "0.00",
  startDate: date.formatDate("YYYY-MM-DD", Date.now()),
  frequency: 0,
  months: 0,
});

const submitAddDeductSchedule = async () => {
  console.log(formInput.value);
  await hr_api
    .post("payroll/save/add-deduct-sched", formInput.value)
    .then((response) => {
      console.log(response.data);
      loadAddDeductSchedule();
    });
};

const profileFn = async (val, update, abort) => {
  if (profile.length == 0) {
    await hr_api.get("profile/all/1").then((response) => {
      for (const c of response.data) {
        profile.push({
          user_id: c.user_id,
          name: c.lastname + (c.lastname ? ", " : "") + c.firstname,
        });
      }
    });
  }
  update(() => {
    const needle = val.toLowerCase();
    profileOptions.value = profile.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const itemForm = ref({
  pi_item_name: "",
  pi_item_type: "",
  pi_formula: "",
  pi_default: 0,
  pi_show: false,
  pi_is_recurring: false,
});

const itemOptions = [
  {
    value: 0,
    label: "Deduction",
  },
  {
    value: 1,
    label: "Addition",
  },
];

const scheduleColumns = [
  {
    name: "id",
    required: true,
    label: "#",
    align: "left",
    field: "id",
  },
  {
    name: "employee",
    required: true,
    label: "Employee",
    align: "left",
    field: "employee",
  },
  {
    name: "item_id",
    required: true,
    label: "Item",
    align: "left",
    field: "item_id",
  },
  {
    name: "amount",
    required: true,
    label: "Amount",
    align: "center",
    field: "amount",
  },
  {
    name: "startDate",
    required: true,
    label: "Start Date",
    align: "center",
    field: "startDate",
  },
  {
    name: "months",
    required: true,
    label: "No of Months",
    align: "center",
    field: "months",
  },
  {
    name: "actions",
    required: true,
    label: "",
    align: "left",
    field: "actions",
  },
];

const columns = [
  {
    name: "id",
    required: true,
    label: "#",
    align: "left",
    field: "id",
  },
  {
    name: "pi_item_name",
    required: true,
    label: "Item Name",
    align: "left",
    field: "pi_item_name",
  },
  {
    name: "pi_item_type",
    required: true,
    label: "Item Type",
    align: "left",
    field: "pi_item_type",
    format: (val) => (val ? "Addition" : "Deduction"),
  },
  // {
  //   name: "pi_pr_column",
  //   required: true,
  //   label: "Payroll Column Alias",
  //   align: "left",
  //   field: "pi_pr_column",
  // },
  {
    name: "pi_formula",
    required: true,
    label: "Item Formula",
    align: "left",
    field: "pi_formula",
  },
  {
    name: "pi_show",
    required: true,
    label: "Included in Current Payroll",
    align: "center",
    field: "pi_show",
  },
  {
    name: "pi_is_recurring",
    required: true,
    label: "Is Recurring",
    align: "center",
    field: "pi_is_recurring",
  },
  {
    name: "actions",
    required: true,
    label: "",
    align: "center",
    field: "actions",
  },
];

const loadPayrollItems = async () => {
  await hr_api.get("payroll/items/all").then((response) => {
    itemRows.value = response.data;
    payrollItems.value = response.data;
  });
};

const loadAddDeductSchedule = async () => {
  await hr_api.get("payroll/add-deduct-sched/all").then((response) => {
    scheduleRows.value = response.data;
  });
};

loadPayrollItems();
loadAddDeductSchedule();
</script>

<style lang="scss" scoped>
.rowNumber::before {
  counter-increment: cssRowCounter;
  content: counter(cssRowCounter);
}
</style>
