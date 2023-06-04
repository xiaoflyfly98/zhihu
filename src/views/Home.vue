<template>
  <div class="home-page">
    <section class="py-5 text-center container">
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
    <button
      class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 d-block"
       @click="loadMorePage" v-if="!isLastPage"
    >
      加载更多
    </button>
    <h5 class="row py-lg-5 justify-content-center" v-if="isLastPage">已经到底了，没有其它数据了......</h5>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import ColumnList from '../components/ColumnList .vue'
import { GlobalDataProps } from '../store'
import { useStore } from 'vuex'
import { objToArry } from '../hepler'
import useLoadMore from '../hooks/useLoadMore'

export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const total = computed(() => { return store.state.columns.total })
    const currentPage = computed(() => { return store.state.columns.currentPage })
    onMounted(() => {
      store.dispatch('fetchColumns', { pageSize: 3, currentPage: 1 })
    })
    const list = computed(() => objToArry(store.state.columns.data))
    const { loadMorePage, isLastPage } = useLoadMore('fetchColumns', total, { pageSize: 3, currentPage: (currentPage.value ? currentPage.value + 1 : 2) })

    return {
      list,
      total,
      loadMorePage,
      isLastPage
    }
  }
})
</script>
