<template>
  <div>
    <header-layout
      mainTitle="Human Resource Management"
      moduleTitle="Employee Details"
    >
      <q-btn to="/hr/" outline color="grey-8" label="Dashboard" />
      <q-btn to="/hr/employee/list/" outline color="grey-8" label="Employees" />
      <q-btn
        v-if="!hasSystemAccess"
        color="grey-8"
        label="Register User"
        @click="generateAccountModal = true"
      />
      <q-btn
        v-if="hasSystemAccess"
        color="grey-8"
        label="Remove User"
        @click="removeUserModal = true"
      />
      <q-dialog v-model="removeUserModal" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <span class="q-ml-sm"
              >Are you sure you want to remove this user?</span
            >
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="No" color="negative" v-close-popup />
            <q-btn
              flat
              label="Yes"
              @click="removeUser"
              color="primary"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </header-layout>
    <div class="q-pa-md row">
      <div class="col-3 q-px-md">
        <!-- BasicInfo -->
        <q-card class="my-card q-mb-md">
          <q-toolbar>
            <q-toolbar-title> </q-toolbar-title>
            <q-btn
              flat
              round
              dense
              icon="mode_edit"
              @click="dialogBox = true"
              size="10px"
              class="q-mr-xs"
            />
            <q-btn
              flat
              round
              dense
              icon="upload"
              @click="upload = true"
              size="10px"
            />
            <q-btn
              @click="teamLeadModal = true"
              flat
              dense
              round
              icon="group"
              :color="employeeInfo.is_tl ? 'positive' : 'black'"
            >
              <q-tooltip> Assign as Team Lead </q-tooltip>
            </q-btn>
            <q-dialog v-model="teamLeadModal" persistent>
              <TeamLeadAssignment
                :basicInfo="basicInfo"
                :employeeInfo="employeeInfo"
                @close="teamLeadModal = false"
              />
            </q-dialog>
            <q-dialog class="no-padding" v-model="upload" persistent>
              <q-card>
                <q-card-section class="row items-center no-padding">
                  <q-uploader
                    :url="apiUrl + 'profile/upload/' + basicInfo.user_id"
                    style="max-width: 300px"
                    label="Select an Image to Upload"
                    field-name="file"
                    @uploaded="onUploadedFile()"
                  />
                </q-card-section>
              </q-card>
            </q-dialog>
          </q-toolbar>
          <q-separator />
          <q-item class="justify-center text-center">
            <q-item-section avatar>
              <q-avatar class="q-pl-md" size="100px">
                <img v-if="!basicInfo.avatar" :src="logo" />
                <img v-if="basicInfo.avatar" :src="apiUrl + basicInfo.avatar" />
              </q-avatar>
            </q-item-section>
            <q-item-section class="row q-ml-md">
              <p class="text-h6 text-left q-my-none">
                {{ basicInfo.firstname }} {{ basicInfo.lastname }}
              </p>
              <p class="text-md text-left font-bold">
                {{ employeeInfo.employee_id }}
              </p>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-card-section class="row q-py-sm">
            <span class="text-md col-6 text-left font-semibold">Workplace</span>
            <span class="text-md col-6 text-negative text-right">{{
              employeeInfo.workplace.name
            }}</span>
          </q-card-section>
          <q-separator />
          <q-card-section class="row q-py-sm">
            <span class="text-md col-6 text-left font-semibold"
              >Department</span
            >
            <span
              v-if="!editable"
              class="text-md col-6 text-negative text-right"
              >{{ employeeInfo.position.department.department }}</span
            >
            <span v-if="editable" class="text-md text-negative text-right">
            </span>
          </q-card-section>
          <q-separator />
          <q-card-section class="row q-py-sm">
            <span class="text-md col-6 text-left font-semibold">Position</span>
            <span
              v-if="!editable"
              class="text-md col-6 text-negative text-right"
              >{{ employeeInfo.position.position }}</span
            >
            <span v-if="editable" class="text-md text-negative text-right">
              <q-select
                filled
                dense
                v-model="employeeInfo.position.position"
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                :options="positionOptions"
                @filter="positionFn"
                option-label="position"
                option-value="position_id"
                label="Position :"
                bg-color="white"
                :rules="[(val) => val || 'Please Select a Position']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </span>
          </q-card-section>
          <!-- <q-separator />
          <q-card-section class="row q-py-sm">
            <span class="text-md col-6 text-left font-semibold">Section</span>
            <span class="text-md col-6 text-negative text-right">{{
              employeeInfo.section ? employeeInfo.section.section_name : ""
            }}</span>
          </q-card-section> -->
          <q-separator />
          <q-card-section class="row q-py-sm">
            <span class="text-md col-6 text-left font-semibold"
              >Date Hired</span
            >
            <span class="text-md col-6 text-negative text-right">{{
              date.formatDate(employeeInfo.date_hired, "MMMM DD, YYYY")
            }}</span>
          </q-card-section>
          <q-separator />
          <q-card-section class="row q-py-sm">
            <span class="text-md col-6 text-left font-semibold"
              >Employment Status</span
            >
            <span class="text-md col-6 text-negative text-right">{{
              employeeInfo.em_status
                ? employeeInfo.em_status.employment_status
                : ""
            }}</span>
          </q-card-section>
          <q-separator />
          <q-card-section class="row q-py-sm">
            <span class="text-md col-6 text-left font-semibold"
              >Account Status</span
            >
            <span class="text-md col-6 text-negative text-right">{{
              accountStatus(employeeInfo.act_status)
            }}</span>
          </q-card-section>
          <div v-if="employeeInfo.act_status == 3">
            <q-separator />
            <q-card-section class="row q-py-sm">
              <span class="text-md col-6 text-left font-semibold"
                >Date Resigned</span
              >
              <span class="text-md col-6 text-negative text-right">{{
                date.formatDate(employeeInfo.resigned_date, "MMMM DD, YYYY")
              }}</span>
            </q-card-section>
            <q-separator />
            <q-card-section class="row q-py-sm">
              <span class="text-md col-6 text-left font-semibold">Remarks</span>
              <span class="text-md col-6 text-negative text-right">{{
                employeeInfo.remarks
              }}</span>
            </q-card-section>
          </div>
          <q-inner-loading :showing="visible">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
        <!-- About Me -->
        <q-card class="my-card">
          <q-toolbar>
            <q-toolbar-title class="text-md"> About Me</q-toolbar-title>
            <q-btn
              flat
              round
              dense
              icon="mode_edit"
              size="10px"
              class="q-mr-xs"
              @click="editMeModal = true"
            >
            </q-btn>
          </q-toolbar>
          <q-separator />
          <q-card-section class="p-0">
            <q-item>
              <q-item-section>
                <q-item-label class="font-bold">Birthdate</q-item-label>
                <q-item-label caption lines="2">{{
                  date.formatDate(basicInfo.birthdate, "MMMM DD, YYYY")
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="font-bold">Location</q-item-label>
                <q-item-label v-if="addressInfo" caption lines="2">
                  {{ addressInfo.street ? addressInfo.street + "," : "" }}
                  {{
                    addressInfo?.barangay.barangay +
                    ", " +
                    addressInfo?.city.mun_city +
                    ", " +
                    addressInfo?.city.province.name +
                    " " +
                    addressInfo?.city.zip_code
                  }}
                  <q-popup-edit v-model="addressInfo.city.mun_city">
                  </q-popup-edit>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="font-bold">Contact #</q-item-label>
                <q-item-label caption lines="2">{{
                  basicInfo.mobile
                }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="font-bold">Religion</q-item-label>
                <!-- <q-item-label caption lines="2">
                  {{ basicInfo.religion ? basicInfo.religion.religion : "" }}

                  <q-popup-edit v-model="basicInfo.religion.religion">
                    <q-select
                      dense
                      v-model="basicInfo.religion"
                      use-input
                      hide-selected
                      fill-input
                      input-debounce="0"
                      :options="religionOptions"
                      option-label="religion"
                      option-value="id"
                      @filter="getReligion"
                      label="Select Religion"
                      bg-color="white"
                      :rules="[(val) => val || 'Please Select a Religion']"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                    <q-btn
                      dense
                      color="primary"
                      icon="check"
                      label="save"
                      v-close-popup
                      @click="saveBasicInfo('religion')"
                    />
                  </q-popup-edit>
                </q-item-label> -->
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="font-bold">Eyes Color</q-item-label>
                <q-item-label caption lines="2">{{
                  basicInfo.eyes_color || "[ empty ]"
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label class="font-bold">Hair Color</q-item-label>
                <q-item-label caption lines="2">{{
                  basicInfo.hair_color || "[ empty ]"
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-inner-loading :showing="visible">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
      </div>
      <!-- Employee Info -->
      <div class="col-6 q-px-sm">
        <q-card class="my-card q-p">
          <q-tabs
            v-model="tab"
            active-color="info"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="salaryAndBenefits" label="Salary and Benefits" />
            <q-tab name="edBack" label="Educational Background" />
            <q-tab name="subDoc" label="Submitted Documents" />
            <q-tab name="ins" label="Insurance Details" />
            <q-tab name="qr" label="QR Code" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel class="q-pa-md row" name="salaryAndBenefits">
              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label class="font-bold">Salary</q-item-label>
                    <q-item-label
                      caption
                      lines="2"
                      v-if="!salaryEdit"
                      @click="salaryEdit = true"
                      >₱
                      {{
                        parseInt(employeeInfo.salary).toFixed(2) || 0.0
                      }}</q-item-label
                    >
                    <q-input
                      v-if="salaryEdit"
                      dense
                      v-model="employeeInfo.salary"
                      label="Salary"
                      @keypress.enter="
                        saveEmployeeInfo('salary'), (salaryEdit = false)
                      "
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="font-bold">COLA</q-item-label>
                    <q-item-label
                      caption
                      lines="2"
                      v-if="!salaryEdit"
                      @click="salaryEdit = true"
                      >₱
                      {{
                        parseInt(employeeInfo.cola).toFixed(2) || 0
                      }}</q-item-label
                    >
                    <q-input
                      v-if="colaEdit"
                      dense
                      v-model="employeeInfo.cola"
                      label="COLA"
                      @keypress.enter="
                        saveEmployeeInfo('cola'), (colaEdit = false)
                      "
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="font-bold">Salary Type</q-item-label>
                    <q-item-label caption lines="2">Daily</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="font-bold"
                      >Bank Account #</q-item-label
                    >
                    <q-item-label
                      caption
                      lines="2"
                      v-if="!bankEdit"
                      @click="bankEdit = true"
                    >
                      {{ employeeInfo.bank_account || "[empty]" }}</q-item-label
                    >
                    <q-input
                      v-if="bankEdit"
                      dense
                      v-model="employeeInfo.bank_account"
                      label="Bank Account #"
                      @keypress.enter="
                        saveEmployeeInfo('bank_account'), (bankEdit = false)
                      "
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="font-bold">Time Shifting</q-item-label>
                    <q-item-label caption lines="2"
                      >{{
                        formatTime(timeShiftInfo.ps_from) +
                        " - " +
                        formatTime(timeShiftInfo.ps_to)
                      }}
                      <q-popup-edit v-model="timeShiftInfo.ps_id">
                        <q-select
                          dense
                          v-model="timeShiftSelect"
                          use-input
                          hide-selected
                          fill-input
                          input-debounce="0"
                          :options="timeShiftOptions"
                          :option-label="
                            (v) =>
                              v.ps_department +
                              ' [' +
                              formatTime(v.ps_from) +
                              ' - ' +
                              formatTime(v.ps_to) +
                              ']'
                          "
                          option-value="ps_id"
                          @filter="getTimeshift"
                          label="Select Time Shift"
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
                        <q-btn
                          dense
                          color="primary"
                          icon="check"
                          label="save"
                          v-close-popup
                          @click="saveTimeShift()"
                        />
                      </q-popup-edit>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-6">
                <q-item>
                  <q-item-section>
                    <q-item-label class="font-bold">SSS</q-item-label>
                    <q-item-label
                      caption
                      lines="2"
                      v-if="!sssEdit"
                      @click="sssEdit = true"
                    >
                      {{ employeeInfo.sss || "[empty]" }}
                    </q-item-label>
                    <q-input
                      v-if="sssEdit"
                      dense
                      v-model="employeeInfo.sss"
                      label="sss"
                      @keypress.enter="
                        saveEmployeeInfo('sss'), (sssEdit = false)
                      "
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="font-bold">PhilHealth</q-item-label>
                    <q-item-label
                      caption
                      lines="2"
                      v-if="!phEdit"
                      @click="phEdit = true"
                      >{{ employeeInfo.phil_health || "[empty]" }}</q-item-label
                    >
                    <q-input
                      v-if="phEdit"
                      dense
                      v-model="employeeInfo.phil_health"
                      label="Philhealth"
                      @keypress.enter="
                        saveEmployeeInfo('phil_health'), (phEdit = false)
                      "
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="font-bold">Pag-Ibig</q-item-label>
                    <q-item-label
                      caption
                      lines="2"
                      v-if="!pagIbigEdit"
                      @click="pagIbigEdit = true"
                      >{{ employeeInfo.pag_ibig || "[empty]" }}</q-item-label
                    >
                    <q-input
                      v-if="pagIbigEdit"
                      dense
                      v-model="employeeInfo.pag_ibig"
                      label="Pag-Ibig"
                      @keypress.enter="
                        saveEmployeeInfo('pag_ibig'), (pagIbigEdit = false)
                      "
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="font-bold">TIN</q-item-label>
                    <q-item-label
                      caption
                      lines="2"
                      v-if="!tinEdit"
                      @click="tinEdit = true"
                      >{{ employeeInfo.tin || "[empty]" }}</q-item-label
                    >
                    <q-input
                      v-if="tinEdit"
                      dense
                      v-model="employeeInfo.tin"
                      label="TIN"
                      @keypress.enter="
                        saveEmployeeInfo('tin'), (tinEdit = false)
                      "
                    />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="font-bold">Rest Day</q-item-label>
                    <q-item-label caption lines="2"
                      >{{ getRestDay(employeeInfo.rest_day) }}

                      <q-popup-edit v-model="employeeInfo.rest_day">
                        <q-select
                          dense
                          v-model="employeeInfo.rest_day"
                          use-input
                          emit-value
                          map-options
                          input-debounce="0"
                          :options="rdOptions"
                          label="Select Rest Day"
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
                        <q-btn
                          dense
                          color="primary"
                          icon="check"
                          label="save"
                          v-close-popup
                          @click="saveEmployeeInfo('rest_day')"
                        />
                      </q-popup-edit>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-tab-panel>

            <q-tab-panel name="edBack">
              <EducationalBackground :profile="basicInfo" />
            </q-tab-panel>
            <q-tab-panel name="subDoc"> </q-tab-panel>
            <q-tab-panel name="ins" class="q-pa-none">
              <InsuranceList :profile="basicInfo" />
            </q-tab-panel>
            <q-tab-panel name="qr" class="q-pa-md column justify-center">
              <q-img
                :src="qrUrl"
                spinner-color="white"
                style="width: 200px; max-width: 200px"
                class="col-12 self-center"
              />
              <q-space />
              <q-separator />
              <div
                v-if="!basicInfo.user_status && basicInfo.user_status != null"
                class="col-12 row justify-between text-bold text-negative"
              >
                <div class="col-4">AUTH CODE :</div>
                <div class="col-4 text-right">
                  {{ basicInfo.auth_code }}
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
          <q-inner-loading :showing="visible">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </q-card>
        <q-card class="my-card q-mt-md">
          <q-tabs
            v-model="historyTab"
            active-color="info"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="leaveHistory" label="Leave History" />
            <q-tab name="infractionHistory" label="Infraction History" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="historyTab" animated>
            <q-tab-panel name="leaveHistory" class="q-pa-none">
              <LeaveHistory v-if="!loading" :profile="basicInfo" />
            </q-tab-panel>
            <q-tab-panel name="infractionHistory" class="q-pa-none">
              <InfractionHistory v-if="!loading" :profile="basicInfo" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
      <div class="col-3 q-px-md">
        <!--Family Info -->
        <q-card class="my-card q-mb-md">
          <q-toolbar>
            <q-toolbar-title class="text-md">
              Family Information</q-toolbar-title
            >
            <q-btn
              flat
              round
              dense
              icon="mode_edit"
              size="10px"
              class="q-mr-xs"
              @click="familyModal = true"
            />
          </q-toolbar>
          <q-separator />
          <q-card-section class="p-0">
            <q-item>
              <q-item-section>
                <q-item-label class="font-bold">Spouse</q-item-label>
                <q-item-label caption lines="2">
                  {{ familyInfo.spouse || "[empty]" }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="font-bold">Father's Name</q-item-label>
                <q-item-label caption lines="2">
                  {{ familyInfo.father || "[empty]" }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="font-bold"
                  >Father's Occupation</q-item-label
                >
                <q-item-label caption lines="2">
                  {{ familyInfo.father_occupation || "[empty]" }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="font-bold">Mother's Name</q-item-label>
                <q-item-label caption lines="2">
                  {{ familyInfo.mother || "[empty]" }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="mb-5">
              <q-item-section>
                <q-item-label class="font-bold"
                  >Mother's Occupation</q-item-label
                >
                <q-item-label caption lines="2">
                  {{ familyInfo.mother_occupation || "[empty]" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
        <!-- In Case of Emergency -->
        <q-card class="my-card mb-5">
          <q-toolbar class="bg-negative text-white">
            <q-toolbar-title class="text-md">
              In Case of Emergency</q-toolbar-title
            >
            <q-btn
              flat
              round
              dense
              icon="mode_edit"
              size="10px"
              class="q-mr-xs"
            />
          </q-toolbar>
          <q-separator />
          <q-card-section class="p-0" v-if="emergencyInfo">
            <q-item>
              <q-item-section>
                <q-item-label class="font-bold">Contact Name</q-item-label>
                <q-item-label
                  caption
                  lines="2"
                  v-if="!emergencyEditName"
                  @click="emergencyEditName = true"
                >
                  {{ emergencyInfo?.name || "[empty]" }}
                </q-item-label>
                <q-input
                  v-if="emergencyEditName"
                  dense
                  v-model="emergencyInfo.name"
                  @keypress.enter="
                    saveEmergencyInfo('name'), (emergencyEditName = false)
                  "
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="font-bold">Contact Number</q-item-label>
                <q-item-label
                  caption
                  lines="2"
                  v-if="!emergencyEditNumber"
                  @click="emergencyEditNumber = true"
                >
                  {{ emergencyInfo.number || "[empty]" }}
                </q-item-label>
                <q-input
                  v-if="emergencyEditNumber"
                  dense
                  v-model="emergencyInfo.number"
                  @keypress.enter="
                    saveEmergencyInfo('number'), (emergencyEditNumber = false)
                  "
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="font-bold">Contact Relation</q-item-label>
                <q-item-label
                  caption
                  lines="2"
                  v-if="!emergencyEditRelation"
                  @click="emergencyEditRelation = true"
                >
                  {{ emergencyInfo.relation || "[empty]" }}
                </q-item-label>
                <q-input
                  v-if="emergencyEditRelation"
                  dense
                  v-model="emergencyInfo.relation"
                  @keypress.enter="
                    saveEmergencyInfo('relation'),
                      (emergencyEditRelation = false)
                  "
                />
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="dialogBox" transition-show="scale">
      <q-card class="q-pa-none" style="width: 600px">
        <q-card-section class="q-pa-none">
          <edit-employee-info
            :basic-info="basicInfo"
            :constant="constant"
            @update="handleEmit()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editMeModal" transition-show="scale">
      <edit-about-me
        :basicDetails="basicInfo"
        :addressDetails="addressInfo"
        :constant="constant"
        @update="handleEmit(), (editMeModal = false)"
      />
    </q-dialog>
    <q-dialog v-model="familyModal" transition-show="scale">
      <edit-family-info
        :basic="basicInfo"
        @update="handleEmit(), (familyModal = false)"
      />
    </q-dialog>
    <q-dialog v-model="generateAccountModal" transition-show="scale">
      <generate-account
        :basic-info="basicInfo"
        @update="handleEmit(), (generateAccountModal = false)"
      />
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { hr_api } from "boot/axios";
import { useQuasar, date } from "quasar";
import HeaderLayout from "../../layouts/HeaderLayout.vue";
import { useConstants } from "src/stores/constants";
import GenerateAccount from "../../components/auth/GenerateAccount.vue";
import EditEmployeeInfo from "../../components/hr/EditEmployeeInfo.vue";
import EditAboutMe from "../../components/hr/EditAboutMe.vue";
import EditFamilyInfo from "../../components/hr/EditFamilyInfo.vue";
import EducationalBackground from "../../components/hr/EducationalBackground.vue";
import InsuranceList from "../../components/insurance/InsuranceList.vue";
import LeaveHistory from "../../components/hr/LeaveHistory.vue";
import InfractionHistory from "../../components/infractions/InfractionHistory.vue";
import TeamLeadAssignment from "../../components/hr/TeamLeadAssignment.vue";

const apiUrl = ref(process.env.HR_API_URL);
const baseUrl = ref(process.env.BASE_URL);
const logo = ref(process.env.COMPANY_LOGO);
const dialogBox = ref(false);
const $q = useQuasar();
const constant = useConstants();
const route = useRoute();
const tab = ref("salaryAndBenefits");
const historyTab = ref("leaveHistory");
const employeeID = route.params.id;
const loading = ref(false);
const visible = ref(true);
const editable = ref(false);
const pos = [];
const positionOptions = ref(pos);
const religion = [];
const religionOptions = ref(religion);
const timeShift = [];
const timeShiftOptions = ref(timeShift);
const timeShiftSelect = ref();

const editMeModal = ref(false);
const familyModal = ref(false);
const generateAccountModal = ref(false);
const teamLeadModal = ref(false);
const removeUserModal = ref(false);

const salaryEdit = ref(false);
const sssEdit = ref(false);
const colaEdit = ref(false);
const phEdit = ref(false);
const pagIbigEdit = ref(false);
const tinEdit = ref(false);
const bankEdit = ref(false);
const emergencyEditName = ref(false);
const emergencyEditNumber = ref(false);
const emergencyEditRelation = ref(false);
const qrUrl = ref("");
const upload = ref(false);
const file = ref();
const timeShiftInfo = ref({});

const hasSystemAccess = ref(false);

const rd = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];
const rdOptions = ref(rd);

const basicInfo = ref({
  lastname: "",
  firstname: "",
  middlename: "",
  birthdate: "",
  height: "",
  weight: "",
  eyeColor: "",
  religion: {},
  avatar: "logo.png",
});

const employeeInfo = ref({
  employee_id: "",
  workplace: {},
  position: {
    position: "",
    department: {},
  },
  section: {},
  dateHired: "",
  sectionForPayroll: "",
  shift_group_id: {},
  em_status: {},
  rest_day: 0,
});

const addressInfo = ref({
  street: "",
  barangay: {},
  city: {
    province: {},
  },
});

const familyInfo = ref({
  spouse: "",
  father: "",
  father_occupation: "",
  mother: "",
  mother_occupation: "",
});

const emergencyInfo = ref({
  id: 0,
  name: "",
  number: "",
  relation: "",
});

const getRestDay = (day) => {
  const rd = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return rd[day];
};

const accountStatus = (status) => {
  const aStatus = ["Deactivated", "Active", "Suspended", "Resigned"];

  return aStatus[status];
};

const onUploadedFile = async () => {
  console.log("Uploaded File");
  location.reload();
};

const handleEmit = async () => {
  await loadData();
  dialogBox.value = false;

  $q.notify({
    color: "positive",
    position: "top",
    message: "Successfully Updated",
    icon: "check",
  });
};

const saveEmergencyInfo = async (column) => {
  const value = emergencyInfo.value[column];
  const details = {
    [column]: value,
  };
  await hr_api
    .patch("profile/emergency/" + emergencyInfo.value.id, details)
    .then((response) => {
      if (response.status == 200) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "Successfully Saved",
          icon: "done",
        });
      }
    });
};

const saveEmployeeInfo = async (column) => {
  const value = employeeInfo.value[column];
  const details = {
    [column]: value,
  };
  await hr_api
    .patch("employee/info/" + basicInfo.value.user_id, details)
    .then((response) => {
      if (response.status == 200) {
        $q.notify({
          color: "positive",
          position: "top",
          message: "Successfully Saved",
          icon: "done",
        });
      }
    });
};

const saveTimeShift = async () => {
  console.table(timeShiftSelect.value);
  const timeShiftDetails = {
    time_shift: timeShiftSelect.value.ps_id,
  };
  await hr_api
    .patch(
      "employee/timeShift/details/" + employeeInfo.value.employee_id,
      timeShiftDetails
    )
    .then((response) => {
      if (response.status == 200) {
        timeShiftInfo.value = {
          ps_id: timeShiftSelect.value.ps_id,
          ps_from: timeShiftSelect.value.ps_from,
          ps_to: timeShiftSelect.value.ps_to,
        };
        $q.notify({
          color: "positive",
          position: "top",
          message: "Successfully Updated",
          icon: "check",
        });
      }
    });
};

const getReligion = async (val, update, abort) => {
  if (religion.length == 0) {
    await hr_api.get("profile/religion/all").then((response) => {
      for (const res in response.data) {
        religion.push(response.data[res]);
      }
    });
  }

  update(() => {
    const needle = val.toLowerCase();
    religionOptions.value = religion.filter(
      (v) => v.religion.toLowerCase().indexOf(needle) > -1
    );
  });
};

const getTimeshift = async (val, update, abort) => {
  if (timeShift.length == 0) {
    await hr_api
      .get("employee/timeShift/" + employeeInfo.value.workplace.id)
      .then((response) => {
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

const removeUser = async () => {
  const details = {
    user: basicInfo.value.user,
    userId: basicInfo.value.user_id,
  };
  await hr_api.post("profile/removeUserAccount/", details).then((response) => {
    basicInfo.value.user = 0;
  });
};

const loadData = async () => {
  loading.value = true;
  await hr_api.get("profile/" + employeeID).then((response) => {
    loading.value = false;
    visible.value = false;

    basicInfo.value = response.data;
    console.log("basicInfo : ", basicInfo.value);
    hasSystemAccess.value = basicInfo.value.user > 0 ? true : false;
    if (response.data.address && response.data.address.length > 0) {
      addressInfo.value = response.data.address[0];
    }
    employeeInfo.value = response.data.employee;
    if (response.data.family_details != "" && response.data.family_details) {
      familyInfo.value = JSON.parse(response.data.family_details);
    }
    if (response.data.profileEmergency) {
      emergencyInfo.value = response.data.profileEmergency[0];
    }
    if (response.data.employee.time_shift) {
      timeShiftInfo.value = response.data.employee.time_shift;
    }

    generateQR();
  });
  // .catch(() => {
  //   $q.notify({
  //     color: "negative",
  //     position: "top",
  //     message: "Loading failed",
  //     icon: "report_problem",
  //   });
  // });
};

const generateQR = () => {
  let qrDetails = "{";
  qrDetails += `"name":"${basicInfo.value.firstname.toUpperCase()} ${basicInfo.value.lastname.toUpperCase()}",`;
  qrDetails += `"id":"${employeeID}",`;
  qrDetails += '"image":"' + apiUrl.value + basicInfo.value.avatar + '"}';
  console.log();
  qrUrl.value =
    "https://quickchart.io/qr?text=" + encodeURIComponent(`${qrDetails}`);
};

loadData();

const formatTime = (dateTime) => {
  const d = date.formatDate(Date.now(), "YYYY-MM-DD");
  return date.formatDate(d + " " + dateTime, "hh:mm:ss a");
};
</script>

<style lang="scss" scoped>
.my-card {
  min-height: 335px !important;
}
</style>
