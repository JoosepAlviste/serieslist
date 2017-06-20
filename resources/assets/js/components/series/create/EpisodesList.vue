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

        <button class="button is-primary mt-1" type="button" @click="handleAddEpisodeClicked">
            Add an episode
        </button>
    </div>
</template>

<script>
    import EpisodeElement from './EpisodeElement.vue'

    export default {

        components: { EpisodeElement },

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
        },
    }
</script>

<style lang="sass" scoped>

    .episodes-list
        padding: 10px 15px
        border: 1px solid #e3e1e4
        border-top: 0

</style>
