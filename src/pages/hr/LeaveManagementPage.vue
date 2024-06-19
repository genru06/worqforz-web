<template>
  <div>
    <HeaderLayout mainTitle="HR" moduleTitle="Leave Management">
      <q-btn outline color="grey-8" to="/hr/" label="Dashboard" />
      <q-btn outline color="grey-8" to="/hr/settings" label="Settings" />
      <q-btn
        outline
        color="grey-8"
        @click="leaveApplicationForm = true"
        label="Leave Application Form"
      />
      <q-btn
        outline
        color="grey-8"
        @click="leaveReportModal = true"
        label="Report"
      />
    </HeaderLayout>
    <q-separator />
    <div class="q-pa-md">
      <q-tabs
        v-model="tab"
        active-color="info"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="employeeOnLeave" label="List of Employees on Leave">
          <q-badge v-if="totalPersonelOnLeave != 0" color="positive">{{
            totalPersonelOnLeave
          }}</q-badge>
        </q-tab>
        <q-tab
          name="pendingApproval"
          label="Leave Application Pending Approval"
        >
          <q-badge v-if="totalLeaveForApproval != 0" color="red">{{
            totalLeaveForApproval
          }}</q-badge>
        </q-tab>
      </q-tabs>

      <q-separator />
      <q-tab-panels v-model="tab" animated class="w-full">
        <q-tab-panel class="q-pa-md" name="employeeOnLeave">
          <leaveGrid
            tableTitle="Employees On Leave"
            gridType="1"
            :tablerows="employeesOnLeave"
            :loading="loading"
            @resume-to-work="(id) => resumeToWork(id)"
            @extend-leave="(id, dateExtend) => extendLeave(id, dateExtend)"
            @cancel-leave="(id) => cancelLeave(id)"
          />
        </q-tab-panel>
        <q-tab-panel name="pendingApproval">
          <leaveGrid
            tableTitle="Leave Application for Approval"
            gridType="2"
            :tablerows="leaveForApproval"
            @approve-leave="(id) => approveApplication(id)"
            @decline-leave="(id) => declineApplication(id)"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <q-dialog v-model="leaveApplicationForm" persistent>
      <LeaveApplicationFormVue
        @updateLeaveForApproval="fetchLeaveForApproval"
      />
    </q-dialog>
    <q-dialog v-model="leaveReportModal">
      <div class="col-lg-md">
        <q-card>
          <q-bar>
            <q-icon name="receipt" />
            <div>Leave Report</div>

            <q-space />

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-bar>
          <q-card-section class="row q-gutter-md q-pt-none">
            <div class="col">
              <q-input
                dense
                v-model="dateFrom"
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
                      <q-date v-model="dateFrom">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
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
                v-model="dateTo"
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
                      <q-date v-model="dateTo">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </q-card-section>

          <q-card-actions horizontal align="right">
            <q-btn
              @click="generateReport"
              color="positive"
              size="sm"
              label="Generate"
            />
          </q-card-actions>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { date, exportFile, useQuasar } from "quasar";
import { hr_api } from "boot/axios";
import leaveGrid from "../../components/leaveGrid.vue";
import LeaveApplicationFormVue from "../../components/LeaveApplicationForm.vue";
import HeaderLayout from "../../layouts/HeaderLayout.vue";
// import leaveReportsServices from "src/services/leave-reports.services";

const loading = ref(false);
const leaveReportModal = ref(false);
const $q = useQuasar();
const separator = ref("vertical");
const tab = ref("employeeOnLeave");
const totalPersonelOnLeave = ref(0);
const totalLeaveForApproval = ref(0);
const employeesOnLeave = ref([]);
const leaveForApproval = ref([]);
const leaveApplicationForm = ref(false);
const dateFrom = ref();
const dateTo = ref();

// const generateReport = async () => {
//   const from = dateFrom.value.replaceAll("/", "-");
//   const to = dateTo.value.replaceAll("/", "-");

//   await api
//     .get("leave/report/duration/" + from + "/" + to)
//     .then(async (response) => {
//       const logo = await fetch("logo-paceman.png");
//       const logoBuffer = await logo.arrayBuffer();
//       const blob = await leaveReportsServices.generateReport(
//         from,
//         to,
//         response.data,
//         logoBuffer
//       );

//       const url = window.URL.createObjectURL(new Blob([blob]));
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = "example.xlsx";
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//       leaveReportModal.value = false;
//     });
// };

const extendLeave = async (id, dateExtend) => {
  const status = {
    status: 3,
    date_extend: dateExtend,
  };
  await hr_api.patch("leave/updateStatus/" + id, status).then(async () => {
    await loadPending();
    await loadData();

    $q.notify({
      color: "positive",
      position: "top",
      message: "Leave Extension Approved",
      icon: "check",
    });
  });
};
const cancelLeave = async (id) => {
  await hr_api.delete("leave/" + id).then(async () => {
    await loadPending();
    await loadData();

    $q.notify({
      color: "negative",
      position: "top",
      message: "Leave of Absence is cancelled",
      icon: "close",
    });
  });
};
const resumeToWork = async (id) => {
  const status = {
    status: 2,
    date_resumed: date.formatDate(Date.now(), "YYYY-MM-DD"),
  };
  await hr_api.patch("leave/updateStatus/" + id, status).then(async () => {
    await loadPending();
    await loadData();

    $q.notify({
      color: "positive",
      position: "top",
      message: "Employee is back to Work",
      icon: "check",
    });
  });
};

const approveApplication = async (id) => {
  const status = {
    status: true,
  };
  await hr_api.patch("leave/updateStatus/" + id, status).then(async () => {
    await loadPending();
    await loadData();

    $q.notify({
      color: "positive",
      position: "top",
      message: "Successfully Approved",
      icon: "check",
    });
  });
};

const declineApplication = async (id) => {
  const status = {
    status: 4,
  };
  await hr_api.patch("leave/updateStatus/" + id, status).then(async () => {
    await loadPending();
    await loadData();

    $q.notify({
      color: "negative",
      position: "top",
      message: "Leave Application Declined",
      icon: "close",
    });
  });
};
const fetchLeaveForApproval = async () => {
  leaveApplicationForm.value = false;
  await loadPending();
};

const loadData = async () => {
  await hr_api.get("leave/employees").then((response) => {
    const data = [];
    totalPersonelOnLeave.value = response.data.length;
    for (const res in response.data) {
      const details = response.data[res];
      let position = details.profile.employee.position;
      data.push({
        id: details.id,
        name: details.profile.lastname + ", " + details.profile.firstname,
        department: position.department ? position.department.department : "",
        position: details.profile.employee.position.position,
        leaveType: details.type_id.leave_type,
        noDays: details.no_days,
        startDate: date.formatDate(details.l_from, "MMMM DD, YYYY"),
        endDate: date.formatDate(details.l_to, "MMMM DD, YYYY"),
        reason: details.reason,
        status: details.status,
        dateExtend: date.formatDate(details.date_extend, "MMMM DD, YYYY"),
      });
    }
    employeesOnLeave.value = data;
  });
  await loadPending();
};

const loadPending = async () => {
  await hr_api.get("leave/for-approval").then((response) => {
    const data = [];
    totalLeaveForApproval.value = response.data.length;

    for (const res in response.data) {
      const details = response.data[res];
      data.push({
        id: details.id,
        name: details.profile.lastname + ", " + details.profile.firstname,
        department: details.profile.employee.position.department,
        position: details.profile.employee.position.position,
        leaveType: details.type_id,
        noDays: details.no_days,
        startDate: details.l_from,
        endDate: details.l_to,
        reason: details.reason,
      });
    }
    leaveForApproval.value = data;
  });
};
loadData();
</script>

<style scoped>
.q-badge {
  right: -20px !important;
}
</style>
