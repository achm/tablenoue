<template lang="pug">
section
  section.hero.is-primary.is-medium
    .hero-head
      Navbar

    .hero-body
      .container.has-text-centered
        h1.title tablenoue
        h2.subtitle わいわい たのしもう ボードゲーム
</template>

<script lang="ts">
import {
  Vue,
  Component
} from "nuxt-property-decorator"
import Navbar from "~/components/Navbar.vue"

@Component({
  components: {
    Navbar
  }
})
export default class extends Vue {
}
</script>

<style scoped lang="scss">
</style>
