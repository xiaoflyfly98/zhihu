<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <h2>{{biggerCloumnLen}}</h2>
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50"/>
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <a href="#" class="btn btn-primary my-2">开始写文章</a>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import ColumnList from '../components/ColumnList .vue'
import { GlobalDataProps, imageProps, ResponseType } from '../store'
import { useStore } from 'vuex'
import createMessage from '../components/createMessage'
import { arrToObj, demo } from '../hepler'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    onMounted(() => {
      store.dispatch('fetchColumns')
    })
    const list = computed(() => store.state.columns)
    const biggerCloumnLen = computed(() => store.getters.biggerCloumnLen)
    const beforeUpLoad = (file:File) => {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        createMessage('不是图片类型文件', 'error', 2000)
      }
      return isJPG
    }
    const onFileUpload = (rawData: ResponseType<imageProps>) => {
      createMessage(`${rawData.data}`, 'success', 2000)
    }
    console.log(demo)
    return {
      list,
      biggerCloumnLen,
      beforeUpLoad,
      onFileUpload
    }
  }
})
</script>
