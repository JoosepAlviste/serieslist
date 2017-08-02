import Vue from 'vue'

require('./bootstrap')
import SeriesList from './components/list/SeriesList.vue'

const app = new Vue({
    el: '#app',
    components: { SeriesList },
})
