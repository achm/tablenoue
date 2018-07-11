<template lang="pug">
nav.navbar
  .container
    .navbar-brand
      nuxt-link.navbar-item(to="/") tablenoue
      a.navbar-burger(@click="toggleBurger" :class="{ 'is-active': isOpenBurger }")
        span
        span
        span
    .navbar-menu(:class="{ 'is-active': isOpenBurger }")
      .navbar-start
        nuxt-link.navbar-item(active-class="is-active" to="/games") Games
        nuxt-link.navbar-item(active-class="is-active" to="/circles") Circles
      .navbar-end
        .navbar-item
          .dropdown.is-right(v-if="isAuthenticated" :class="{ 'is-active': isOpen }")
            .dropdown-trigger(@click="toggleSettings")
              .navbar-item
                figure.image.is-16x16
                  img(:src="user.photoURL")
                div {{ user.displayName }}
            .dropdown-menu
              .dropdown-content
                a.dropdown-item(@click="doLogout") Logout
          nuxt-link.navbar-item(to="/login" v-else) Login
</template>

<script lang="ts">
import {
  Vue,
  Component
} from "nuxt-property-decorator"
import {
  Action,
  Getter,
  State,
  namespace
} from "vuex-class"
import Auth from "~/plugins/auth";
const auth = namespace("auth")

@Component
export default class extends Vue {
  @auth.Getter isAuthenticated
  @auth.State user
  @auth.Action("logout") actionLogout
  @auth.Action setUser

  isOpen = false;
  isOpenBurger = false;

  doLogout() {
    this.actionLogout()
      .catch((err) => alert(err));
  }

  toggleSettings() {
    this.isOpen = !this.isOpen;
  }

  toggleBurger() {
    this.isOpenBurger = !this.isOpenBurger;
  }
}
</script>

<style scoped lang="scss">
.dropdown-trigger {
  cursor: pointer;
}
.image {
  margin-right: 5px;
  img {
    border-radius: 50%;
  }
}
</style>
