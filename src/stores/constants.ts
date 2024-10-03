import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { hr_api } from 'src/boot/axios';

export const useConstants = defineStore('contantsStore', {
  state: () => ({
    workplace: LocalStorage.getItem('workplace') || {},
    departments: LocalStorage.getItem('departments') || {},
    sections: LocalStorage.getItem('sections') || {},
    socketID: ''
  }),

  getters: {
    getWorkplace: (state) => state.workplace,
    getDepartments: (state) => state.departments,
    getSections: (state) => state.sections,
    getSocketID: (state) => state.socketID
  },

  actions: {
    async fetchAllWorkplace() {
      await hr_api.get('profile/workplace/all').then((response) => {
        LocalStorage.setItem('workplace', response.data)
        this.workplace = response.data;
      })
    },
    async fetchDepartments() {
      await hr_api.get('employee/department/all').then((response) => {
        LocalStorage.setItem('departments', response.data);
        this.departments = response.data
      })
    },
    fetchSections() {
      hr_api.get('profile/sections/all').then((response) => {
        LocalStorage.setItem('sections', response.data);
        this.departments = response.data
      })
    },
    setSocketID(socketID) {
      this.socketID = socketID;
      LocalStorage.setItem('socketID', socketID)
    },


    evaluateExpression(expression, variables) {
      const sanitizedExpression = expression.replace(/[^\w\s+\-*/().]/g, ""); // Remove any potentially dangerous characters
      const keys = Object.keys(variables);
      const values = Object.values(variables);

      // Create a new function with the variables in the context
      const functionBody = `
    const { ${keys.join(", ")} } = arguments[0];
    return ${sanitizedExpression};
  `;

      return new Function(functionBody)(variables);
    },

    generatePassword() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
      }
      return result;
    },
    numberWithCommas(x) {
      if (x == null) {
        x = 0;
      }
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    getFirstLetters(str) {
      return str
        .split(/\W+/)
        .map((word) => word[0])
        .join("");
    }

  }
});
