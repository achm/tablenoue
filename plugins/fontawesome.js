import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faClock,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faClock, faUsers)

Vue.component('font-awesome-icon', FontAwesomeIcon)