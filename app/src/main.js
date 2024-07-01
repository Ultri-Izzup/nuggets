/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */
import messages from "@intlify/unplugin-vue-i18n/messages";

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: 'en',
  fallbackLocale: 'en',
  messages: messages
})

const app = createApp(App)

app.use(i18n)

registerPlugins(app)

app.mount('#app')
