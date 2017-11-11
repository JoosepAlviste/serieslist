import Vue from 'vue'
import SeasonsList from './series/create/SeasonsList.vue'

window.Events = new Vue();

const app = new Vue({
    el: '#app',
    components: { SeasonsList, },

    computed: {
        initialSeasons() {
            return window.series ? window.series.seasons : []
        },
    },
})
