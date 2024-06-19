<template>
  <div>
    <q-table
      :wrap-cells="true"
      title=""
      :rows="infractionDetails"
      :columns="columns"
      row-key="name"
    />
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
const infractionDetails = ref([]);

const getInfractionDetails = async () => {
  await hr_api.get("infraction/employee/" + userId.value).then((response) => {
    let i = 0;
    for (let res of response.data) {
      i++;
      infractionDetails.value.push({
        no: i,
        offenseDate: res.offense_date,
        violations: res.infraction.infractions,
        description: res.details,
        sanction: res.penalty ? res.penalty.disciplinary_action : "",
        status: getStatus(res.status),
      });
    }
  });
};

//'0=reported, 1=concluded, 2=forwarded to company, 3=sr,4=nte,5=nte received,6=we received, 7=admin hearing, 8=ongoing DA or Suspension'
const getStatus = (status) => {
  switch (status) {
    case 0:
      return "Reported";
      break;
    case 1:
      return "Concluded";
      break;
    case 7:
      return "Admin Hearing";
      break;
    case 8:
      return "On Going DA or Suspension";
      break;
  }
};
const columns = [
  {
    name: "no",
    required: true,
    label: "#",
    align: "left",
    field: "no",
    headerStyle: "width:50px;",
  },
  {
    name: "offenseDate",
    required: true,
    label: "Date of Offense",
    align: "left",
    field: "offenseDate",
    headerStyle: "width:100px;",
  },
  {
    name: "violations",
    required: true,
    label: "Violation",
    align: "left",
    field: "violations",
    headerStyle: "width:30%;",
  },
  {
    name: "description",
    required: true,
    label: "Description",
    align: "left",
    field: "description",
    headerStyle: "width:20%;",
  },
  {
    name: "sanction",
    required: true,
    label: "Sanctions / Actions",
    align: "left",
    field: "sanction",
  },
  {
    name: "status",
    required: true,
    label: "Status",
    align: "left",
    field: "status",
  },
];

getInfractionDetails();
</script>

<style lang="scss" scoped></style>
