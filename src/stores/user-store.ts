import { Buffer } from 'buffer';
import { defineStore } from 'pinia';
import { Cookies, LocalStorage } from 'quasar';
import { auth_api, hr_api } from 'src/boot/axios';

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      id: null,
      name: LocalStorage.getItem('user') ? LocalStorage.getItem('user')['name'] : null,
      // employeeNumber: LocalStorage.getItem('user') ? LocalStorage.getItem('user').employeeNumber : null,
      coopAccountNumber: null,
      position: null,
      isLogin: LocalStorage.getItem('is_login') || false,
      token: LocalStorage.getItem('access_token') || '',
      response: [],
    }
  },
  getters: {
    getId: (state) => state.id,
    getName: (state) => state.name,
    // getEmployeeNumber: (state) => state.employeeNumber,
    getCoopAccountNumber: (state) => state.coopAccountNumber,
    getPosition: (state) => state.position,
    getIsLogin: (state) => state.isLogin,
    getResponse: (state) => state.response
  },
  actions: {
    //   async register(details: object) {
    //     try {
    //       await hr_api.post('auth/sign-up', details).then((res) => {
    //         this.$state.response = res.data
    //       })
    //     } catch (error) {
    //       if (error) throw error
    //     }
    //   },

    async login(username, password) {
      try {
        await auth_api.post('auth/login', { username, password }).then(async (res) => {
          if (res.data.isValidated) {
            this.token = res.data.access_token
            LocalStorage.set('access_token', this.token)
            Cookies.set('access_token', this.token, { domain: process.env.DOMAIN })
            LocalStorage.set('is_login', true)
            LocalStorage.set('appId', res.data.user.application.client_id)
            this.$state.response = res.data
            const profile = await hr_api.get('profile/getByUserAccount/' + res.data.id).then();
            const payload = {
              id: res.data.id,
              name: res.data.user.uname,
              isActive: res.data.user.isActive,
              isValidated: res.data.isValidated,
              roles: res.data.user.roles,
              profile: profile.data
            }

            LocalStorage.set('user', payload);
            Cookies.set('user', JSON.stringify(payload), { domain: process.env.DOMAIN })
            this.setUser(payload)
          } else {
            this.$state.response = res.data
            return res.data
          }
        })
      } catch (error) {
        if (error) throw error
      }
    },

    //   async validateAuthCode(username: string, password: string, authCode: string) {
    //     try {
    //       await hr_api.post('auth/validate/' + authCode, { username, password }).then(async (res) => {
    //         if (res.data.isValidated) {
    //           this.token = res.data.token
    //           LocalStorage.set('access_token', res.data.token)
    //           this.isLogin = true
    //           this.$state.response = res.data
    //         } else {
    //           this.$state.response = res.data
    //           return res.data
    //         }
    //       })
    //     } catch (error) {
    //       if (error) throw error
    //     }
    //   },
    parseJwt(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(Buffer.from(base64, "base64").toString("ascii").split("").map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    },


    //   async fetchUser() {
    //     try {
    //       return await hr_api.get('auth/user')
    //     } catch (error) {
    //       if (error) throw error
    //     }
    //   },

    setLocalStorage() {
      const user = Cookies.get("user");
      LocalStorage.set('user', user);
      return user;
    },
    setUser(payload) {
      if (payload.id) this.id = payload.id
      if (payload.name) this.name = payload.name
      if (payload.employeeNumber) this.employeeNumber = payload.employeeNumber
      if (payload.position) this.position = payload.position
      if (payload.isLogin) this.isLogin = payload.isLogin
      if (payload.token) this.token = payload.token
    },

    clearUser() {
      this.id = null,
        this.employeeNumber = null
      this.isLogin = false
      this.position = null
      this.token = ''
      this.response = []
      LocalStorage.clear();
      Cookies.remove('access_token')
      Cookies.remove('user')
    }
  },
});
