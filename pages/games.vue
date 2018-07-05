<template lang="pug">
section
  section.hero.is-primary.is-medium
    Navbar

  section.section
    .container
      h1.title Games
      .box(v-for="game in games")
        .media
          .media-left
            figure.image.is-64x64
              img(src="https://bulma.io/images/placeholders/128x128.png")
          .media-content
            .content
              .level
                .level-left
                  .level-item
                    strong {{ game.name.ja || game.name.default }}
                  .tags.level-item
                    .tag.is-primary(v-for="(_, tagName) in game.tags") {{ tagName }}
            .level.is-mobile
              .level-left
                .level-item.has-text-info.has-text-weight-bold
                  font-awesome-icon(icon="users" fixed-width)
                  | {{ game.minPlayers }} ~ {{ game.maxPlayers }}人
                .level-item.has-text-warning.has-text-weight-bold
                  font-awesome-icon(icon="clock" fixed-width)
                  | {{ game.playingTime }}min.
</template>

<script lang="ts">
import {
  Component,
  Vue
} from "nuxt-property-decorator"
import {
  Action,
  State
} from "vuex-class"
import Navbar from "~/components/Navbar.vue"

@Component({
  components: {
    Navbar
  }
})
export default class extends Vue {
  @State games
  @Action fetchGames
  created() {
    this.fetchGames();
  }
  mounted() {
    console.log("aaaaaa")
  }
}
</script>

<style scoped>
</style>
