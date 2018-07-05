import firebase from '~/plugins/firebase'
import { firestore } from 'firebase';
const db = firebase.firestore();

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
  async nuxtServerInit({ commit }, { app }) {
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
