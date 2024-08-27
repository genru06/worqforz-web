
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
        meta: { roles: ["SUPER", "Manager", "HUMAN RESOURCE"], name: 'Human Resource' }
      },
      {
        path: '/members/profile', component: () => import('pages/DashboardPage.vue'),
        beforeEnter() { location.href = process.env.COOP_URL + 'members/profile' },
        meta: { roles: ["SUPER", "Manager", "Loan Officer", "Coop Coordinator"], name: 'COOP MANAGEMENT' }
      },
      {
        path: '/payroll/create/', component: () => import('pages/payroll/CreatePayrollPage.vue'),
        meta: { roles: ["SUPER", "Manager", "Payroll Officer", "BILLING AND ACCOUNTS"], name: 'Create Payroll' }
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
        path: 'man-hours/:payrollPeriod?', component: () => import('pages/payroll/ViewManHoursPage.vue'),
        meta: { roles: ["SUPER", "HUMAN RESOURCE", "BILLING AND ACCOUNTS"], name: 'Man Hours' }
      },
      {
        path: '/attendance/dts/:workplace/:dept_id?',
        component: () => import('pages/attendance/DailyTimeSheet.vue'),
        meta: { roles: ["SUPER", "Human Resource", "Time Keeper"], name: 'Daily Time Sheet' }
      },
      {
        path: 'create/:payrollPeriod?/:page?/:offset?/:limit?', component: () => import('pages/payroll/CreatePayrollPage.vue'),
        meta: { roles: ["SUPER", "Manager", "Payroll Officer", "BILLING AND ACCOUNTS"], name: 'Create Payroll' }
      }
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
