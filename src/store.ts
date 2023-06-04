import { createStore, Commit } from 'vuex'
import { instance } from './request'
import { arrToObj, objToArry } from './hepler'

export interface ResponseType<P = object> {
  code: number;
  msg: string;
  data: P;
}

export interface UserProps {
    isLogin: boolean
    nickName?: string
    id?: string
    column?: string
    author?:string
    description?:string
    avatar?:string
  }

export interface imageProps {
  _id?: string
  url?: string
  createdAt?: string
  fitUrl?: string;
}

export interface PostProps {
  id?: string
  title?: string
  excerpt?:string
  content?: string
  image?: imageProps | string
  createdAt?: string
  column?: string
  author?:string
}

export interface currentPostProps {
  _id?: string
  title: string
  excerpt?:string
  content?: string
  image?: imageProps
  createdAt?: string
  column: string
  author?:string
}

export interface ColumnProps {
  id?: string
  title?: string
  avatar?: imageProps
  description?: string
}

interface ListProps<p>{
  [id: string]: p;
}

export interface GlobalErrorProps {
  status:boolean
  message?:string
}

export interface GlobalDataProps {
    error:GlobalErrorProps
    token:string
    loading: boolean
    columns: { data: ListProps<ColumnProps>; isLoaded:boolean; total:number }
    posts: { data: ListProps<PostProps>; loadedColumns: string[] }
    post: currentPostProps[]
    user: UserProps
    nowCloumnId: string
    nowPostId: string
  }
const getandCommit = async (url:string, mutationName:string, commit:Commit, extraData?:any) => {
  const { data } = await instance.get(url)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const postandCommit = async (url:string, mutationName:string, commit:Commit, payLoad:any) => {
  const { data } = await instance.post(url, payLoad)
  return commit(mutationName, data)
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: { data: {}, isLoaded: false, total: 0 },
    nowCloumnId: '', // 判断当前的专栏号
    nowPostId: '', // 判断当前专栏的第几个文章
    posts: { data: {}, loadedColumns: [] },
    post: [],
    user: { isLogin: false }
  },
  mutations: {
    // login (state) {
    //   state.user = { ...state.user, isLogin: true, name: 'feifei' }
    // },
    login (state, rawData) {
      const { token } = rawData.data
      localStorage.setItem('token', token)
      instance.defaults.headers.common.Authorization = `name ${token}`
    },
    setErrorData (state, errorData:GlobalErrorProps) {
      state.error = errorData
    },
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
      // state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count } = rawData.page
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        isLoaded: true,
        total: count
      }
      console.log(state.columns)
      // state.columns.data = arrToObj(rawData.data.list)
      // state.columns.isLoaded = true
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data.list.id] = rawData.data.list
    },
    fetchPosts (state, { data: rawData, extraData: cloumnId }) {
      state.posts.data = arrToObj(rawData.data.list)
      state.posts.loadedColumns.push(cloumnId)
      // state.posts = rawData.data.list
    },
    fetchPost (state, rawData) {
      state.post = rawData.AllList.list
    },
    setLoading (state, status) {
      state.loading = status
    },
    fetchCurrent (state, loginData) {
      state.user = { isLogin: true, ...loginData.data }
    },
    // 赋予当前专栏ID
    fetchNowCloumnId (state, nowCloumnId) {
      state.nowCloumnId = nowCloumnId
    },
    // 判断当前专栏第几行文章
    fetchNowPostId (state, nowPostId) {
      state.nowPostId = nowPostId
    },
    deletePost (state) {
      console.log('删除文章成功', state.posts)
    },
    loginout (state) {
      state.token = ''
      localStorage.removeItem('token')
      delete instance.defaults.headers.common.Authorization
    }
  },
  actions: {
    login ({ commit }, payLoad) {
      return postandCommit('/user/login', 'login', commit, payLoad)
    },
    fetchColumns ({ state, commit }, params) {
      const { currentPage = 1, pageSize = 3 } = params
      const postAxios = async () => {
        const respData = await instance.post(`/api/currentPage=${currentPage}&pageSize=${pageSize}`, params)
        const data = respData.data
        commit('fetchColumns', data)
        return data
      }
      return postAxios()
      // return postandCommit(`/api/currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit, params)
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return getandCommit(`/column/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts ({ state, commit }, cid) {
      // if (!state.posts.loadedColumns.includes(cid)) {
      return getandCommit(`/column/${cid}/post`, 'fetchPosts', commit, cid)
    },
    fetchPost ({ commit }, cid) {
      const postAxios = async () => {
        const respData = await instance.post(`/post/:${cid}`, { cloumnId: cid })
        const data = respData.data
        commit('fetchPost', data)
        return data
      }
      return postAxios()
    },
    deletePost ({ commit }, cid) {
      const deletePostAxios = async () => {
        const respData = await instance.post(`/post/:${cid}`, { cloumnId: cid })
        const data = respData.data
        commit('deletePost', data)
        return data
      }
      return deletePostAxios()
    },
    fetchCurrent ({ commit }) {
      return getandCommit('/user/current', 'fetchCurrent', commit)
    },
    createPost ({ commit }, payload) {
      return postandCommit('/post', 'createPost', commit, payload)
    },
    LoginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrent')
      })
    }
  },
  getters: {
    getCloumnById: (state) => (id:string) => {
      return state.columns.data[id]
      // return state.columns.find(c => c.id === id)
    },
    getPostsById: (state) => (cid:string) => {
      return objToArry(state.posts.data).filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (cid:string) => {
      return state.post.find(post => post._id === cid)
    }
  }
})
export default store
