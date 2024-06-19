<template>
  <div>
    <q-table
      dense
      :separator="separator"
      :loading="loading"
      :rows="tablerows"
      :columns="columns"
      row-key="name"
      hide-pagination
    >
      <template v-slot:top-right>
        <q-btn
          color="teal"
          icon-right="add_circle"
          label="ADD EDUCATION"
          no-caps
          size="sm"
          @click="addEducation = true"
        />
      </template>
    </q-table>

    <q-dialog v-model="addEducation" persistent>
      <q-card style="width: 350px">
        <q-form ref="addEducationForm">
          <q-bar dark class="bg-teal text-white">
            <div class="text-left">Add Education</div>
            <q-space />
            <q-btn
              dense
              flat
              round
              icon="cancel"
              size="8.5px"
              color="white"
              v-close-popup
            />
          </q-bar>
          <q-card-section class="q-pb-none items-center">
            <q-select
              class="q-pb-none"
              dense
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              v-model="educationalBackground.education_level"
              :options="edBackOptions"
              option-label="level"
              option-value="id"
              label="Select Education Level"
              bg-color="white"
              :rules="[(val) => val || 'Please Education Level']"
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
              class="q-pb-none"
              borderless
              dense
              v-model="educationalBackground.school.school_name"
              type="text"
              label="School Name"
              :rules="[
                (val) => (val && val.length > 0) || 'School Name is Required',
              ]"
            />
            <q-input
              class="q-pb-none"
              borderless
              dense
              v-model="educationalBackground.school.school_address"
              type="text"
              label="School Address"
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'School Address is Required',
              ]"
            />
            <q-input
              borderless
              dense
              v-model="educationalBackground.course.course"
              type="text"
              label="Course"
            />
            <q-input
              class="q-pb-none"
              borderless
              dense
              v-model="educationalBackground.year_graduated"
              type="text"
              label="Year Graduated"
            />
          </q-card-section>
          <q-card-section class="row q-pb-none q-gutter-sm">
            <q-input
              class="col"
              borderless
              dense
              v-model="educationalBackground.year_attend_from"
              type="text"
              label="Year Attended From"
            />
            <q-input
              class="col"
              borderless
              dense
              v-model="educationalBackground.year_attend_to"
              type="text"
              label="Year Attended To"
            />
          </q-card-section>
          <q-card-section class="q-pb-none">
            <q-input
              borderless
              dense
              v-model="educationalBackground.highest_earn"
              type="text"
              label="Highest Grade/Level/Units Earned"
            />
          </q-card-section>
          <q-card-section
            v-if="educationalBackground.education_level.id > 2"
            class="row q-pb-none q-gutter-sm"
          >
            <q-input
              class="col"
              borderless
              dense
              v-model="educationalBackground.major"
              type="text"
              label="Major"
            />
            <q-input
              class="col"
              borderless
              dense
              v-model="educationalBackground.minor"
              type="text"
              label="Minor"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              size="sm"
              label="ADD"
              color="primary"
              @click="saveEducation"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from "quasar";
import { hr_api } from "../../boot/axios";
import { ref } from "vue";

const $q = useQuasar();
const prop = defineProps({
  profile: {},
});

const addEducation = ref(false);
const separator = ref("horizontal");
const tablerows = ref([]);
const addEducationForm = ref(null);
const columns = [
  {
    name: "education_level",
    required: true,
    label: "LEVEL",
    align: "left",
    field: "education_level",
    sortable: true,
  },
  {
    name: "school",
    required: true,
    label: "NAME OF SCHOOL",
    align: "left",
    field: "school",
    sortable: true,
  },
  {
    name: "year_graduated",
    required: true,
    label: "YEAR GRADUATED",
    align: "center",
    field: "year_graduated",
    sortable: true,
  },
  {
    name: "course",
    required: true,
    label: "COURSE TAKEN",
    align: "center",
    field: "course",
    sortable: true,
  },
];

const edBackOptions = ref();

const educationalBackground = ref({
  profile: prop.profile,
  education_level: {
    id: 1,
    level: "Elementary",
  },
  school: {
    school_name: "",
    school_address: "",
  },
  course: {
    course: "",
  },
  year_graduated: "",
  year_attend_from: "",
  year_attend_to: "",
  highest_earn: "Graduated",
  major: "",
  minor: "",
});

const saveEducation = async () => {
  addEducationForm.value.validate().then(async (success) => {
    if (success) {
      await hr_api
        .post("employee/education", educationalBackground.value)
        .then((response) => {
          const row = [];
          for (const r in response.data) {
            row.push({
              education_level: response.data[r].education_level.level,
              school: response.data[r].school.school_name,
              year_graduated: response.data[r].year_graduated,
              course: response.data[r].course
                ? response.data[r].course.course
                : "",
            });
          }
          tablerows.value = row;
          addEducation.value = false;
        });
    }
  });
};

const fetchEducation = async () => {
  await hr_api
    .get("employee/education/details/" + prop.profile)
    .then((response) => {
      const row = [];
      for (const r in response.data) {
        row.push({
          education_level: response.data[r].education_level.level,
          school: response.data[r].school.school_name,
          year_graduated:
            response.data[r].year_graduated == 0
              ? "--"
              : response.data[r].year_graduated,
          course: response.data[r].course ? response.data[r].course.course : "",
        });
      }
      tablerows.value = row;
    });
};

const fetchEducLevel = async () => {
  await hr_api.get("employee/education/level").then((response) => {
    edBackOptions.value = response.data;
  });
};

fetchEducLevel();
fetchEducation();
console.log(prop.profile);
</script>

<style scoped></style>
