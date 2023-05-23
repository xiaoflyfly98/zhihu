import Message from '../components/Message.vue'
import { h, render } from 'vue'
export type MessageType = 'success' | 'error' | 'default'

const createMessage = (message:string, type:MessageType, timeout?:number) => {
  const messageVnode = h(Message, {
    message,
    type
  })
  const mountNode = document.createElement('div')
  document.body.appendChild(mountNode)
  render(messageVnode, mountNode)
  const desstory = () => {
    render(null, mountNode)
    document.body.removeChild(mountNode)
  }
  if (timeout) {
    setTimeout(() => {
      desstory()
    }, timeout)
  }
  return {
    desstory
  }
}
export default createMessage
