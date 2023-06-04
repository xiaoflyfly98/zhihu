<template>
<div class="container">
  <GlobalHeader :user='currentUser' ></GlobalHeader>
  <Loader  text="正在加载中......." v-if="isLoading"></Loader>
  <router-view></router-view>
   <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2023 知乎专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
</div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './components/Loader.vue'
import { GlobalDataProps } from './store'
import createMessage from './components/createMessage'

import { useStore } from 'vuex'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })
    // const currentUser:useProps = {
    //   isLogin: true,
    //   name: 'feifei'
    // }
    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style>

</style>
