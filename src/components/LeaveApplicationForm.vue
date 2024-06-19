<template>
  <div class="col-lg-md">
    <q-card>
      <q-bar>
        <q-icon name="add" />
        <div>Leave Application Form</div>

        <q-space />

        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip>Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section class="row column items-end">
        <q-input
          dense
          v-model="form.date_filed"
          mask="date"
          label="Date Filed : "
          bg-color="white"
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="form.date_filed">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="row q-gutter-md q-pt-none">
        <div class="col">
          <q-input
            dense
            v-model="form.l_from"
            mask="date"
            label="From : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="form.l_from">
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
            v-model="form.l_to"
            mask="date"
            label="To : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="form.l_to">
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
        <q-select
          class="q-pb-none"
          dense
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          v-model="form.profile"
          :options="profileOptions"
          @filter="profileFn"
          :option-label="(v) => v.firstname + ' ' + v.lastname"
          option-value="user_id"
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
      <q-card-section class="row q-gutter-md q-pt-none">
        <div class="col">
          <q-select
            dense
            v-model="form.type_id"
            :options="leaveTypeOptions"
            option-label="leave_type"
            option-value="id"
            label="Leave Type"
          />
        </div>
        <div class="col">
          <q-select
            dense
            v-model="form.shifting"
            :options="timeShiftOptions"
            option-label="shifting_type"
            option-value="shift_id"
            label="Time Shift"
          />
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input v-model="form.reason" filled type="textarea" label="Reason" />
      </q-card-section>
      <q-card-actions horizontal align="right">
        <q-btn
          @click="confirm = true"
          color="positive"
          size="sm"
          label="Submit"
        />
        <q-btn color="negative" size="sm" label="Cancel" v-close-popup />
      </q-card-actions>
    </q-card>

    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm"
            >Are you sure you want to Submit this Leave Application</span
          >
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            dense
            label="Submit Leave Application"
            @click="submitLeaveApplication"
            color="positive"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { date } from "quasar";
import { hr_api } from "src/boot/axios";
import { ref } from "vue";

const form = ref({
  no_days: 0,
  l_from: date.formatDate(Date.now(), "YYYY-MM-DD"),
  l_to: date.formatDate(Date.now(), "YYYY-MM-DD"),
  reason: "",
  shifting: "",
  status: 0,
  date_filed: date.formatDate(Date.now(), "YYYY-MM-DD"),
  date_resumed: "0000-00-00",
  date_extend: "0000-00-00",
  profile: {
    lastname: "",
    firstname: "",
  },
});
const profile = [];
const profileOptions = ref(profile);
const confirm = ref(false);
const leaveTypeOptions = ref([]);
const timeShiftOptions = ref([]);
const emit = defineEmits(["updateLeaveForApproval"]);

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

const fetchLeaveType = async () => {
  await hr_api.get("leave/type/all").then((res) => {
    leaveTypeOptions.value = res.data;
  });
};

const fetchTimeShifting = async () => {
  await hr_api.get("employee/shifting").then((res) => {
    timeShiftOptions.value = res.data;
  });
};

const submitLeaveApplication = async () => {
  form.value.type_id = form.value.type_id.id;
  form.value.shifting = form.value.shifting.shifting_type;
  const no_days = date.getDateDiff(form.value.l_to, form.value.l_from, "days");
  form.value.no_days = no_days + 1;
  await hr_api.post("leave/submit-application", form.value).then((response) => {
    emit("updateLeaveForApproval", response.data);
    confirm.value = false;
  });
};

fetchLeaveType();
fetchTimeShifting();
</script>

<style scoped></style>
