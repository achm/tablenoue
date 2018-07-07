import axios from 'axios'
import db from '~/plugins/firestore'

export const strict = false;

export const state = () => ({
  circles: [],
  currentCircle: null,
})

export const getters = {
}

export const mutations = {
  addCircles(state, circles) {
    state.circles = state.circles.concat(circles)
  },
  setCircle(state, circle) {
    state.currentCircle = circle
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { app }) {
  },
  async fetchCircles({ commit, state }) {
    const lastCircle = state.circles[state.circles.length - 1]
    const lastCircleName = lastCircle && lastCircle.name

    return db.collection("circles").orderBy("name").startAfter(lastCircleName || "").limit(50).get()
      .then((snapshot) => {
        const circles: firebase.firestore.DocumentData[] = []
        snapshot.forEach((circle) => {
          circles.push({
            id: circle.id,
            ...circle.data(),
          });
        })
        commit("addCircles", circles)
      })
  },
  fetchCircle({ commit }, circleId) {
    return db.collection("circles").doc(circleId).get()
      .then((snapshot) => {
        commit("setCircle", {
          id: snapshot.id,
          ...snapshot.data(),
        })
      })
  },
  existCircleId({}, circleId) {
    return db.collection("circles").doc(circleId).get()
      .then(snapshot => snapshot.exists)
  },
  subscribeCircle({}, { circleId, token }) {
    const option = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAAaD42Hik:APA91bG8wCgDl08aurAovU3EI0lORMVYVP7_kg1JD5YWM3SV0_c3bt7K_BlNRz_7L1LovIuExyqZn_wYUiTvwGh-mPytVpktiE2X6ZxFJUiVSgbcNlH0q0X2JE3RiWNUwdEMxsJtXfPwpqnmJvM0OVMFMqT-KAw3Zw'
      }
    }
    return axios.post(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/circles-${circleId}`, {}, option)
  }
}
