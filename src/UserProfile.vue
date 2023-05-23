<template>
    <div class="user-profile-component">
      <div class="d-flex align-items-center">
      <img :src="userAvatar" :alt="11" class="rounded-circle img-thumbnail">
      <div class="detail ml-2">
        <h6 class="d-block mb-0">{{user.nickName}}</h6>
          <span class="text-truncate text-muted d-block">{{user.description}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup () {
    const store = useStore()
    const user = computed(() => store.state.user)
    const userAvatar = computed(() => {
      if (user.value.avatar) {
        return user.value.avatar
      } else {
        return require('../assets/avatar.jpg')
      }
    })
    return {
      user,
      userAvatar
    }
  }
})
</script>

<style>
.user-profile-component img {
  width: 50px;
  height: 50px;
}

</style>
