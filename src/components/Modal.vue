<template>
<teleport to="#Modal">
  <div class="modal d-block" tabindex="-1" v-if="visvible">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">{{title}}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"  @click.prevent="onClose"></button>
        </div>
        <div class="modal-body">
           <slot></slot>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click.prevent="onClose">取消</button>
            <button type="button" class="btn btn-primary" @click.prevent="onConFirm">确定</button>
        </div>
        </div>
    </div>
  </div>
</teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useDOMCreate from '../hooks/useDOMCreate'

export default defineComponent({
  name: 'Modal',
  props: {
    title: {
      type: String
    },
    visvible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['modal-on-confirm', 'modal-on-close'],
  setup (props, context) {
    useDOMCreate('Modal')
    const onClose = () => {
      context.emit('modal-on-close')
    }
    const onConFirm = () => {
      context.emit('modal-on-confirm')
    }
    return {
      onClose,
      onConFirm
    }
  }
})
</script>
