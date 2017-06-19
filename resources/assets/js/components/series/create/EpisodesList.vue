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
        },

        data() {
            return {
                episodes: [],
            }
        },

        methods: {
            handleAddEpisodeClicked() {
                this.episodes.push({
                    title: '',
                })
            },

            handleRemoveEpisodeClicked(episodeNumber) {
                this.episodes.splice(episodeNumber - 1, 1)
            },

            handleEpisodeChanged(episode, episodeNumber) {
                this.episodes[episodeNumber - 1] = episode
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
