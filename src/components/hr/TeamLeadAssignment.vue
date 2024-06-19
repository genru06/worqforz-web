<template>
  <q-card class="q-pa-none" style="min-width: 20%">
    <q-bar dark class="bg-primary text-white">
      <div class="col text-left text-weight-bold">Team Lead Assignment</div>
      <q-space />
      <q-btn dense flat round icon="close" size="8.5px" color="red" />
    </q-bar>
    <q-card-section class="row">
      <q-list class="full-width">
        <q-item class="q-pa-none" tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Assign as Team Lead</q-item-label>
          </q-item-section>
          <q-space />
          <q-item-section avatar>
            <q-toggle
              v-model="is_tl"
              checked-icon="check"
              color="green"
              unchecked-icon="clear"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-select
        dense
        v-model="teamMembers"
        multiple
        :options="members"
        use-chips
        stack-label
        label="Select Team Members"
      />
    </q-card-section>
    <q-card-actions align="right">
      <q-btn flat label="Cancel" color="primary" v-close-popup />
      <q-btn
        flat
        @click="saveAssignedLeader"
        label="Save"
        color="primary"
        v-close-popup
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { hr_api } from "../../boot/axios";

const props = defineProps({
  basicInfo: [],
  employeeInfo: [],
});

const teamMembers = ref([]);
const members = ref([]);
const is_tl = ref(props.employeeInfo.is_tl || false);

console.log(props.employeeInfo);

const saveAssignedLeader = async () => {
  const details = {
    is_tl: is_tl.value,
    members: teamMembers.value,
    user_id: props.basicInfo.user_id,
  };
  await hr_api
    .post("employee/team-leader/assignment", details)
    .then((response) => {
      console.log(response);
    });
};

const loadProfiles = async () => {
  await hr_api.get("profile/all/relations/none").then((response) => {
    for (const res of response.data) {
      members.value.push({
        label: res.lastname + ", " + res.firstname,
        value: res.user_id,
      });
    }
  });
};
const getTeamMembers = async () => {
  await hr_api
    .get("employee/team/members/" + props.basicInfo.user_id)
    .then((response) => {
      console.log(response.data);
      for (const res of response.data) {
        teamMembers.value.push({
          label: res.profile.lastname + ", " + res.profile.firstname,
          value: res.profile.user_id,
        });
      }
    });
};
loadProfiles();
if (props.employeeInfo.is_tl) {
  getTeamMembers();
}
</script>

<style lang="scss" scoped></style>
