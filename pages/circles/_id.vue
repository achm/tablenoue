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
          .level-item(v-if="isSubscribingCircle(currentCircle.id)")
            button.button.is-default.is-small(@click="unsubscribe" :click="{ 'is-loading': isLoadingSubscribe }")
              span.icon
                font-awesome-icon(icon="bell")
              span Unsubscribe
          .level-item(v-else)
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
import auth from "~/plugins/auth"
import Navbar from "~/components/Navbar.vue"
const circles = namespace("circles")

@Component({
  components: {
    Navbar
  }
})
export default class extends Vue {
  @circles.State currentCircle
  @circles.Getter isSubscribingCircle
  @circles.Action fetchSubscribingCircles
  @circles.Action subscribeCircle
  @circles.Action unsubscribeCircle
  @circles.Action notifyToCircle

  isLoadingSubscribe = true

  async fetch({ params, store, error }) {
    const exist = await store.dispatch("circles/existCircleId", params.id)
    if (exist) {
      return store.dispatch("circles/fetchCircle", params.id)
    } else {
      return error({ statusCode: 404, message: 'This page could not be found' })
    }
  }

  mounted() {
    auth().then(user => {
      console.log(user)
      this.fetchSubscribingCircles()
      this.isLoadingSubscribe = false;
    })
  }

  subscribe() {
    this.isLoadingSubscribe = true
    const messaging = firebase.messaging()
    messaging.requestPermission()
    messaging.getToken()
      .then((currentToken) => {
        if (currentToken) {
          this.subscribeCircle({ circleId: this.currentCircle.id, token: currentToken })
            .then(() => { this.isLoadingSubscribe = false })
        }
      })
  }

  unsubscribe() {
    this.isLoadingSubscribe = true
    const messaging = firebase.messaging()
    messaging.getToken()
      .then((currentToken) => {
        if (currentToken) {
          this.unsubscribeCircle({ circleId: this.currentCircle.id, token: currentToken })
            .then(() => { this.isLoadingSubscribe = false })
        }
      })
  }

  notify() {
    this.notifyToCircle({ circleId: this.currentCircle.id })
  }
}
</script>

<style scoped lang="scss">
</style>
