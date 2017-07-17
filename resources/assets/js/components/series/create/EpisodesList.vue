<template>
    <div class="episodes-list">
        <h2 class="subtitle">Season {{ seasonNumber }} episodes</h2>

        <ul>
            <li v-for="(episode, index) in episodes">
                <episode-element :episode="episode"
                                 :episodeNumber="index + 1"
                                 :seasonNumber="seasonNumber"
                                 @episode-was-changed="handleEpisodeChanged"
                                 @remove-episode-was-clicked="handleRemoveEpisodeClicked">
                </episode-element>
            </li>
        </ul>

        <div class="level mt-1">
            <button class="button is-primary" type="button" @click="handleAddEpisodeClicked">
                Add an episode
            </button>

            <add-multiple-episodes-element @episodes-were-added="handleMultipleEpisodesAdded">
            </add-multiple-episodes-element>
        </div>

    </div>
</template>

<script>
    import EpisodeElement from './EpisodeElement'
    import AddMultipleEpisodesElement from './AddMultipleEpisodesElement'

    export default {

        components: { EpisodeElement, AddMultipleEpisodesElement },

        props: {
            seasonNumber: {
                type: Number,
                required: true,
            },
            episodes: {
                type: Array,
                required: true,
            },
        },

        methods: {
            handleAddEpisodeClicked() {
                window.Events.$emit('episode-added-to-season', this.seasonNumber)
            },

            handleRemoveEpisodeClicked(episodeNumber) {
                window.Events.$emit('episode-was-removed', this.seasonNumber, episodeNumber)
            },

            handleEpisodeChanged(episode, episodeNumber) {
                window.Events.$emit('episode-was-changed', episode, episodeNumber, this.seasonNumber)
            },

            handleMultipleEpisodesAdded(numberOfEpisodes) {
                for (let i = 1; i <= numberOfEpisodes; i++) {
                    window.Events.$emit(
                        'episode-added-to-season',
                        this.seasonNumber,
                        {
                            title: "Episode " + (this.episodes.length + 1)
                        }
                    )
                }
            },
        },
    }
</script>

<style lang="sass" scoped>

    .episodes-list
        padding: 10px 15px
        border: 1px solid #e3e1e4
        border-top: 0

</style>
