import db from '~/plugins/firestore'
import functions from '~/plugins/functions'

export const strict = false;

interface Circle {
  id: string,
  name: string,
  subscribersCount?: number,
}

interface state {
  circles: Circle[],
  currentCircle: Circle | null,
  subscribingCircleIds: string[],
}

export const state = (): state => ({
  circles: [],
  currentCircle: null,
  subscribingCircleIds: [],
})

export const getters = {
  isSubscribingCircle: (state: state) => (circleId: string): boolean => {
    return state.subscribingCircleIds.indexOf(circleId) >= 0
  },
}

export const mutations = {
  addCircles(state: state, circles: Circle) {
    state.circles = state.circles.concat(circles)
  },
  setCircle(state: state, circle: Circle) {
    state.currentCircle = circle
  },
  setSubscribingCircleIds(state: state, circleIds: string[]) {
    state.subscribingCircleIds = circleIds
  },
  subscribeCircle(state: state, circleId: string) {
    if (state.subscribingCircleIds.indexOf(circleId) == -1) {
      state.subscribingCircleIds.push(circleId)
    }
  },
  unsubscribeCircle(state: state, circleId: string) {
    if (state.subscribingCircleIds.indexOf(circleId) > -1) {
      state.subscribingCircleIds.splice(state.subscribingCircleIds.indexOf(circleId), 1)
    }
  }
}

export const actions = {
  async fetchCircles({ commit, state }) {
    const lastCircle = state.circles[state.circles.length - 1]
    const lastCircleName = lastCircle && lastCircle.name

    return db.collection("circles").orderBy("name").startAfter(lastCircleName || "").limit(50).get()
      .then((snapshot) => {
        const circles: firebase.firestore.DocumentData[] = []
        snapshot.forEach(async (circle) => {
          circles.push({
            id: circle.id,
            ...circle.data(),
          });
        })
        commit("addCircles", circles)
      })
  },
  fetchSubscribingCircles({ commit, rootState }) {
    if (!rootState.auth.user) { return }
    db.collection('circleSubscribers').where('userId', '==', rootState.auth.user.uid).get()
      .then(snapshot => {
        const ids = snapshot.docs.map(doc => doc.data().circleId)
        commit('setSubscribingCircleIds', ids)
      })
  },
  fetchCircle({ commit }, circleId: string) {
    return db.collection("circles").doc(circleId).get()
      .then(async (snapshot) => {
        const kiuns = await snapshot.ref.collection("kiuns").orderBy("createdAt", "desc").get()
        commit("setCircle", {
          id: snapshot.id,
          ...snapshot.data(),
          kiuns: kiuns.docs.map(doc => { 
            const kiun = doc.data()
            return { user: kiun.user, datetime: kiun.datetime.toDate(), createdAt: kiun.createdAt.toDate() }
          })
        })
      })
  },
  existCircleId({}, circleId: string) {
    return db.collection("circles").doc(circleId).get()
      .then(snapshot => snapshot.exists)
  },
  subscribeCircle({ commit }, { circleId, token }: { circleId: string, token: string }) {
    return functions.httpsCallable('subscribeCircle')({ circleId: circleId, token: token })
      .then(() => {
        commit('subscribeCircle', circleId)
      })
  },
  unsubscribeCircle({ commit }, { circleId, token }: { circleId: string, token: string }) {
    return functions.httpsCallable('unsubscribeCircle')({ circleId: circleId, token: token })
      .then(() => {
        commit('unsubscribeCircle', circleId)
      })
  },
  notifyToCircle({}, { circleId, datetime }: { circleId: string, datetime: string }) {
    const kiunDatetime = datetime ? datetime : new Date().toISOString()
    return functions.httpsCallable('notifyToCircle')({ circleId, datetime: kiunDatetime })
  },
}
