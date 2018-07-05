export default function ({ store, route, redirect }) {
  if (!store.getters["auth/isAuthenticated"] && route.name && route.name.indexOf("auth") > 0) {
    redirect('/login')
  }
  if (store.getters["auth/isAuthenticated"] && route.name === 'login') {
    redirect('/')
  }
}
