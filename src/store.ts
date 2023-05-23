import { createStore, Commit } from 'vuex'
import { instance } from './request'

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
  title: string
  excerpt?:string
  content?: string
  image?: imageProps | string
  createdAt?: string
  column: string
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
  id: string
  title: string
  avatar?: imageProps
  description: string
}

export interface GlobalErrorProps {
  status:boolean
  message?:string
}

export interface GlobalDataProps {
    error:GlobalErrorProps
    token:string
    loading: boolean
    columns: ColumnProps[]
    posts: PostProps[]
    post: currentPostProps[]
    user: UserProps
    nowCloumnId: string
    nowPostId: string
  }
const getandCommit = async (url:string, mutationName:string, commit:Commit) => {
  const { data } = await instance.get(url)
  commit(mutationName, data)
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
    columns: [],
    nowCloumnId: '', // 判断当前的专栏号
    nowPostId: '', // 判断当前专栏的第几个文章
    posts: [],
    post: [],
    user: { isLogin: false }
  },
  mutations: {
    // login (state) {
    //   state.user = { ...state.user, isLogin: true, name: 'feifei' }
    // },
    login (state, rawData) {
      state.token = rawData.data.token
      const token = state.token
      localStorage.setItem('token', token)
      instance.defaults.headers.common.Authorization = `name ${token}`
    },
    setErrorData (state, errorData:GlobalErrorProps) {
      state.error = errorData
    },
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData.data.list]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData.data.list
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
      state.posts = state.posts.filter(post => post.id !== state.nowPostId)
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
    fetchColumns ({ commit }) {
      return getandCommit('/columns', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      return getandCommit(`/column/${cid}`, 'fetchColumn', commit)
    },
    fetchPosts ({ commit }, cid) {
      return getandCommit(`/column/${cid}/post`, 'fetchPosts', commit)
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
      return state.columns.find(c => c.id === id)
    },
    getPostsById: (state) => (cid:string) => {
      return state.posts.filter(post => post.column === cid)
    },
    getCurrentPost: (state) => (cid:string) => {
      return state.post.find(post => post._id === cid)
    }
  }
})
export default store
