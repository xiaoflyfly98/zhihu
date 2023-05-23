<template>
<div class="container">
  <Validdata-Form @form-submit="onFormSubmit">
    <div class="mb-3">
      <label class="form-label">邮箱地址</label>
      <Validate-Input
      :rules="emailRules"
      v-model="emailVal"
      placeholder="请输入邮箱"
      ref="inputRef"
      >
      </Validate-Input>
   </div>
   <div class="mb-3">
      <label class="form-label">密码</label>
      <Validate-Input
      :rules="passWordRules"
      v-model="passwordlVal"
      placeholder="请输入密码"/>
   </div>
   <template #submit>
      <span class="btn btn-danger">submit</span>
   </template>
  </Validdata-Form>
</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ColumnProps } from '../store'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import { useRouter } from 'vue-router'
import ValiddataForm from '../components/VaildataForm.vue'
import createMessage from '../components/createMessage'

const testData: ColumnProps[] = []
export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValiddataForm
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const emailVal = ref()
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const passwordlVal = ref()
    const passWordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const emailRef = reactive({
      val: '',
      error: false,
      message: ''
    })

    const onFormSubmit = (result:boolean) => {
      if (result) {
        const payload = {
          email: emailVal.value,
          password: passwordlVal.value
        }
        store.dispatch('LoginAndFetch', payload).then(() => {
          createMessage('登录成功,2秒返回主页面', 'success', 2000)
          setTimeout(() => {
            router.push('/')
          }, 2000)
        })
      }
    }
    return {
      emailRef,
      list: testData,
      emailRules,
      passWordRules,
      passwordlVal,
      emailVal,
      onFormSubmit
    }
  }
})
</script>

<style>

</style>
