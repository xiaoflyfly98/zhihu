<template>
    <div class="signup-page mx-auto p-3 w-330">
      <Validdata-Form @form-submit="onFormSubmit">
        <h5 class="my-4 text-center">注册知乎账户</h5>
         <div class="mb-3">
          <label class="form-label">邮箱地址</label>
            <Validate-Input
             :rules="emailRules"
             v-model="formData.email"
             placeholder="请输入邮箱"
             type="text"
             >
            </Validate-Input>
         </div>

         <div class="mb-3">
          <label class="form-label">昵称</label>
            <Validate-Input
             :rules="nickNameRules"
             v-model="formData.nickName"
             placeholder="请输入昵称"
             type="text"
             >
            </Validate-Input>
         </div>

         <div class="mb-3">
          <label class="form-label">密码</label>
            <Validate-Input
             :rules="passWordRules"
             v-model="formData.password"
             placeholder="请输入密码"
             type="password"
             >
            </Validate-Input>
         </div>

         <div class="mb-3">
          <label class="form-label">重复密码</label>
            <Validate-Input
             :rules="repeatPasswordRules"
             v-model="formData.repeatPassword"
             placeholder="请再次输入密码"
             type="password"
             >
            </Validate-Input>
         </div>
          <template #submit>
            <button type="submit" class="btn btn-primary btn-block btn-large">注册</button>
          </template>
      </Validdata-Form>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import store from '../store'
import ValiddataForm from '../components/VaildataForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import createMessage from '../components/createMessage'

export default defineComponent({
  name: 'signup',
  components: {
    ValiddataForm,
    ValidateInput
  },
  setup () {
    const router = useRouter()
    const formData = reactive({
      email: '',
      nickName: '',
      password: '',
      repeatPassword: ''
    })
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]

    const nickNameRules: RulesProp = [
      { type: 'required', message: '昵称不能为空' }
    ]

    const passWordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]

    const repeatPasswordRules: RulesProp = [
      { type: 'required', message: '重复密码不能为空' },
      {
        type: 'custom',
        validator: () => {
          return formData.password === formData.repeatPassword
        },
        message: '密码不相同'
      }
    ]

    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payload = {
          email: formData.email,
          nickName: formData.nickName,
          password: formData.password
        }
        axios.post('https://www.fastmock.site/mock/0ce2c57ec419350aa7a5e9b6cf304984/api/register', payload).then((data) => {
          const msg = data.data.data
          store.commit('setLoading', true)
          createMessage(`${msg}，2秒返回登陆页面`, 'success', 2000)
          router.push('/login')
          setTimeout(() => {
            store.commit('setLoading', false)
          }, 500)
        }).catch((e) => {
          createMessage('注册失败', 'error', 2000)
        })
      }
    }

    return {
      formData,
      emailRules,
      nickNameRules,
      passWordRules,
      repeatPasswordRules,
      onFormSubmit
    }
  }
})
</script>

<style>
.w-330 {
  max-width: 330px;
}
</style>
