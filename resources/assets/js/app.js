import Vue from 'vue'

import './bootstrap'
import EpisodeSeenTag from './components/EpisodeSeenTag.vue'
import SeriesList from './list/SeriesList.vue'
import SeasonsList from './series/create/SeasonsList.vue'
import AppNotifications from './components/AppNotifications'

window.Events = new Vue();

const app = new Vue({
    el: '#app',

    components: { EpisodeSeenTag, SeriesList, SeasonsList, AppNotifications },

    computed: {
        initialSeasons() {
            return window.series ? window.series.seasons : []
        },
    },
})

document.addEventListener('DOMContentLoaded', function () {

    // Get all "navbar-burger" elements
    let $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)

    if (!$navbarBurgers.length) {
        $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.nav-toggle'), 0)
    }

    // Check if there are any nav burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(function ($el) {
            $el.addEventListener('click', function () {

                // Get the target from the "data-target" attribute
                let target = $el.dataset.target
                let $target = document.getElementById(target)

                // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                $el.classList.toggle('is-active')
                $target.classList.toggle('is-active')

            })
        })
    }

})

const posterInput = document.getElementById('poster')
if (posterInput) {
    posterInput.onchange = function () {
        if (posterInput.files.length > 0) {
            document.getElementById('poster-file-name').innerHTML = posterInput.files[ 0 ].name
        }
    }
}
