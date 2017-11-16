import Vue from 'vue'

import './bootstrap'
import EpisodeSeenTag from './components/EpisodeSeenTag.vue'

const app = new Vue({
    el: '#app',
    components: { EpisodeSeenTag },
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
