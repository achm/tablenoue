<template lang="pug">
section
  section.hero.is-fullheight
    .hero-head
      Navbar

    .hero-body
      .container.has-text-centered
        .button.is-primary.is-rounded.is-large(@click="doLogin") Login via Google
</template>

<script lang="ts">
import {
  Vue,
  Component
} from "nuxt-property-decorator"
import { namespace } from "vuex-class"
import Auth from "~/plugins/auth";
import Navbar from "~/components/Navbar.vue"
const auth = namespace("auth")

@Component({
  components: {
    Navbar
  }
})
export default class extends Vue {
  @auth.Action login
  @auth.Action setUser

  async mounted() {
    let user = await Auth()

    if (user) {
      this.setUser(user)
      user.getIdToken().then(idToken => {
        localStorage.setItem("AUTH_TOKEN", idToken)
        this['$router'].push('/')
      })
    }
  }

  doLogin () {
    this.login()
      .then(() => console.log("resolved"))
      .catch((err) => alert(err));
  }
}
</script>

<style scoped>
</style>
