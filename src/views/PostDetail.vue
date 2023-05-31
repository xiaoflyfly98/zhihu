<template>
    <div v-if="currentPost" class="create-post-page">
    <Modal title="删除文章" :visvible="ModelIsVisible"
    @modal-on-close="ModelIsVisible = false"
    @modal-on-confirm="hideAndDelete"
    >
      <p>你要删除文章吗?</p>
    </Modal>
      <article class="w-75 mx-auto mb-5 pb-3">
        <img :src="currentPost.image.url" alt="" class="rounded-lg img-fluid my-4 img_fix">
        <h2  class="mb-4">{{currentPost.title}}</h2>
       <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
        <div class="col">
          <User-Profile :user="currentPost.author"></User-Profile>
        </div>
        <span  class="text-muted col text-right font-italic">{{currentPost.createdAt}}</span>
       </div>
      <div v-html="currentHtml"></div>
      <router-link type="button" class="btn btn-success"
      v-if="showEditArea"
      :to="{name: 'createpost' ,query:{id: currentPost.column}}"
      >
      编辑
      </router-link>
      <button v-if="showEditArea" type="button" class="btn btn-danger" @click.prevent="ModelIsVisible = true">删除</button>
      </article>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Markdownit from 'markdown-it'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { GlobalDataProps, PostProps } from '../store'
import Modal from '../components/Modal.vue'
import UserProfile from '../components/UserProfile.vue'
import createMessage from '../components/createMessage'
import router from '@/router'

export default defineComponent({
  name: 'PostDetail',
  components: {
    UserProfile,
    Modal
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const route = useRoute()
    const ModelIsVisible = ref(false)
    const md = new Markdownit()
    const currentId = route.params.id
    const currentCloumnId = store.state.nowCloumnId
    // 发送当前文章第几行
    store.commit('fetchNowPostId', currentId)
    store.dispatch('fetchPost', currentCloumnId)
    const currentPost = computed<PostProps>(() => store.getters.getCurrentPost(currentId))
    console.log(store.state.post)
    const currentHtml = computed(() => {
      if (currentPost.value && currentPost.value.content) {
        return md.render(currentPost.value.content)
      } else {
        return ''
      }
    })
    // 展示编辑区域
    const showEditArea = computed(() => {
      const { isLogin } = store.state.user
      if (currentPost.value && currentPost.value.author && isLogin) {
        return store.state.user.column === currentCloumnId
      } else {
        return false
      }
    })
    const hideAndDelete = () => {
      ModelIsVisible.value = false
      store.dispatch('deletePost', currentCloumnId)
      createMessage('删除成功，2秒返回相应的专栏', 'success', 2000)
      setTimeout(() => {
        router.push({ name: 'column', params: { id: currentCloumnId } })
      }, 2000)
    }
    return {
      currentPost,
      currentHtml,
      showEditArea,
      ModelIsVisible,
      hideAndDelete
    }
  }

})
</script>

<style>
.img_fix{
  height: 200px;
  width: 100%;
  object-fit: cover;
}
</style>
