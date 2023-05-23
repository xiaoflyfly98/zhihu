<template>
<teleport to="#back">
    <div class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
    :style="{backgroundColor: background || '' }"
    >
    <div class="loading-content">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden" >{{text || 'loading'}}</span>
        </div>
        <p v-if="text" class="text-primary small">{{text}}</p>
    </div>
    </div>
</teleport>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup () {
    const node = document.createElement('div')
    node.id = 'back'
    document.body.appendChild(node)
    onMounted(() => {
      setTimeout(() => {
        document.body.removeChild(node)
      }, 500)
    })
  }
})
</script>

<style>
.loading-container{
    background: rgba(255, 255, 255, .5);
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 100;
    display: flex;
    text-align: center;
}
</style>
