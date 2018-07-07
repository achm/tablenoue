<template lang="pug">
section
  section.hero.is-primary.is-medium
    Navbar

  section.section
    .container
      h1.title Circles

      .box(v-for="circle in circles")
        nuxt-link(:to="{ name: 'circles-id', params: { id: circle.id } }") {{ circle.name }}
      
</template>

<script lang="ts">
import {
  Vue,
  Component
} from "nuxt-property-decorator"
import {
  namespace
} from "vuex-class"
import firebase from "~/plugins/firebase"
import Navbar from "~/components/Navbar.vue"
const circles = namespace("circles")

@Component({
  components: {
    Navbar
  }
})
export default class extends Vue {
  @circles.State circles

  fetch({ store }) {
    return store.dispatch('circles/fetchCircles')
  }
}
</script>

<style scoped lang="scss">
</style>
