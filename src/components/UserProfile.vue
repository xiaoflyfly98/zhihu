<template>
    <div class="user-profile-component">
      <div class="d-flex align-items-center">
      <img :src="getHeadimg"  class="rounded-circle img-thumbnail">
      <div class="detail ml-2">
        <h6 class="d-block mb-0">{{user.nickName}}</h6>
          <span class="text-truncate text-muted d-block">{{user.description}}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { UserProps } from '../store'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup (props) {
    const getHeadimg = computed(() => {
      const img = props.user.avatar
      if (img) {
        return img
      } else {
        return require('@/assets/avatar.jpg')
      }
    })
    return {
      getHeadimg
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
