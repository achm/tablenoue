import firebase from '@/plugins/firebase'

const googleProvider = new firebase.auth.GoogleAuthProvider()

export const strict = false;

export const state = () => ({
  people: [],
  user: null,
  userName: "aaa",
})

export const getters = {
  isAuthenticated(state) {
    return !!state.user
  }
}

export const mutations = {
  setPeople(state, people) {
    state.people = people
  },
  setUser(state, payload) {
    state.user = payload
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { app }) {
    const people = await app.$axios.$get(
      "./random-data.json"
    )
    commit("setPeople", people.slice(0, 10))
  },
  login() {
    return new Promise((resolve, reject) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          firebase.auth().signInWithRedirect(googleProvider)
            .then(() => resolve())
            .catch((err) => reject(err))
        })
        .catch((err) => reject(err))
    })
  },
  logout() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut()
        .then(() => resolve())
        .catch((err) => reject(err))
    })
  },
  setUser({ commit }, payload) {
    commit("setUser", payload)
  }
}
