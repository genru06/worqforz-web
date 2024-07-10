import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useUserStore } from 'src/stores/user-store';
import { Cookies, LocalStorage } from 'quasar';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })



  Router.beforeEach((to, from, next) => {
    const auth = useUserStore();
    const token = Cookies.get('access_token')
    const user = Cookies.get('user');

    if (user) {
      const roles = user.roles;
      var routeRoles = [];
      // console.log('metaRoles', to.meta.roles)
      if (to.meta.roles != undefined) routeRoles = to.meta.roles;
      if (routeRoles.includes(roles) || routeRoles.includes('any')) {
        if (token) {
          const JwtPayLoad = auth.parseJwt(token);
          if (JwtPayLoad.exp < (Date.now() / 1000)) {
            auth.clearUser();
            next({ path: '/login', replace: true, query: { redirect: to.fullPath } })
          } else {
            next();
          }
        } else {
          next({ path: '/login', replace: true, query: { redirect: to.fullPath } })
        }
      } else {
        next()
      }
    } else {

      if (to.path !== '/login') {
        next({ path: '/login' }); // Redirect to '/Login' path
        // next();
      } else {
        next(); // Allow navigation to the destination since we're already on the redirect path
      }
    }

  })

  return Router
})
