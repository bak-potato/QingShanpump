import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../views/MainContent.vue'),
          meta: { requiresAuth: true } // 需要登录
        },
        {
          path: '/store',
          name: 'store',
          component: () => import('../views/RightBody/DShop.vue'),
          meta: { requiresAuth: true } // 需要登录
        },
        {
          path: '/questionmanage',
          name: 'questionmanage',
          component: () => import('../views/Manage/QuestionManagement.vue'),
          meta: { requiresAuth: true } // 需要登录
        },
        {
          path: '/SoftwareManagement',
          name: 'SoftwareManagement',
          component: () => import('../views/Manage/SoftwareManagement.vue'),
          meta: { requiresAuth: true } // 需要登录
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('../views/UserView.vue'),
          meta: { requiresAuth: true } // 需要登录
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = checkAuth(); // 检查用户是否登录

  if (to.meta.requiresAuth && !isAuthenticated) {
    // 如果路由需要登录且用户未登录，则跳转到登录页面
    next({ name: 'login' });
  } else {
    // 否则继续导航
    next();
  }
});

// 模拟检查用户是否登录的函数
function checkAuth() {
  // 这里可以根据实际情况判断用户是否登录
  // 例如检查 localStorage 或 Vuex 中的登录状态
  return localStorage.getItem('isLoggedIn') === 'true';
}

export default router;
