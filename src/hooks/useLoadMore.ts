import { useStore } from 'vuex'
import { ref, ComputedRef, computed } from 'vue'

interface LoadParam {
  currentPage: number
  pageSize: number
}

const useLoadMore = (actionName:string, total:ComputedRef<number>,
  params:LoadParam = { currentPage: 2, pageSize: 3 }) => {
  const store = useStore()
  const currentPage = ref(params.currentPage)
  const requestParams = computed(() => ({
    currentPage: currentPage.value,
    pageSize: params.pageSize
  }))
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams).then(() => {
      currentPage.value++
    })
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / params.pageSize) < currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore
