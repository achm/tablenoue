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
            button.button.is-default.is-small(@click="unsubscribe" :class="{ 'is-loading': isLoadingSubscribe }")
              span.icon
                font-awesome-icon(icon="bell-slash")
              span Unsubscribe
          .level-item(v-else)
            button.button.is-link.is-small(@click="subscribe" :class="{ 'is-loading': isLoadingSubscribe }")
              span.icon
                font-awesome-icon(icon="bell")
              span Subscribe

  section.section
    .container
      div(v-if="isSubscribingCircle(currentCircle.id)")
        button.button.is-warning.is-large(@click="notify")
          span.icon
            font-awesome-icon(icon="exclamation-triangle")
          span KIUN now
      div(v-else)
        button.button.is-warning.is-large(disabled)
          span.icon
            font-awesome-icon(icon="exclamation-triangle")
          span KIUN now

  section.section
    .container
      div(v-if="isSubscribingCircle(currentCircle.id)")
        button.button.is-info.is-large(@click="notifyDate")
          span.icon
            font-awesome-icon(icon="exclamation-triangle")
          span KIUN at ...
        input.input.is-info.is-large(type="datetime-local" v-model="kiunDatetime")
      div(v-else)
        button.button.is-info.is-large(disabled)
          span.icon
            font-awesome-icon(icon="exclamation-triangle")
          span KIUN at ...

  section.section
    .container
      h2.title Kiuns
      div(v-if="currentCircle && currentCircle.kiuns")
        .box(v-for="kiun in currentCircle.kiuns")
          h4.title {{ kiun.datetime }}に{{ kiun.user.displayName }}さんが機運
          small.subtitle {{ kiun.createdAt }}
      div(v-else)
        | No Kiuns
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

function convertDateToIso(d){
  return d.getFullYear()+'-'
       + (("0"+(d.getMonth() + 1)).slice(-2))+'-'
       + ("0"+d.getDate()).slice(-2)+'T00:00:00'
}
@Component({
  components: {
    Navbar
  }
})
export default class extends Vue {
  @circles.State currentCircle
  @circles.Getter isSubscribingCircle
  @circles.Action subscribeCircle
  @circles.Action unsubscribeCircle
  @circles.Action notifyToCircle

  isLoadingSubscribe = true
  kiunDatetime = convertDateToIso(new Date())

  async fetch({ params, store, error }) {
    const exist = await store.dispatch("circles/existCircleId", params.id)
    if (exist) {
      store.dispatch("circles/fetchSubscribingCircles")
      return store.dispatch("circles/fetchCircle", params.id)
    } else {
      return error({ statusCode: 404, message: 'This page could not be found' })
    }
  }

  mounted() {
    this.isLoadingSubscribe = false
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

  notifyDate() {
    this.notifyToCircle({ circleId: this.currentCircle.id, datetime: this.kiunDatetime })
  }
}
</script>

<style scoped lang="scss">
</style>
