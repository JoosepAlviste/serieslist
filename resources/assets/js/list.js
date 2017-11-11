import Vue from 'vue'

require('./bootstrap')
import SeriesList from './list/SeriesList.vue'

const app = new Vue({
    el: '#app',
    components: { SeriesList },
})
