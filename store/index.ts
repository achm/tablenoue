import db from '~/plugins/firestore'
import firebase from '~/plugins/firebase'

export const strict = false;

export const state = () => ({
  games: [],
})

export const getters = {
}

export const mutations = {
  addGames(state, games) {
    state.games = state.games.concat(games)
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    if (req.user) {
      commit('auth/setUser', req.user)
    }
  },
  async nuxtClientInit({ dispatch, state }) {
    if (!(<any>process).server && navigator.serviceWorker) {
      firebase.messaging().onMessage((payload) => {
        if (state.auth.user && state.auth.user.uid != payload.data.userId) {
          switch (payload.data.type) {
            case "KIUN_TO_CIRCLE":
              alert(payload.notification.body)
              break;
            default:
              alert(payload.notification.body)
              break;
          }
        }
      });
    }
    dispatch('auth/nuxtClientInit')
  },
  async fetchGames() {
    const lastGame = this.state.games[this.state.games.length - 1]
    const lastGameName = lastGame && lastGame.name && lastGame.name.default

    db.collection("games").orderBy("name.default").startAfter(lastGameName || "").limit(50).get()
    .then((snapshot) => {
      const games: firebase.firestore.DocumentData[] = []
      snapshot.forEach((game) => {
        games.push(game.data());
      })
      this.commit("addGames", games)
    })
  }
}
