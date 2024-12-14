<template>
    <q-card dense>
        <q-toolbar class="bg-white text-black ">
            <q-btn
                flat
                round
                dense
                icon="schedule"
            />
            <q-toolbar-title>
                OT Request
            </q-toolbar-title>
            <q-btn
                flat
                round
                dense
                icon="apps"
                class="q-mr-xs"
            />
            <q-btn
                flat
                round
                dense
                icon="more_vert"
            />
        </q-toolbar>
        <q-separator spaced />
        <q-card-section class="q-pa-none">
            <q-table
                title="Employees with OT Request"
                dense
                :rows="otTableRows"
                :columns="columns"
                row-key="name"
            >
                <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                        <q-btn
                            class="q-mr-xs"
                            dense
                            size="sm"
                            color="primary"
                            label="Approve"
                            @click="(v) => approveRequest(true, props.row.id)"
                        />
                        <q-btn
                            dense
                            size="sm"
                            color="negative"
                            label="Deny"
                            @click="onClick"
                        />
                    </q-td>
                </template>
            </q-table>
        </q-card-section>
    </q-card>
</template>

<script setup>
    import { date, useQuasar } from 'quasar';
    import { hr_api } from 'src/boot/axios';
    import { ref } from 'vue';

    const otTableRows = ref([])
    const $q = useQuasar();

    const getOTRequest = async () => {

        await hr_api.get('attendance/ot/request').then(response => {
            otTableRows.value = []
            let count = 0;
            for (const res of response.data) {
                console.log(res)
                count++;
                otTableRows.value.push({
                    count: count,
                    id: res.id,
                    employee: res.employee.lastname + ', ' + res.employee.firstname,
                    workplace: res.employee.employee.workplace.name,
                    purpose: res.ot_purpose,
                    overtimeDate: date.formatDate(res.ot_date, "MMMM DD, YYYY")
                })
            }
        })
    }

    const approveRequest = async (status, id) => {
        const details = {
            status: status,
            id: id
        }
        await hr_api.post('attendance/ot/approve/request', details).then(response => {
            if (status) {
                $q.notify({
                    color: "positive",
                    position: "top",
                    message: "Overtime Request is Successfully Approved",
                    icon: "check",
                });
                getOTRequest()
            }
        })

    }

    const columns = [
        {
            name: "count",
            label: "#",
            align: "center",
            field: "count",
            headerStyle: 'width:10px;'
        },
        {
            name: "employee",
            label: "Name of Employee",
            align: "left",
            field: "employee",
        },
        {
            name: "workplace",
            label: "Workplace",
            align: "left",
            field: "workplace",
        },
        {
            name: "overtimeDate",
            label: "Date of OT",
            align: "left",
            field: "overtimeDate",
        },
        {
            name: "purpose",
            label: "Purpose",
            align: "left",
            field: "purpose",
        },
        {
            name: "actions",
            label: "",
            align: "right",
            field: "actions",
        },
    ]

    getOTRequest();
</script>

<style lang="scss" scoped></style>