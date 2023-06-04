<template>
  <div class="create-post-page">
    <h4>编辑文章</h4>
    <Upload  class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4"
      action="/upload"
      :uploaded="uploadedData"
      :beforeUpLoad="uploadCheck"
      @file-upload="handleFileUpload"
      >
      <template #default>
        <h4>点击上传头像图片</h4>
      </template>

      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
            <h4>正在上传...</h4>
        </div>
      </template>

      <template #upload="dataProps">
        <img :src="dataProps.uploadedData.url">
        <!-- <h4>{{dataProps.uploadedData.data}}</h4> -->
      </template>

    </Upload>
    <Validdata-Form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <Validate-Input
          :rules="titleRules" v-model="titleVal"
          placeholder="请输入文章标题"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
          <editor
          v-model="contenetVal"
          :options="editorOptions"
          @blur="checkEditor"
          ref="editorRef"
          :class="{'is-invalid': !ediotrStatus.isVaild}"
          ></editor>
          <span v-if="!ediotrStatus.isVaild" class="invalid-feedback mt-1" >{{ediotrStatus.message}}</span>
          <Validate-Input
          rows="10"
          tag="textarea"
          type="text"
          :rules="contenetRules"
          v-model="contenetVal"
          placeholder="请输入文章详情"
        />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">发表文章</button>
      </template>
    </Validdata-Form>
  </div>
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { GlobalDataProps, PostProps, imageProps, ResponseType, currentPostProps } from '../store'

import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValiddataForm from '../components/VaildataForm.vue'
import Upload from '../components/Upload.vue'
import createMessage from '../components/createMessage'
import editor from '../components/Editor.vue'
import easyMDE, { Options } from 'easyMDE'

interface EditoreInstance {
  clear: () => void,
  getMDEInstance: () => easyMDE | ''
}

export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValiddataForm,
    Upload,
    editor
  },
  setup () {
    const router = useRouter()
    const route = useRoute()
    const uploadedData = ref()
    const ediotrStatus = reactive({
      isVaild: true,
      message: ''
    })
    const textArea = ref<null | HTMLTextAreaElement>(null)
    const store = useStore<GlobalDataProps>()
    const titleVal = ref('')
    const contenetVal = ref('')
    const editorRef = ref<EditoreInstance>()
    const isEditMode = !!route.query.id
    let imageId = ''
    const editorOptions:Options = {
      spellChecker: false
    }
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contenetRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const checkEditor = () => {
      if (contenetVal.value.trim() === '') {
        ediotrStatus.isVaild = false
        ediotrStatus.message = '文章详情不能为空'
      } else {
        ediotrStatus.isVaild = true
        ediotrStatus.message = ''
      }
    }
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then(data => {
          const currentPostId = store.state.nowPostId
          const postInfo = data.AllList.list.find((post: currentPostProps) => post._id === currentPostId)
          if (postInfo.image.url) {
            uploadedData.value = { url: postInfo.image.url }
          }
          titleVal.value = postInfo.title
          contenetVal.value = postInfo.content || ''
        })
      }
    })

    const handleFileUpload = (rawData:ResponseType<imageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = (result:boolean) => {
      checkEditor()
      if (result && ediotrStatus.isVaild) {
        const { column, id } = store.state.user
        if (column) {
          const newPost:PostProps = {
            title: titleVal.value,
            content: contenetVal.value,
            column,
            author: id
          }
          if (imageId) {
            newPost.image = imageId
          }
          store.dispatch('createPost', newPost).then(() => {
            createMessage('添加文章成功,2秒后返回', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }
    // 上传组件检查
    const uploadCheck = (file:File) => {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        createMessage('不是jpeg格式的图片', 'error', 2000)
      }
      return isJPG
    }

    // 上传失败的解决
    // const onFileUpload = (rawData: ResponseType<imageProps>) => {
    //   createMessage(`${rawData.data}`, 'success', 2000)
    // }
    return {
      titleVal,
      titleRules,
      contenetVal,
      textArea,
      contenetRules,
      onFormSubmit,
      handleFileUpload,
      uploadedData,
      editorOptions,
      editorRef,
      ediotrStatus,
      checkEditor,
      uploadCheck
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container{
  height: 200px;
  cursor: pointer;
}

.create-post-page .file-upload-container img{
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
