import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layout/HomeView.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../layout/MainContent.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'store',
          name: 'store',
          component: () => import('../views/RightBody/DShop.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'official',
          name: 'official',
          component: () => import('../views/RightBody/officialDshop.vue'),
        },
        {
          path: 'community',
          name: 'community',
          component: () => import('../views/RightBody/CommunityView.vue'),
        },
        {
          path: 'createpost',
          name: 'CreatePost',
          component: () => import('../views/Post/CreatePost.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'post',
          name: 'PostMain',
          component: () => import('../views/Post/PostMain.vue'),
        },
        {
          path: 'postdetail',
          name: 'PostDetail',
          component: () => import('../views/Post/PostDetail.vue'),
        },
        {
          path: 'editpost',
          name: 'EditPost',
          component: () => import('../views/Post/EditPost.vue'),
        },
        {
          path: 'answer',
          name: 'answer',
          component: () => import('../views/RightBody/Answer.vue'),
        },
        {
          path: 'questionmanage',
          name: 'questionmanage',
          component: () => import('../views/Manage/QuestionManagement.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'applist',
          name: 'applist',
          component: () => import('../views/Manage/AppList.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'SoftwareManagement',
          name: 'SoftwareManagement',
          component: () => import('../views/Manage/SoftwareManagement.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('../views/UserBody/userContent/UserView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'usermanage',
          name: 'usermanage',
          component: () => import('../views/AdminManage/UserManageView.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'usermanage1',
          name: 'usermanage1',
          component: () => import('../views/AdminManage/USEMAN.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'ApplicationManagement',
          name: 'ApplicationManagement',
          component: () => import('../views/AdminManage/ApplicationManagement.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'VueDataAnalyticsPanel',
          name: 'VueDataAnalyticsPanel',
          component: () => import('../views/AdminManage/VueDataAnalyticsPanel.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'ApplicationReview',
          name: 'ApplicationReview',
          component: () => import('../views/AdminManage/ApplicationReview.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },{

          path: 'AnnouncementManagement',
          name: 'AnnouncementManagement',
          component: () => import('../views/AdminManage/AnnouncementManagement.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'ForumManView',
          name: 'ForumManView',
          component: () => import('../views/AdminManage/ForumManView.vue'),
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'charmanage',
          name: 'charmanage',
          component: () => import('../views/AdminManage/CharManage.vue'),
        },
        {
          path: 'AnswerIns',
          name: 'AnswerIns',
          component: () => import('../views/RightBody/AnswerIns.vue'),
        },
        {
          path: 'AIGirlfriend',
          name: 'AIGirlfriend',
          component: () => import('../views/bookmark/AIGirlfriend.vue'),
        },

        {
          path: 'SearchFriend',
          name: 'SearchFriend',
          component: () => import('../views/RightBody/SearchFriend.vue'),
        },
        {
          path: 'OpenPageManager',
          name: 'OpenPageManager',
          component: () => import('../views/bookmark/OpenPageManager.vue'),
        },
      ],

    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/UserBody/userLogin/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/UserBody/userRegister/RegisterView.vue'),
    },
    {
      path: '/ScoringContent',
      name: 'ScoringContent',
      component: () => import('../views/Scoring/ScoringContent.vue'),
    },
    {
      path: '/PhoneVue',
      name: 'PhoneVue',
      component: () => import('../views/PhoneVue/PhoneVue.vue'),
    }
    ,
    {
      path: '/403',
      name: 'Forbidden',
      component: () => import('../views/errors/403Vue.vue'),
    }, {
      path: '/:pathMatch(.*)*', // 匹配所有未定义的路由
      name: 'NotFound',
      component: () => import('../views/errors/404Vue.vue'),
    },

  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

router.beforeEach(async (to, from, next) => {
  // 添加路由跳转日志便于调试
  console.log(`Navigating from ${from.path} to ${to.path}`);

  const isAuthenticated = checkAuth();
  const userRole = localStorage.getItem('userRole') || '';

  // 需要登录但未登录
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirecting to login: authentication required');
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // 需要管理员权限但不是管理员
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    console.log('Redirecting to 403: admin role required');
    return next({ name: 'Forbidden' });
  }

  // 确保总是调用 next()
  next();
});
router.afterEach((to, ) => {
  console.log(`Navigation complete to ${to.path}`);
});

function checkAuth() {
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
  console.log(`Authentication check: ${loggedIn}`);
  return loggedIn;
}
export default router;
