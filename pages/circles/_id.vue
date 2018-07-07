<template lang="pug">
section
  section.hero.is-primary.is-medium
    Navbar

  section.section
    .container
      .level
        .level-left
          .level-item
            h1.title {{ currentCircle.name }}
          .level-item
            button.button.is-link.is-small(@click="subscribe")
              span.icon
                font-awesome-icon(icon="bell")
              span Subscribe
          .level-item
            button.button.is-warning.is-small(@click="notify")
              span.icon
                font-awesome-icon(icon="bell")
              span Notify
</template>

<script lang="ts">
import {
  Vue,
  Component
} from "nuxt-property-decorator"
import {
  namespace
} from "vuex-class"
import axios from 'axios'
import firebase from "~/plugins/firebase"
import Navbar from "~/components/Navbar.vue"
import { setTimeout } from "timers";
const circles = namespace("circles")

@Component({
  components: {
    Navbar
  }
})
export default class extends Vue {
  @circles.State currentCircle
  @circles.Action subscribeCircle

  async fetch({ params, store, error }) {
    const exist = await store.dispatch("circles/existCircleId", params.id)
    if (exist) {
      return store.dispatch("circles/fetchCircle", params.id)
    } else {
      return error({ statusCode: 404, message: 'This page could not be found' })
    }
  }

  mounted() {
  }

  subscribe() {
    const messaging = firebase.messaging()
    messaging.requestPermission()
    messaging.getToken()
      .then((currentToken) => {
        if (currentToken) {
          this.subscribeCircle({ circleId: this.currentCircle.id, token: currentToken })
        }
      }).catch((err) => {
        alert(err)
      })
  }

  notify() {
    let argObj = { // 受信者のトークンIDと通知内容
      to: `/topics/circles-${this.currentCircle.id}`,
      notification: {
        title: 'tablenoue',
        body: 'メッセージ内容',
        click_action: 'https://www.tablenoue.app/circles',
      }
    }
    let optionObj = { //送信者のサーバーキー
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAAaD42Hik:APA91bG8wCgDl08aurAovU3EI0lORMVYVP7_kg1JD5YWM3SV0_c3bt7K_BlNRz_7L1LovIuExyqZn_wYUiTvwGh-mPytVpktiE2X6ZxFJUiVSgbcNlH0q0X2JE3RiWNUwdEMxsJtXfPwpqnmJvM0OVMFMqT-KAw3Zw'
      }
    }
    setTimeout(() => {
      axios.post('https://fcm.googleapis.com/fcm/send', argObj, optionObj)
    }, 5000)
  }
}
</script>

<style scoped lang="scss">
</style>
