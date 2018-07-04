<template lang="pug">
section
  section.is-primary.is-medium
    Navbar

    .container.has-text-centered
      h1.title tablenoue
      h2.subtitle わいわい たのしもう ボードゲーム
</template>

<script lang="ts">
import {
  Component,
  Vue
} from "nuxt-property-decorator"
import Navbar from "~/components/Navbar.vue"

@Component({
  components: {
    Navbar
  }
})
export default class extends Vue {
  mounted() {
    console.log("aaaaaa")
  }
}
</script>

<style scoped>
</style>
