<template>
    <div>
        <hr v-if="episodeNumber !== 1">
        <div class="field">
            <label class="label"
                   :for="'seasons[' + seasonNumber + '][episodes][' + episodeNumber + '][title]'">
                Episode {{ episodeNumber }} title:
            </label>

            <p class="control">
                <input type="text"
                       class="input"
                       v-model="episode.title"
                       :id="'seasons[' + seasonNumber + '][episodes][' + episodeNumber + '][title]'"
                       :name="'seasons[' + seasonNumber + '][episodes][' + episodeNumber + '][title]'">
            </p>
        </div>

        <button class="button is-default"
                type="button"
                @click="$emit('remove-episode-was-clicked', episodeNumber)">
            Remove episode
        </button>

        <input type="hidden"
               :value="episodeNumber"
               :id="'seasons[' + seasonNumber + '][episodes][' + episodeNumber + '][number]'"
               :name="'seasons[' + seasonNumber + '][episodes][' + episodeNumber + '][number]'">
    </div>
</template>

<script>
    export default {
        props: {
            episode: {
                type: Object,
                required: true,
            },
            episodeNumber: {
                type: Number,
                required: true,
            },
            seasonNumber: {
                type: Number,
                required: true,
            },
        },

        data() {
            return {
                episodeData: this.episode,
            }
        },

        watch: {
            episodeData() {
                this.$emit('episode-was-changed', this.episodeData, this.episodeNumber)
            },

            episode() {
                this.episodeData = this.episode
            },
        },

        mounted() {
            this.episodeData = this.episode
        },
    }
</script>
