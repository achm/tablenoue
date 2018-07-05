<template lang="pug">
section
  section.hero.is-primary.is-medium
    .hero-head
      Navbar

    .hero-body
      .container
        h1.title tablenoue
        h2.subtitle わいわい たのしもう ボードゲーム
        .button.is-info(@click="notify") Notify
        .tag {{ currentToken }}
</template>

<script lang="ts">
import {
  Vue,
  Component
} from "nuxt-property-decorator"
import axios from 'axios'
import firebase from "~/plugins/firebase"
import Navbar from "~/components/Navbar.vue"
import { setTimeout } from "timers";

@Component({
  components: {
    Navbar
  }
})
export default class extends Vue {
  currentToken: string | null = null;
  created() {
    if (!(<any>process).server) {
      const messaging = firebase.messaging()
      messaging.requestPermission()
        .then(() => {
          console.log('Have permission')
        })
      messaging.getToken()
        .then((currentToken) => {
          if (currentToken) {
            this.currentToken = currentToken;
          }
        }).catch((err) => {
          console.log('Error Occurred.')
        })
      messaging.onMessage((payload) => {
        console.log('Message received. ', payload);
        alert(payload.notification.body)
      });
    }
  }
  notify() {
    let argObj = { // 受信者のトークンIDと通知内容
      to: this.currentToken,
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
