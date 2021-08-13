import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import firebase from 'firebase'

Vue.use(VueRouter)

const firebaseConfig = {
  apiKey: "AIzaSyDCMGRRGCTm7AwF16oBAjtJjE0r_pPdmNM",
  authDomain: "projeto-devweb-1.firebaseapp.com",
  projectId: "projeto-devweb-1",
  storageBucket: "projeto-devweb-1.appspot.com",
  messagingSenderId: "88045591438",
  appId: "1:88045591438:web:99e61f6f790f6a6226e2df"
}

firebase.initializeApp(firebaseConfig)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "Register" */ '../components/Register.vue'),
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/todo-list',
    name: 'TodoList',
    component: () => import('../components/TodoList.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched[0].path == '/todo-list') {
    if (firebase.auth().currentUser) {
      next()
    } else {
      alert('You are not logged in going back to the login page')
      router.push('/')
    }
  } else {
    next()
  }
})

export default router
