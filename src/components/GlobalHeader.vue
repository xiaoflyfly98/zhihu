<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
      <router-link to="/" class="navbar-brand" href="#">知乎专栏</router-link>
      <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link></li>
      <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
      </ul>
      <ul v-else class="list-inline mb-0">
      <li class="list-inline-item">
        <DropDown :title="`你好${user.nickName}`" >
          <DropDownitem><router-link to="/CreatePost" class="dropdown-item">新建文章</router-link></DropDownitem>
          <DropDownitem disabled><a href="#" class="dropdown-item">编辑资料</a></DropDownitem>
          <DropDownitem @click="logup">
            <a href="#" class="dropdown-item" >退出登录</a>
          </DropDownitem>
        </DropDown>
      </li>
      </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import DropDown from './DropDown.vue'
import DropDownitem from './DropdownItem.vue'
import { UserProps } from '../store'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'GlobalHeader',
  components: {
    DropDown,
    DropDownitem
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup () {
    const store = useStore()
    const router = useRouter()
    const logup = () => {
      localStorage.removeItem('token')
      store.state.user.isLogin = false
      router.push('/')
    }
    return {
      logup
    }
  }
})
</script>
