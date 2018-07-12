import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBell,
  faBellSlash,
  faClock,
  faExclamationTriangle,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faBell,
  faBellSlash,
  faClock,
  faExclamationTriangle,
  faUsers,
)

Vue.component('font-awesome-icon', FontAwesomeIcon)