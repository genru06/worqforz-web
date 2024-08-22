
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/IndexPage.vue') },

      {
        path: '/dashboard', component: () => import('pages/DashboardPage.vue'),
        meta: { roles: ["any"], name: 'Dashboard' }
      }, {
        path: '/hr/dashboard', component: () => import('pages/hr/HrDashboardPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE DEPARTMENT HEAD", "CFO / PRINCIPAL ARCHITECT"], name: 'Human Resource' }
      },
      {
        path: '/monitoring', component: () => import('pages/DashboardPage.vue'),
        beforeEnter() { location.href = process.env.KONTRAKTOR_URL + 'monitoring' },
        meta: { roles: ["SUPER", "DESIGN ASSOCIATE", "CFO / PRINCIPAL ARCHITECT"], name: 'Construction Monitoring' }
      },
      {
        path: '/payroll/create/', component: () => import('pages/payroll/CreatePayrollPage.vue'),
        meta: { roles: ["SUPER", "Manager", "PAYROLL OFFICER", "BILLING AND ACCOUNTS", "CFO / PRINCIPAL ARCHITECT"], name: 'Create Payroll' }
      }

    ]
  },
  {
    path: '/hr',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'employee/list', component: () => import('pages/hr/EmployeeMasterList.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE DEPARTMENT HEAD"], name: 'Employee Masterlist' }
      },
      {
        path: 'employee/details/:id', component: () => import('pages/hr/EmployeeDetails.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE DEPARTMENT HEAD"], name: 'Employee Details' }
      },
      {
        path: 'employee/infraction', component: () => import('pages/hr/InfractionManagementPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE DEPARTMENT HEAD"], name: 'Infraction Management' }
      },
      {
        path: 'employee/leave', component: () => import('pages/hr/LeaveManagementPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE DEPARTMENT HEAD"], name: 'Leave Management' }
      },
      {
        path: '/settings', component: () => import('pages/SettingsPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE DEPARTMENT HEAD"], name: 'Hr Settings' }
      },
      {
        path: 'training', component: () => import('pages/hr/training/TrainingManagementPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE DEPARTMENT HEAD"], name: 'Hr Settings' }
      }

    ]
  },

  {
    path: '/payroll',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'man-hours', component: () => import('pages/payroll/ViewManHoursPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE DEPARTMENT HEAD", "BILLING AND ACCOUNTS"], name: 'Man Hours' }
      },
      {
        path: 'man-hours/:payrollPeriod?', component: () => import('pages/payroll/ViewManHoursPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE DEPARTMENT HEAD", "BILLING AND ACCOUNTS"], name: 'Man Hours' }
      },
      {
        path: '/attendance/dts/:workplace/:dept_id?',
        component: () => import('pages/attendance/DailyTimeSheet.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE DEPARTMENT HEAD", "TIME KEEPER"], name: 'Daily Time Sheet' }
      },
      {
        path: 'create/:payrollPeriod?/:page?/:offset?/:limit?', component: () => import('pages/payroll/CreatePayrollPage.vue'),
        meta: { roles: ["SUPER", "Manager", "PAYROLL OFFICER", "BILLING AND ACCOUNTS"], name: 'Create Payroll' }
      }
    ]
  },
  {
    path: '/scan',
    component: () => import('pages/attendance/scanQRPage.vue'),
    meta: { roles: ["SUPER", "HUMAN RESOURCE DEPARTMENT HEAD", "TIME KEEPER"], name: 'Attendance Scanning' }
  },
  {
    path: '/dashboard/time-keeper',
    component: () => import('pages/attendance/TimeKeeperDashboardPage.vue'),
    meta: { roles: ["SUPER", "TIME KEEPER"], name: 'Time Keeper Dashboard' }
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    roles: ["any"]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
