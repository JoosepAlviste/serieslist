<template>
    <div class="seasons-list">
        <h3 class="subtitle">Seasons</h3>

        <ul class="seasons-list-list">
            <season-element
                    v-for="(season, index) in seasons"
                    :key="index"
                    :season="season"
                    :season-number="index + 1"
                    @removed="handleSeasonRemoved"
                    @add-episode-was-clicked="handleAddEpisodeClicked(season)">
            </season-element>
        </ul>

        <button
                class="button is-primary"
                type="button"
                @click="addSeason"
        >
            Add a season
        </button>
    </div>
</template>

<script>
    import SeasonElement from './SeasonElement.vue'

    export default {
        components: { SeasonElement },

        data() {
            return {
                seasons: [],
            }
        },

        methods: {
            addSeason() {
                this.seasons.push({
                    episodes: [],
                })
            },

            handleSeasonRemoved(seasonNumber) {
                this.seasons.splice(seasonNumber - 1, 1)
            },
        },

        mounted() {
            this.seasons = window.series ? window.series.seasons : []

            window.Events.$on('episode-added-to-season', (seasonNumber, episode = null) => {
                if (!episode) {
                    this.seasons[seasonNumber - 1].episodes.push({
                        title: '',
                    })
                } else {
                    this.seasons[seasonNumber - 1].episodes.push(episode)
                }
            })
            window.Events.$on('episode-was-removed', (seasonNumber, episodeNumber) => {
                this.seasons[seasonNumber - 1].episodes.splice(episodeNumber - 1, 1)
            })
            window.Events.$on('episode-was-changed', (episode, episodeNumber, seasonNumber) => {
                this.seasons[seasonNumber - 1].episodes[episodeNumber - 1] = episode
            })
        },
    }
</script>

<style lang="sass" scoped>

    @import '../../../sass/includes/mixins'

    .seasons-list
        margin-bottom: 20px

    .seasons-list-list
        margin-bottom: 20px
        box-shadow: 0 2px 7px -3px rgba(0, 0, 0, 0.2)

</style>
