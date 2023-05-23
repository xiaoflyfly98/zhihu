<template>
    <div class="file-upload">
      <div class="file-upload-container" @click="triggerUpload" v-bind="$attrs">
        <slot v-if="fileStatus == 'loading'" name="loading">
          <button class="btn btn-primary" >正在上传...</button>
        </slot>

        <slot v-else-if="fileStatus == 'success'"  name="upload" :uploadedData="uploadedData">
          <button class="btn btn-primary" >上传成功</button>
        </slot>

        <slot v-else name="default">
          <button class="btn btn-primary" >点击上传</button>
        </slot>

        <input class="file-input d-none"
          type="file"
          ref="fileInput"
          @change="handlefilechange"
        >
      </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'
import { instance } from '../request'
type uploadStatus = 'ready' | 'loading' | 'success' | 'error'
type checkFunction = (file:File) => boolean

export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpLoad: {
      type: [Function] as PropType<checkFunction>
    },
    uploaded: {
      type: Object
    }
  },
  emits: ['file-upload', 'file-upload-error'],
  inheritAttrs: false,
  setup (props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<uploadStatus>(props.uploaded ? 'success' : 'ready')
    const uploadedData = ref(props.uploaded)
    watch(() => props.uploaded, (newValue) => {
      if (newValue) {
        fileStatus.value = 'success'
        uploadedData.value = newValue
      }
    })
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }

    const handlefilechange = (e:Event) => {
      const currenttarget = e.target as HTMLInputElement
      if (currenttarget.files) {
        const files = Array.from(currenttarget.files)
        if (props.beforeUpLoad) {
          const result = props.beforeUpLoad(files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formdata = new FormData()
        formdata.append('file', files[0])
        instance.post(props.action, formdata, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(resp => {
          fileStatus.value = 'success'
          context.emit('file-upload', resp.data)
          uploadedData.value = resp.data
        }).catch(error => {
          fileStatus.value = 'error'
          context.emit('file-upload-error', { error })
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
      }
    }
    return {
      fileInput,
      fileStatus,
      uploadedData,
      triggerUpload,
      handlefilechange
    }
  }
})
</script>
