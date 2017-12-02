<template>
    <li class="season-element" :class="[ episodesOpenClass ]">
        <div class="season-container" @click="toggleEpisodesOpen">
            <span class="season-number">

                <dropdown-arrow :is-open="episodesOpen"></dropdown-arrow>

                <span>
                    Season {{ seasonNumber }}
                </span>
            </span>

            <span class="button is-default" @click="$emit('removed', seasonNumber)">
                Remove
            </span>
        </div>

        <episodes-list
                v-show="episodesOpen"
                :episodes="season.episodes"
                :season-number="seasonNumber"
                @add-episode-clicked="$emit('add-episode-was-clicked')"
        >
        </episodes-list>

        <input type="hidden" :name="seasonNumberName" :value="seasonNumber">
    </li>
</template>

<script>
    import EpisodesList from './EpisodesList.vue'
    import DropdownArrow from '../../components/DropdownArrow.vue'

    export default {

        components: { EpisodesList, DropdownArrow },

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

            seasonNumberName() {
                return `seasons[${this.seasonNumber}][number]`
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

<style lang="scss">

    @import '../../../sass/includes/variables';

    .season-element {

        &:not(:first-child) .season-container {
            border-top: 0;
        }

        &.is-open {
            > .season-container {
                box-shadow: 0 2px 2px -2px rgba(0, 0, 0, 0.2);
            }
        }
    }


    .season-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 5px 5px 5px 15px;
        border: 1px solid #e3e1e4;

        &:hover {
            cursor: pointer;
        }
    }


    .season-number {
        display: flex;
        user-select: none;
    }

</style>
