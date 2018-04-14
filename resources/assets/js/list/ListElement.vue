<template>
    <tr>
        <td>
            <a :href="seriesLink" v-text="series.title"></a>
        </td>
        <td>
            <span v-if="latestSeenEpisodeLink">
                <a :href="latestSeenEpisodeLink"
                   v-text="latestSeenEpisode">
                </a>
                <span class="fa fa-plus-circle series-list-element__mark-as-seen"
                      v-if="series.next_episode_id"
                      @click="markNextEpisodeAsSeen">
                </span>
            </span>
            <span v-else v-text="latestSeenEpisode"></span>
        </td>
    </tr>
</template>

<script>
    export default {
        props: {
            series: {
                required: true,
                type: Object,
            },
        },

        computed: {
            /**
             * The latest seen episode text. If no episode has been seen,
             * will show '-'. (This should never happen tho).
             *
             * @returns {String}
             */
            latestSeenEpisode() {
                if (this.series.latestSeenEpisode) {
                    return this.series.latestSeenEpisode.shortSlug
                }

                return '-'
            },

            /**
             * The link to the latest seen episode.
             *
             * @returns {String|null}
             */
            latestSeenEpisodeLink() {
                if (this.series.latestSeenEpisode) {
                    const seriesId = this.series.id
                    const episodeId = this.series.latestSeenEpisode.id

                    return `/series/${seriesId}/episodes/${episodeId}`
                }

                return null
            },

            /**
             * The link to the series.
             *
             * @returns {String}
             */
            seriesLink() {
                return `/series/${this.series.id}`
            },
        },

        methods: {
            /**
             * Mark the next episode as seen for this series.
             */
            markNextEpisodeAsSeen() {
                if (this.series.next_episode_id) {
                    const nextEpisodeId = this.series.next_episode_id

                    window.axios.post(`/episodes/${nextEpisodeId}/seen-episodes`)
                        .then(({data}) => {
                            this.$emit('latest-seen-episode-was-updated', data.data)
                        })
                }
            },
        },
    }
</script>

<style lang="scss">

    @import '../../sass/includes/variables';

    .series-list-element__mark-as-seen {
        cursor: pointer;
        color: $primary;
        font-size: 1.1em;
        vertical-align: baseline;
    }

</style>
