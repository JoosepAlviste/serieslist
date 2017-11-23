<template>
    <div>
        <hr v-if="episodeNumber !== 1">
        <div class="field">
            <label
                    class="label"
                    :for="titleName"
            >
                Episode {{ episodeNumber }} title:
            </label>

            <p class="control">
                <input
                        type="text"
                        class="input"
                        v-model="episode.title"
                        :id="titleName"
                        :name="titleName"
                >
            </p>
        </div>

        <button
                class="button is-default"
                type="button"
                @click="$emit('remove-episode-was-clicked', episodeNumber)"
        >
            Remove episode
        </button>

        <input
                type="hidden"
                :value="episodeNumber"
                :id="numberName"
                :name="numberName"
        >
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

        computed: {
            titleName() {
                return `seasons[${this.seasonNumber}][episodes][${this.episodeNumber}][title]`
            },

            numberName() {
                return `seasons[${this.seasonNumber}][episodes][${this.episodeNumber}][number]`
            },
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
