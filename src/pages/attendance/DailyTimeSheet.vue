<template>
  <div>
    <HeaderLayout mainTitle="Time Attendance" moduleTitle="Daily Time Sheet">
      <q-btn
        v-if="!isTL"
        outline
        color="grey-8"
        to="/dashboard"
        label="Dashboard"
      />
      <q-btn
        v-if="isTL"
        outline
        color="grey-8"
        to="/tl-dashboard"
        label="Dashboard"
      />
      <q-btn
        v-if="!isTL"
        outline
        color="grey-8"
        to="/payroll/man-hours"
        label="View Man Hours"
      />
      <q-btn
        v-if="!isTL"
        outline
        color="grey-8"
        @click="addTimeAttendanceModal = true"
        label="Add Time Attendance"
      />
    </HeaderLayout>
    <q-separator spaced inset />
    <div class="q-pa-md">
      <q-markup-table class="gt-md" separator="cell">
        <thead>
          <tr>
            <th colspan="100%">
              <div class="row justify-between">
                <div class="col-lg-4">
                  <q-input
                    class="text-md col-lg-3"
                    borderless
                    dense
                    v-model="attendance_date"
                    mask="date"
                    label="Attendance Date : "
                    bg-color="white"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date v-model="attendance_date">
                            <div class="row items-center justify-end">
                              <q-btn
                                @click="fetchDailyAttendance"
                                v-close-popup
                                label="Fetch"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>

                      <q-btn
                        :disable="details.length == 0"
                        dense
                        color="teal"
                        size="md"
                        icon="thumb_up_alt"
                        label="Approve Timesheet"
                        @click="approveTimesheet"
                      />
                    </template>
                  </q-input>
                </div>
                <span class="text-h6 q-pa-md">{{ day }}</span>
              </div>
            </th>
          </tr>
          <tr>
            <th rowspan="2">
              # <br /><q-checkbox
                dense
                v-model="selectAll"
                @click="selectAllTimesheet"
              />
            </th>
            <th class="text-center text-weight-bolder" rowspan="2">NAMES</th>
            <td class="text-center" rowspan="2">POSITION</td>
            <th class="text-center" colspan="5">TIME</th>
            <th class="text-center" colspan="3">OVERTIME</th>
            <th class="text-center" rowspan="2">REMARKS</th>
            <th class="text-center" rowspan="2"></th>
          </tr>
          <tr>
            <td class="text-center">IN</td>
            <td class="text-center">OUT</td>
            <td class="text-center">IN PM</td>
            <td class="text-center">OUT PM</td>
            <td class="text-center">HOURS</td>
            <td class="text-center">IN</td>
            <td class="text-center">OUT</td>
            <td class="text-center">HOURS</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="d in details"
            :key="d.att_id"
            :class="d.pr_status ? 'bg-green-3' : ''"
          >
            <td>
              <q-checkbox
                v-if="d.pr_status"
                dense
                v-model="selected[d.att_id]"
                @click="voidSelected(d)"
              />
              <q-checkbox
                v-if="!d.pr_status"
                dense
                v-model="selected[d.att_id]"
                @click="selectOne(d)"
              />
            </td>
            <td class="text-left">{{ d.name }}</td>
            <td>{{ d.position }}</td>
            <td v-if="d.pr_status">
              {{ date.formatDate(d.date + " " + d.time_in, "hh:mm a") }}
            </td>
            <td
              v-if="!d.pr_status"
              @click="
                editHours(d.att_id, 'time_in'), (employee_id = d.employee_id)
              "
            >
              {{ date.formatDate(d.date + " " + d.time_in, "hh:mm a") }}
            </td>
            <td v-if="d.pr_status">
              {{ date.formatDate(d.date + " " + d.time_out, "hh:mm a") }}
            </td>
            <td
              v-if="!d.pr_status"
              @click="
                editHours(d.att_id, 'time_out'), (employee_id = d.employee_id)
              "
            >
              {{ date.formatDate(d.date + " " + d.time_out, "hh:mm a") }}
            </td>
            <td v-if="d.pr_status">
              {{ date.formatDate(d.date + " " + d.time_in_pm, "hh:mm a") }}
            </td>
            <td
              v-if="!d.pr_status"
              @click="
                editHours(d.att_id, 'time_in_pm'), (employee_id = d.employee_id)
              "
            >
              {{ date.formatDate(d.date + " " + d.time_in_pm, "hh:mm a") }}
            </td>
            <td v-if="d.pr_status">
              {{ date.formatDate(d.date + " " + d.time_out_pm, "hh:mm a") }}
            </td>
            <td
              v-if="!d.pr_status"
              @click="
                editHours(d.att_id, 'time_out_pm'),
                  (employee_id = d.employee_id)
              "
            >
              {{ date.formatDate(d.date + " " + d.time_out_pm, "hh:mm a") }}
            </td>
            <td>
              {{ d.total_reg_hours }}
            </td>
            <td v-if="d.pr_status">
              {{ d.time_in_ot }}
            </td>
            <td
              v-if="!d.pr_status"
              @click="
                editHours(d.att_id, 'time_in_ot'), (employee_id = d.employee_id)
              "
            >
              {{ d.time_in_ot }}
            </td>
            <td v-if="d.pr_status">
              {{ d.time_out_ot }}
            </td>
            <td
              v-if="!d.pr_status"
              @click="
                editHours(d.att_id, 'time_out_ot'),
                  (employee_id = d.employee_id)
              "
            >
              {{ d.time_out_ot }}
            </td>
            <td>
              {{ d.totalOT }}
            </td>
            <td>
              {{ d.remarks }}
            </td>
            <td>
              <q-btn
                dense
                size="12px"
                flat
                icon="punch_clock"
                @click="viewDTR(d)"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
      <div class="row justify-between lt-lg">
        <div class="col-lg-4">
          <q-input
            class="text-md col-lg-3"
            borderless
            dense
            v-model="attendance_date"
            mask="date"
            label="Attendance Date : "
            bg-color="white"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="attendance_date">
                    <div class="row items-center justify-end">
                      <q-btn
                        @click="fetchDailyAttendance"
                        v-close-popup
                        label="Fetch"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>

              <q-btn
                :disable="details.length == 0"
                dense
                color="teal"
                size="md"
                icon="thumb_up_alt"
                label="Approve Timesheet"
                @click="approveTimesheet"
              />
            </template>
          </q-input>
        </div>
        <span class="text-h6 text-center q-pa-md">{{ day }}</span>
      </div>
      <q-card
        class="my-card q-mb-md lt-lg"
        v-for="d in details"
        :key="d.att_id"
      >
        <q-card-section class="q-pb-none">
          <div class="text-h6 text-center">{{ d.name }}</div>
        </q-card-section>
        <q-card-section class="row q-pb-none">
          <div class="col text-center">
            IN <q-separator spaced />
            {{ date.formatDate(d.date + " " + d.time_in, "hh:mm a") }}
          </div>
          <q-separator spaced vertical />
          <div class="col text-center">
            OUT <q-separator spaced />
            {{ date.formatDate(d.date + " " + d.time_out, "hh:mm a") }}
          </div>
          <q-separator spaced vertical />
          <div class="col text-center">
            IN PM <q-separator spaced />
            {{ date.formatDate(d.date + " " + d.time_in_pm, "hh:mm a") }}
          </div>
          <q-separator spaced vertical />
          <div class="col text-center">
            OUT PM <q-separator spaced />
            {{ date.formatDate(d.date + " " + d.time_out_pm, "hh:mm a") }}
          </div>
          <q-separator spaced vertical class="q-ma-none" />
          <div class="col text-center">
            OT IN <q-separator spaced />
            {{ d.time_in_ot }}
          </div>
          <q-separator spaced vertical />
          <div class="col text-center">
            OT OUT <q-separator spaced />
            {{ d.time_out_ot }}
          </div>
        </q-card-section>
        <q-separator class="q-mt-xs" />
        <q-card-section class="row q-pa-sm">
          <q-separator spaced vertical />
          <div class="col text-center">Total Hours</div>
          <q-separator spaced vertical />
          <div class="col text-center">{{ d.total_reg_hours }}</div>
          <q-separator spaced vertical />
          <div class="col text-center">Total OT Hours</div>
          <q-separator spaced vertical />
          <div class="col text-center">
            {{ d.totalOT }}
          </div>
        </q-card-section>
      </q-card>
      <q-dialog v-model="editManHours">
        <q-card>
          <q-card-section class="row items-center">
            <q-input
              class="col text-center"
              style="font-size: 25px; font-weight: bold"
              v-model="editTime"
              type="time"
              label="Set Time"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="editTime">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-card-section>
          <q-card-actions align="center" vertical>
            <q-btn
              @click="updateTimesheet"
              label="Update Timesheet"
              color="positive"
              style="width: 100%"
              v-close-popup
            />
            <q-btn
              @click="confirm = true"
              label="Removed Timesheet"
              color="warning"
              style="width: 100%"
            />
            <q-btn
              @click="removeTime"
              label="Removed Time"
              color="negative"
              style="width: 100%"
              v-close-popup
            />
            <q-btn
              @click="timeShiftModal = true"
              label="Update Time Shift"
              color="teal"
              style="width: 100%"
              v-close-popup
            />
            <q-btn
              label="Cancel"
              color="primary"
              style="width: 100%"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
        <q-dialog v-model="confirm" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <q-avatar
                icon="priority_high"
                color="primary"
                text-color="white"
              />
              <span class="q-ml-lg col-lg-10"
                >Are you sure you want to remove Timesheet, please note that you
                cannot undo this process</span
              >
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup="2" />
              <q-btn
                label="YES"
                @click="removeTimesheet"
                color="positive"
                v-close-popup="2"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-dialog>
      <q-dialog v-model="addTimeAttendanceModal">
        <q-card>
          <q-card-section class="row items-center">
            <q-select
              class="q-pb-none col-12"
              dense
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              v-model="employee"
              :options="profileOptions"
              @filter="profileFn"
              :option-label="(v) => v.firstname + ' ' + v.lastname"
              :option-value="(v) => v.employee_id"
              label="Search Employee"
              bg-color="white"
              :rules="[(val) => val || 'Please select an Employee']"
              @update:model-value="(v) => fetchAddSelectedEmployee(v)"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-input
              class="col-12 text-center"
              style="font-size: 25px; font-weight: bold"
              v-model="addTime"
              type="time"
              label="Set Time"
            >
              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="addTime">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-select
              v-model="timeStatus"
              :options="options"
              label="Time Status"
              class="col-12"
              dense
              use-input
              hide-selected
              fill-input
              option-value="value"
              option-label="label"
            />
          </q-card-section>
          <q-card-actions align="center" vertical>
            <q-btn
              @click="addTimesheet"
              label="Add Timesheet"
              color="positive"
              style="width: 100%"
              v-close-popup
            />
            <q-btn
              label="Cancel"
              color="primary"
              style="width: 100%"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="timeShiftModal" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-select
              dense
              v-model="timeShiftSelect"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="timeShiftOptions"
              :option-label="
                (v) => formatTime(v.ps_from) + ' - ' + formatTime(v.ps_to)
              "
              option-value="ps_id"
              @filter="getTimeshift"
              label="Time Shift Schedule"
              bg-color="white"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn
              flat
              label="Update Time Shift"
              @click="updateTimeShift"
              color="primary"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <q-dialog v-model="dtrModal" full-width persistent>
      <q-card style="width: 60vw !important">
        <dtr
          :details="employeeDTR"
          :att_date="attendance_date"
          @loadAttendance="(att_date) => getAttendance(att_date)"
        />
      </q-card>
    </q-dialog>
    <!-- <q-dialog v-model="dtrModal">
      <dtr :details="employeeDTR" />
      <q-card style="width: 980px !important">
        <q-card-section>
          
        </q-card-section>
      </q-card>
    </q-dialog> -->
  </div>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { hr_api } from "../../boot/axios";
import HeaderLayout from "../../layouts/HeaderLayout.vue";
import dtr from "../../components/payroll/DailyTimeRecord.vue";

const $q = useQuasar();
const route = useRoute();
const attendance_date = ref(date.formatDate(Date.now(), "YYYY-MM-DD"));
const day = ref();
const editManHours = ref();
const editTime = ref(date.formatDate(Date.now(), "hh:mm a"));
const addTime = ref(date.formatDate(Date.now(), "hh:mm a"));
const details = ref([]);
const employee_id = ref();
const att_id = ref();
const column = ref();
const selected = ref({});
const selectAll = ref(false);
const confirm = ref(false);
const addTimeAttendanceModal = ref(false);
const timeStatus = ref({ value: "time_in", label: "TIME IN" });
const profile = [];
const profileOptions = ref(profile);
const employee = ref();
const isTL = ref(true);
const timeShiftModal = ref(false);
const timeShift = [];
const timeShiftOptions = ref(timeShift);
const timeShiftSelect = ref();
const dtrModal = ref(false);
const employeeDTR = ref();

isTL.value =
  localStorage.getItem("is_TL") == null ||
  localStorage.getItem("is_TL") == "undefined" ||
  localStorage.getItem("is_TL") == "null"
    ? false
    : true;

let selectedData = {};
let filterTrue = 0;
let s = [];
let workplace = route.params.workplace;

const getAttendance = async (att_date) => {
  attendance_date.value = att_date;
  await fetchDailyAttendance();
  dtrModal.value = false;
};

const viewDTR = (details) => {
  dtrModal.value = true;
  employeeDTR.value = details;
};

const options = ref([
  {
    value: "time_in",
    label: "TIME IN AM",
  },
  {
    value: "time_out",
    label: "TIME OUT AM",
  },
  {
    value: "time_in_pm",
    label: "TIME IN PM",
  },
  {
    value: "time_out_pm",
    label: "TIME OUT PM",
  },
  {
    value: "time_in_ot",
    label: "TIME IN OT",
  },
  {
    value: "time_out_ot",
    label: "TIME OUT OT",
  },
]);

const fetchAddSelectedEmployee = (details) => {
  console.log(details);
};

const profileFn = async (val, update, abort) => {
  if (profile.length == 0) {
    await hr_api.get("profile/all/1").then((response) => {
      for (const c in response.data) {
        profile.push({
          employee_id: response.data[c].employee.employee_id,
          name: response.data[c].lastname + " " + response.data[c].firstname,
          lastname: response.data[c].lastname,
          firstname: response.data[c].firstname,
          time_shift_id: response.data[c].employee.shift_group_id
            ? response.data[c].employee.shift_group_id.grp_id
            : null,
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

const editHours = (id, col) => {
  editManHours.value = true;
  att_id.value = id;
  column.value = col;
};

const selectAllTimesheet = () => {
  for (const d of details.value) {
    if (selectAll.value) {
      if (!s.includes(d.att_id.toString())) {
        s.push(d.att_id.toString());
        selectedData[d.att_id] = d;
        workplace = d.employee.workplace.id;
      }
      selected.value[d.att_id] = true;
    } else {
      selected.value[d.att_id] = false;
      filterTrue--;
    }
  }
  console.log(selectedData);
};

const selectOne = (v) => {
  for (const sV in selected.value) {
    if (selected.value[sV] == true) {
      if (!s.includes(sV)) {
        s.push(sV);
        selectedData[sV] = v;
        workplace = v.employee.workplace.id;
      }
    }
  }

  if (selected.value[v.att_id]) {
    selected.value[v.att_id] = true;
    selectAll.value = null;
    if (s.length == details.value.length) {
      selectAll.value = true;
    }
  } else {
    s.splice(s.indexOf(v.att_id.toString()), 1);
    delete selectedData[v.att_id];
    switch (true) {
      case s.length > 0:
        selectAll.value = null;
        break;
      case s.length == 0:
        selectAll.value = false;
        break;
      case s.length == details.value.length:
        selectAll.value - true;
        break;
    }
  }
  console.log(v, selectedData);
  console.log(s.length);
};

const voidSelected = (v) => {
  console.log(v);
  $q.dialog({
    title: "",
    message: "Are you sure you want to revoke the approval of this timesheet?",
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      const details = {
        att_id: v.att_id,
        pdh_emp_id: v.employee.profile.user_id,
        pdh_date: v.date,
      };
      console.log(details);
      await hr_api
        .post("attendance/cancelApprovedTimesheet", details)
        .then(() => {
          $q.notify({
            color: "positive",
            position: "top",
            message: "Timsheet Approval Successfully Canceled",
            icon: "check",
          });
        });
    })
    .onCancel(() => {
      selected.value[v.att_id] = true;
    });
};

const approveTimesheet = async () => {
  console.log("approved", selectedData);
  let ts = [];
  for (var k in selectedData) {
    if (selectedData.hasOwnProperty(k)) {
      ts.push(selectedData[k]);
    }
  }

  const data = {
    ts,
    attendance_date: date.formatDate(attendance_date.value, "YYYY-MM-DD"),
    workplace: workplace,
  };

  await hr_api.post("attendance/approveTimesheet", data).then((res) => {
    $q.notify({
      color: "positive",
      position: "top",
      message: "Timsheet Successfully Approved",
      icon: "check",
    });
  });
};

const removeTimesheet = async () => {
  await hr_api.delete("attendance/deleteTimesheet/" + att_id.value);

  fetchDailyAttendance();
};

const addTimesheet = async () => {
  const details = {
    attendance_date: date.formatDate(attendance_date.value, "YYYY-MM-DD"),
    att_emp_id: employee.value["employee_id"],
    shift: employee.value["time_shift_id"],
    [timeStatus.value["value"]]: addTime.value,
  };
  if (addTime.value >= "22:00:00") {
    details.is_gy = true;
  }

  details.status = true;

  await hr_api.post("attendance/addTimesheet", details).then((res) => {
    $q.notify({
      color: "positive",
      position: "top",
      message: "Timsheet Successfully Added",
      icon: "check",
    });
    fetchDailyAttendance();
  });
};
const updateTimesheet = async () => {
  const details = {
    att_emp_id: employee_id.value,
    att_id: att_id.value,
    [column.value]: editTime.value,
  };
  if (
    column.value == "time_out" ||
    column.value == "time_out_pm" ||
    column.value == "time_out_ot"
  ) {
    details.status = false;
  } else {
    details.status = true;
  }
  await hr_api.patch("attendance/updateTimesheet", details).then((res) => {
    console.log(res);
    fetchDailyAttendance();
  });
};

const removeTime = async () => {
  const details = {
    att_emp_id: employee_id.value,
    att_id: att_id.value,
    [column.value]: null,
  };
  if (
    column.value == "time_out" ||
    column.value == "time_out_pm" ||
    column.value == "time_out_ot"
  ) {
    details.status = true;
  }
  await hr_api.patch("attendance/updateTimesheet", details).then((res) => {
    console.log(res);
    fetchDailyAttendance();
  });
};

const checkOTHours = (hourLogs, psFrom, psTo) => {
  let otHours = {
    totalHours: 0,
    hasOT: false,
    otHoursIn: hourLogs.timeInOt,
    otHoursOut: hourLogs.timeOutOt,
    totalOT: 0,
  };

  let from = date.formatDate(hourLogs.date + " " + hourLogs.timeIn, "hh:mm");
  let to = date.formatDate(hourLogs.date + " " + hourLogs.timeOut, "hh:mm");
  let from_pm = date.formatDate(
    hourLogs.date + " " + hourLogs.timeInPm,
    "hh:mm"
  );
  let to_pm = date.formatDate(
    hourLogs.date + " " + hourLogs.timeOutPm,
    "hh:mm"
  );
  let ts_from = date.formatDate(hourLogs.date + " " + psFrom, "hh:mm");
  let ts_to = date.formatDate(hourLogs.date + " " + psTo, "hh:mm");

  if (hourLogs.timeOutPm != null) {
    otHours.totalHours = 8;
    let hasOt = date.addToDate(hourLogs.date + " " + ts_to, { hours: 1 });

    if (date.formatDate(to_pm, "hh:mm") < date.formatDate(hasOt, "hh:mm")) {
      otHours.hasOT = true;
      otHours.otHoursIn = date.formatDate(
        hourLogs.date + " " + psTo,
        "hh:mm a"
      );
      otHours.otHoursOut = date.formatDate(
        hourLogs.date + " " + hourLogs.timeOutPm,
        "hh:mm a"
      );

      otHours.totalOT = calcTotalHours(psTo, hourLogs.timeOutPm);
    }
  }

  return otHours;
};

function calcTotalHours(from, to, dateDetails = null) {
  const fromDate = date.formatDate(
    dateDetails + " " + from,
    "YYYY-MM-DD HH:mm:ss"
  );
  const toDate = date.formatDate(dateDetails + " " + to);
  let totalHours = date.getDateDiff(toDate, fromDate, "minutes");
  return (totalHours / 60).toFixed(2);
}

const getTimeshift = async (val, update, abort) => {
  console.log(workplace);
  if (timeShift.length == 0) {
    await hr_api.get("employee/timeShift/" + workplace).then((response) => {
      for (const res in response.data) {
        timeShift.push(response.data[res]);
      }
    });
  }

  update(() => {
    const needle = val.toLowerCase();
    timeShiftOptions.value = timeShift.filter(
      (v) => v.ps_from.toLowerCase().indexOf(needle) > -1
    );
  });
};

const updateTimeShift = async () => {
  const details = {
    att_id: att_id.value,
    shift: timeShiftSelect.value["ps_id"],
  };
  await hr_api.patch("attendance/updateTimesheet", details).then((res) => {
    console.log(res);
    fetchDailyAttendance();
  });
};

const formatTime = (dateTime) => {
  const d = date.formatDate(Date.now(), "YYYY-MM-DD");
  return date.formatDate(d + " " + dateTime, "hh:mm:ss a");
};

const fetchDailyAttendance = async () => {
  details.value = [];
  selectAll.value = false;
  selected.value = {};
  s = [];
  selectedData = {};
  const department = route.params.dept_id;
  const att_date = date.formatDate(attendance_date.value, "YYYY-MM-DD");
  await hr_api
    .get("attendance/daily/" + att_date + "/" + workplace)
    .then((res) => {
      const response = res.data;
      let timeOut = "";

      if (response.length > 0) {
        day.value = date.formatDate(att_date, "dddd");
      }

      for (let res in response) {
        // if (!response[res].pr_status) {
        let profile = response[res].employee.profile;
        let employee = response[res].employee;
        let psFrom = response[res].shift ? response[res].shift.ps_from : null;
        let psTo = response[res].shift ? response[res].shift.ps_to : null;
        let isGY = response[res].is_gy;

        let hourLogs = {
          date: att_date,
          timeIn: response[res].time_in,
          timeOut: response[res].time_out,
          timeInPm: response[res].time_in_pm,
          timeOutPm: response[res].time_out_pm,
          timeInOt:
            response[res].time_in_ot != null
              ? response[res].time_in_ot
              : "--:--",
          timeOutOt:
            response[res].time_out_ot != null
              ? response[res].time_out_ot
              : "--:--",
        };

        let h = checkOTHours(hourLogs, psFrom, psTo);

        if (hourLogs.timeOut != null) {
          if (hourLogs.timeInPm == null) {
            let timeIn;
            if (response[res].shift) {
              timeIn = hourLogs.timeIn < psFrom ? psFrom : hourLogs.timeIn;
            } else {
              timeIn = hourLogs.timeIn;
            }
            // console.log(timeIn);
            h.totalHours = calcTotalHours(
              timeIn,
              hourLogs.timeOut,
              hourLogs.date
            );
            if (h.totalHours > 8 && h.totalHours < 9) {
              h.totalHours = 8;
            } else {
              // h.totalHours = h.totalHours <= 4 ? h.totalHours : 4;
              h.totalHours = h.totalHours;
            }
          } else {
            console.log("whelo");
            let timeIn;
            if (response[res].shift) {
              timeIn = hourLogs.timeIn < psFrom ? psFrom : hourLogs.timeIn;
            } else {
              timeIn = hourLogs.timeIn;
            }
            h.totalHours = calcTotalHours(
              timeIn,
              hourLogs.timeOutPm,
              hourLogs.date
            );
            if (h.totalHours > 8) {
              h.totalHours = 8;
            } else {
              // h.totalHours = h.totalHours <= 4 ? h.totalHours : 4;
              h.totalHours = h.totalHours;
            }
          }
        } else {
          //timeOut is null
          if (hourLogs.timeIn == null) {
            if (isGY) {
              let timeInPm;
              if (response[res].shift) {
                timeInPm =
                  hourLogs.timeInPm < psFrom && hourLogs.timeInPm < psTo
                    ? psFrom
                    : hourLogs.timeInPm;
              } else {
                timeInPm = hourLogs.timeInPm;
              }
              const tIn = date.subtractFromDate(
                hourLogs.date + " " + timeInPm,
                {
                  hours: "12",
                }
              );
              const tOut = date.addToDate(
                hourLogs.date + " " + hourLogs.timeOutPm,
                { hours: "12" }
              );

              h.totalHours = calcTotalHours(
                date.formatDate(tIn, "HH:mm:ss"),
                date.formatDate(tOut, "HH:mm:ss"),
                hourLogs.date
              );
            } else {
              let timeInPm;
              if (response[res].shift) {
                timeInPm =
                  hourLogs.timeInPm < psFrom && hourLogs.timeInPm < psTo
                    ? psFrom
                    : hourLogs.timeInPm;
              } else {
                timeInPm = hourLogs.timeInPm;
              }
              h.totalHours = calcTotalHours(
                timeInPm,
                hourLogs.timeOutPm,
                hourLogs.date
              );
            }

            h.totalHours =
              h.totalHours < 4
                ? h.totalHours
                : h.totalHours == 4 && h.totalHours < 5
                ? 4
                : h.totalHours;

            h.totalHours = h.totalHours > 8 ? 8 : h.totalHours;
          } else {
            //timeIn is not null
            if (hourLogs.timeInPm == null) {
              let timeIn;
              if (response[res].shift) {
                timeIn = hourLogs.timeIn < psFrom ? psFrom : hourLogs.timeIn;
              } else {
                timeIn = hourLogs.timeIn;
              }
              h.totalHours = calcTotalHours(
                timeIn,
                hourLogs.timeOutPm,
                hourLogs.date
              );

              h.totalHours = h.totalHours > 8 ? 8 : h.totalHours;
            }
          }
        }

        if (hourLogs.timeInOt != null) {
          h.hasOT = true;
          h.totalOT = 0;
          h.otHoursIn = date.formatDate(
            hourLogs.date + " " + hourLogs.timeInOt,
            "hh:mm a"
          );
          h.otHoursOut = "--:--";
          if (response[res].time_out_ot != null) {
            h.otHoursOut = date.formatDate(
              hourLogs.date + " " + hourLogs.timeOutOt,
              "hh:mm a"
            );
            h.totalOT = calcTotalHours(
              hourLogs.timeInOt,
              hourLogs.timeOutOt,
              hourLogs.date
            );
          }
        }

        if (response[res].remarks != null) {
          let lateHours = calcTotalHours(psFrom, hourLogs.timeIn);
          // alert(psFrom + ' | ' + lateHours)
        }
        selected.value[response[res].att_id] = response[res].pr_status;
        if (response[res].pr_status) {
          filterTrue++;
          selectAll.value = null;
        }
        details.value.push({
          att_id: response[res].att_id,
          employee_id: response[res].att_emp_id,
          date: response[res].attendance_date,
          name: profile.lastname + ", " + profile.firstname,
          position: employee.position.position,
          time_in: hourLogs.timeIn || "--",
          time_out: hourLogs.timeOut || "--",
          time_in_pm: hourLogs.timeInPm || "--",
          time_out_pm: hourLogs.timeOutPm || "--",
          total_reg_hours: isNaN(h.totalHours) ? 0 : h.totalHours,
          time_in_ot: h.otHoursIn || "--",
          time_out_ot: h.otHoursOut || "--",
          totalOT: h.totalOT,
          remarks: response[res].remarks,
          pr_status: response[res].pr_status,
          employee: response[res].employee,
          payroll_shift: response[res].shift.payroll_shift,
        });
        // }
      }
    });
};
fetchDailyAttendance();
</script>

<style lang="scss" scoped>
td,
th {
  border: 1px solid grey !important;
  text-align: center;
}
td.text-left {
  text-align: left;
}

.my-card {
  font-size: 10px !important;
}
</style>
