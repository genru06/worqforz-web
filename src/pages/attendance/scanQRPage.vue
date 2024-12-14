<template>
  <div>
    <div class="mobile-bg">
      <div class="column q-py-sm items-center bg-white">
        <img
          class="edashboard-header"
          src="../../assets/po_header.jpg"
          alt="Header Image"
        />
      </div>
      <div>
        <StreamBarcodeReader
          @decode="onDecode"
          @loaded="onLoaded"
        ></StreamBarcodeReader>
      </div>
      <div
        class="q-pa-md"
        v-if="scannerReady"
      >
        <q-card class="my-card">
          <q-card-actions
            vertical
            align="center"
          > <q-toggle
              :label="isOvertime ? 'Overtime' : 'Regular Time'"
              v-model="isOvertime"
              color="positive"
              @click="toggleOT"
            />
          </q-card-actions>
          <q-card-section class="column q-pb-md items-center">
            <q-btn
              class="full-width"
              size="20px"
              label="VIEW ATTENDANCE"
              type="submit"
              color="primary"
              to="/scan"
            >
              <template v-slot:loading> <q-spinner-facebook /> </template></q-btn>
          </q-card-section>
        </q-card>

        <q-card class="my-card q-mt-md">
          <q-card-section class="column q-pb-md items-center">
            <q-btn
              class="full-width"
              size="20px"
              label="DASHBOARD"
              type="submit"
              color="teal"
              to="/dashboard/time-keeper"
            >
              <template v-slot:loading> <q-spinner-facebook /> </template></q-btn>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog
      v-model="checkAttendance"
      persistent
    >
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section class="column items-center">
          <q-avatar
            square
            class="col"
            size="200px"
          >
            <img :src="profileImage" />
          </q-avatar>
        </q-card-section>
        <q-card-section class="column items-center">
          <div class="col text-h5">{{ name }}</div>
          <div class="col q-pt-md">
            <q-btn
              :color="inStatus ? 'positive' : 'negative'"
              :icon="inStatus ? 'login' : 'logout'"
              :label="inStatus ? 'CHECK IN' : 'CHECK OUT'"
            />
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions align="center">
          <q-btn
            label="OK"
            color="teal"
            @click="clear"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="warning">
      <q-card>
        <q-card-section class="column items-center">
          <q-icon
            class="col"
            size="48px"
            name="warning"
            color="negative"
          />
          <span class="q-ml-sm text-negative col">Not Allowed to scan Yet</span>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            label="OK"
            color="negative"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
  import { date, LocalStorage, useQuasar } from "quasar";
  import { socket } from "../../boot/socket";
  import { StreamBarcodeReader } from "vue-barcode-reader";
  import { ref } from "vue";
  import { hr_api } from "../../boot/axios";
  import { useAttendanceStore } from "../../stores/attendance";

  const baseUrl = ref(process.env.BASE_URL);
  const checkAttendance = ref(false);
  const profileImage = ref(baseUrl.value + "/assets/logo.png");
  const inStatus = ref(false);
  const name = ref("Firstname Lastname");
  const warning = ref(false);
  const scannerReady = ref(false);
  const headerImage = ref(process.env.COMPANY_HEADER_IMG);
  const isOvertime = ref(false)
  const otWorkers = ref([])

  let id = "";
  const $q = useQuasar();

  const user = LocalStorage.getItem("user");
  const workers = user.profile.employee.workplace.workers;
  const workplace = ref(user.profile.employee.workplace.id);

  console.log(workers);

  const onDecode = (text) => {
    const decodedValue = JSON.parse(text);
    // console.log("decoded value:", decodedValue);
    console.log('decoded : ', decodedValue)
    const workplaceDetails = workers.filter(
      (v) => v.employee_id == decodedValue.id
    )[0];
    // console.log(workplaceDetails);
    if (workplaceDetails) {
      if (!isOTAllowed(decodedValue.id) && isOvertime.value) {
        $q.dialog({
          title: "SCAN Info",
          message: "Sorry, this worker is not allowed for Overtime",
        });
        return;
      }
      const details = {
        fn: isOvertime.value ? "overtime" : "qrScan",
        body: text,
        params: {
          time_scan: date.formatDate(Date.now(), "YYYY-MM-DD HH:mm:ss"),
          socketID: localStorage.getItem("socketID"),
          time_in: workplaceDetails.time_in,
          time_out: workplaceDetails.time_out,
        },
      };
      if (id == "") {
        socket.emit("attendance", details);
        id = decodedValue.id;
      }
    } else {
      $q.dialog({
        title: "SCAN Info",
        message: "Sorry, this worker doesn't belong in this workplace",
      });
    }

    socket.on("qrResults", (details) => {
      console.log(details);
      if (decodedValue.name != name.value) {
        profileImage.value = decodedValue.image;
        name.value = decodedValue.name;
        inStatus.value = details.InStatus;
        if (!details.isAllowed) {
          clear();
          warning.value = true;
        } else {
          checkAttendance.value = true;
        }
      }
    });
  };

  const toggleOT = () => {
    if (isOvertime.value) {
      socket.on("getApprovedOt", (details) => {
        console.log(details)
        otWorkers.value = details;
      })
      const otBody = {
        otDate: date.formatDate(Date.now(), "YYYY-MM-DD")
      }
      socket.emit("getApprovedOt", otBody)
    }
  }

  const isOTAllowed = (employee_id) => {
    let result = otWorkers.value.filter(v => v.employee.employee.employee_id == employee_id)[0];
    if (otWorkers.value.length == 0) {
      result = false;
    }
    return result;
  }

  const clear = () => {
    checkAttendance.value = false;
    profileImage.value = baseUrl.value + "/images/forms/logo.png";
    inStatus.value = false;
    name.value = "Firstname Lastname";
    id = "";
  };

  const onLoaded = () => {
    console.log("Ready to start scanning barcodes");
    scannerReady.value = true;
    clear();
  };
</script>

<style scoped>
  .edashboard-header {
    width: 100%;
  }

  .mobile-bg {
    background: url("../../assets/mobile-dashboard-bg.jpg");
    height: 100vh;
    background-size: 102% 103% !important;
    background-repeat: repeat-y;
  }
</style>
