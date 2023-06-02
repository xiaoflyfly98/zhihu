import { useStore } from 'vuex'
import { ref, ComputedRef, computed } from 'vue'

interface LoadParam {
  currentPage: number
  pageSize: number
}

const useLoadMore = (actionName:string, total:ComputedRef<number>,
  Params:LoadParam = { currentPage: 2, pageSize: 5 }) => {
  const store = useStore()
  const currentPage = ref(Params.currentPage)
  const requestParams = {
    currentPage: currentPage.value,
    pageSize: Params.pageSize
  }
  const loadMorePage = () => {
    store.dispatch(actionName, requestParams).then(() => {
      currentPage.value++
    })
  }
  const isLastPage = computed(() => {
    return Math.ceil(total.value / Params.pageSize) === currentPage.value
  })
  return {
    loadMorePage,
    isLastPage,
    currentPage
  }
}

export default useLoadMore
