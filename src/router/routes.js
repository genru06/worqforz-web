
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/dashboard', component: () => import('pages/DashboardPage.vue'),
        meta: { roles: ["any"], name: 'Dashboard' }
      },
      {
        path: '/hr/dashboard', component: () => import('pages/hr/HrDashboardPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE"], name: 'Human Resource' }
      },
      {
        path: 'monitoring', component: () => import('pages/hr/EmployeeMasterList.vue'),
        meta: { roles: ["SUPER", "DESIGN ASSOCIATE", "CFO / PRINCIPAL ARCHITECT"], name: 'Construction Monitoring' }
      },
      {
        path: '/payroll/create', component: () => import('pages/payroll/CreatePayrollPage.vue'),
        meta: { roles: ["SUPER", , "BILLING AND ACCOUNTS"], name: 'Create Payroll' }
      }

    ]
  },
  {
    path: '/hr',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'employee/list', component: () => import('pages/hr/EmployeeMasterList.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE"], name: 'Employee Masterlist' }
      },
      {
        path: 'employee/details/:id', component: () => import('pages/hr/EmployeeDetails.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE"], name: 'Employee Details' }
      },
      {
        path: 'employee/infraction', component: () => import('pages/hr/InfractionManagementPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE"], name: 'Infraction Management' }
      },
      {
        path: 'employee/leave', component: () => import('pages/hr/LeaveManagementPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE"], name: 'Leave Management' }
      },
      {
        path: '/settings', component: () => import('pages/SettingsPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE"], name: 'Hr Settings' }
      },
      {
        path: 'training', component: () => import('pages/hr/training/TrainingManagementPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE"], name: 'Hr Settings' }
      }

    ]
  },

  {
    path: '/payroll',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'man-hours', component: () => import('pages/payroll/ViewManHoursPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE", "BILLING AND ACCOUNTS"], name: 'Man Hours' }
      },
      {
        path: '/attendance/dts/:workplace/:dept_id?',
        component: () => import('pages/attendance/DailyTimeSheet.vue'),
        meta: { roles: ["SUPER", "Human Resource", "Time Keeper"], name: 'Daily Time Sheet' }
      },
    ]
  },
  {
    path: '/scan',
    component: () => import('pages/attendance/scanQRPage.vue'),
    meta: { roles: ["SUPER", "Human Resource", "Time Keeper"], name: 'Attendance Scanning' }
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
