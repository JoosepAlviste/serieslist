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

const posterInput = document.getElementById('poster')
posterInput.onchange = function () {
    if (posterInput.files.length > 0) {
        document.getElementById('poster-file-name').innerHTML = posterInput.files[ 0 ].name
    }
}
