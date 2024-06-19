import { defineStore } from 'pinia';
import { LocalStorage } from 'quasar';
import { api } from 'src/boot/axios';

export const useAttendanceStore = defineStore('attendanceStore', {
  state: () => ({
    attendance: LocalStorage.getItem('attendance') || null
  }),

  actions: {
    setAttendance(details: any) {
      LocalStorage.set('attendance', details)
      
    }
  }

})