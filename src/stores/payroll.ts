import { defineStore } from 'pinia';
import { hr_api } from 'src/boot/axios';

export const usePayrollStore = defineStore('payrollStore', {
  state: () => ({
    columns: '',
    charges: []
  }),

  getters: {
    getColumns: (state) => state.columns
  },

  actions: {
    reset() {
      this.columns = ''
    },
    async fetchColumnUsed(ppId) {
      const col = [];
      col.push({
        name: 'name',
        required: true,
        label: 'Name of Employee',
        align: 'left',
        field: 'name',
        sortable: true,
        headerClasses: 'frozen-column first',
        headerStyle: 'width:180px !important'
      },
        {
          name: 'position',
          required: true,
          label: 'Position',
          align: 'center',
          field: 'position',
          headerClasses: 'frozen-column second',
          headerStyle: 'min-width:170px !important'
        },
        {
          name: 'gross_pay',
          required: true,
          label: 'Gross Pay',
          align: 'right',
          field: 'gross_pay',
          headerClasses: 'frozen-column third',
          headerStyle: 'min-width:100px !important'
        });

      await hr_api.get('payroll/charges/' + ppId).then((response) => {
        this.charges = response.data;
        for (const r in response.data) {
          col.push({
            name: response.data[r].columns,
            required: true,
            label: response.data[r].label,
            align: 'right',
            field: response.data[r].columns,
            classes: 'editable',
            formula: response.data[r].formula,
            category: response.data[r].category
          });
        }

        col.push({
          name: 'deductions',
          required: true,
          label: 'Total Deduction',
          align: 'right',
          field: 'deductions',
        });

        col.push({
          name: 'net_pay',
          required: true,
          label: 'Net Pay',
          align: 'right',
          field: 'net_pay',
        });

        col.push({
          name: 'actions',
          label: 'ACTION',
          align: 'center',
          field: 'actions'
        });
      });
      this.$state.columns = JSON.stringify(col)
    },

    async getCharges(ppId, profileId, workplace, grossPay) {
      const statBen = await hr_api.get('payroll/statBen' + ppId + '/' + profileId + '/' + workplace + '/' + grossPay).then()
      console.log(statBen)
    }
  }
});