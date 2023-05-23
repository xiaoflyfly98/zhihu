import { createRouter, createWebHistory } from 'vue-router'
import { instance } from './request'
import store from './store'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Column from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import signup from './views/SignUp.vue'
import Post from './views/PostDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: Column
    },
    {
      path: '/CreatePost',
      name: 'createpost',
      component: CreatePost,
      meta: { requiresLogin: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: signup
    },
    {
      path: '/post/:id',
      name: 'post',
      component: Post
    }
  ]
})

router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { redirectAlreadyLogin, requiresLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      instance.defaults.headers.common.Authorization = `name ${token}`
      store.dispatch('fetchCurrent').then(() => {
        if (redirectAlreadyLogin) {
          next('login')
        } else {
          next()
        }
      }).catch(e => {
        console.log(e)
        store.commit('loginout')
        next('login')
      })
    } else {
      if (requiresLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})
export default router
