<template>
    <li class="season-element" :class="[ episodesOpenClass ]">
        <div class="season-container" @click="toggleEpisodesOpen">
            <span class="season-number">

                <span class="dropdown-arrow">
                    <svg x="0px" y="0px" viewBox="0 0 477.175 477.175" style="enable-background:new 0 0 477.175 477.175;"
                         xml:space="preserve">
                        <path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5 c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"/>
                    </svg>
                </span>

                <span>
                    Season {{ seasonNumber }}
                </span>
            </span>

            <span class="button is-default" @click="$emit('removed', seasonNumber)">
                Remove
            </span>
        </div>

        <episodes-list v-show="episodesOpen"
                       :episodes="season.episodes"
                       :season-number="seasonNumber"
                       @add-episode-clicked="$emit('add-episode-was-clicked')">
        </episodes-list>

        <input type="hidden" :name="'seasons[' + seasonNumber + '][number]'" :value="seasonNumber">
    </li>
</template>

<script>
    import EpisodesList from './EpisodesList.vue'

    export default {

        components: { EpisodesList },

        props: {
            season: {
                type: Object,
                required: true,
            },
            seasonNumber: {
                type: Number,
                required: true,
            },
        },

        data() {
            return {
                episodesOpen: true,
            }
        },

        computed: {
            episodesOpenClass() {
                return this.episodesOpen ? 'is-open' : 'is-closed'
            },
        },

        methods: {
            toggleEpisodesOpen() {
                this.episodesOpen = !this.episodesOpen
            },
        },

        mounted() {
            if (window.series) {
                this.episodesOpen = false
            }
        },
    }
</script>

<style lang="sass">

    @import '../../../sass/includes/variables'
    @import '../../../sass/includes/mixins'

    .season-element

        &:not(:first-child) .season-container
            border-top: 0

        .dropdown-arrow svg
            +transition(transform .2s ease-in)

        &.is-open
            .season-container
                +box-shadow(0px 2px 2px -2px rgba(0,0,0,0.2))

            .dropdown-arrow svg
                +transform(rotate(90deg))

        &.is-closed .dropdown-arrow svg
            +transform(rotate(0))


    .season-container
        display: flex
        align-items: center
        justify-content: space-between
        padding: 5px 5px 5px 15px
        border: 1px solid #e3e1e4

        &:hover
            cursor: pointer


    .season-number
        display: flex
        user-select: none

        .dropdown-arrow
            height: 1.5em
            width: 1.5em
            margin-right: .4em
            padding: .2em

</style>
