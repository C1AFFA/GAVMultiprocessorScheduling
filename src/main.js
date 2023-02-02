import { createApp } from 'vue'
import drag from "v-drag"
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(drag,{})
app.mount('#app')
