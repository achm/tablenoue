<template lang="pug">
section
  section.hero.is-primary.is-medium
    .hero-head
      nav.navbar
        .container
          .navbar-brand
            a.navbar-item(href="/") tablenoue
          .navbar-menu
            .navbar-end
              a.navbar-item.is-active Home
              a.navbar-item Games
              a.navbar-item Plays

    .hero-body
      .container.has-text-centered
        h1.title tablenoue
        h2.subtitle わいわい たのしもう ボードゲーム
</template>

<script lang="ts">
import {
  Component,
  Vue
} from "nuxt-property-decorator"
import { State } from "vuex-class"
import Card from "~/components/Card.vue"

@Component({
  components: {
    Card
  }
})
export default class extends Vue {
  @State people
}
</script>

<style scoped>
</style>
