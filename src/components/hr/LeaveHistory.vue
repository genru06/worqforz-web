<template>
  <div>
    <q-table title="" :rows="leaveDetails" :columns="columns" row-key="name" />
  </div>
</template>

<script setup>
import { date } from "quasar";
import { ref } from "vue";
import { hr_api } from "../../boot/axios";

const props = defineProps({
  profile: [],
});

const userId = ref(props.profile.user_id);
const leaveDetails = ref([]);

const getLeaveDetails = async () => {
  await hr_api
    .get("leave/history/employee/" + userId.value)
    .then((response) => {
      // console.log(response.data);
      for (let r of response.data) {
        leaveDetails.value.push({
          leaveType: r.type_id.leave_type,
          noDays: date.getDateDiff(r.l_to, r.l_from, "days") + 1,
          startDate: date.formatDate(r.l_from, "MMM DD, YYYY"),
          endDate: date.formatDate(r.l_to, "MMM DD, YYYY"),
          reason: r.reason,
        });
      }
    });
};

getLeaveDetails();

const columns = [
  {
    name: "leaveType",
    required: true,
    label: "Leave Type",
    align: "left",
    field: "leaveType",
  },
  {
    name: "noDays",
    required: true,
    label: "No. of Days",
    align: "left",
    field: "noDays",
  },
  {
    name: "startDate",
    required: true,
    label: "Start Date",
    align: "left",
    field: "startDate",
  },
  {
    name: "endDate",
    required: true,
    label: "End Date",
    align: "left",
    field: "endDate",
  },
  {
    name: "reason",
    required: true,
    label: "Reason",
    align: "left",
    field: "reason",
  },
];
</script>

<style lang="scss" scoped></style>
