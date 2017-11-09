<template>
    <tr>
        <td>
            <a :href="seriesLink">
                {{ series.title }}
            </a>
        </td>
        <td>
            <span v-if="latestSeenEpisodeLink">
                <a :href="latestSeenEpisodeLink"
                   v-text="latestSeenEpisode">
                </a>
                <span class="fa fa-plus-circle series-list-element__mark-as-seen"
                      v-if="series.nextEpisode"
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
            latestSeenEpisode() {
                if (this.series.latestSeenEpisode) {
                    return this.series.latestSeenEpisode.shortSlug
                }

                return '-'
            },

            latestSeenEpisodeLink() {
                if (this.series.latestSeenEpisode) {
                    return '/series/' + this.series.id + '/episodes/' + this.series.latestSeenEpisode.id
                }

                return null
            },

            seriesLink() {
                return '/series/' + this.series.id
            },
        },

        methods: {
            markNextEpisodeAsSeen() {
                if (this.series.nextEpisode) {
                    window.axios.post('episodes/' + this.series.nextEpisode.id + '/seen-episodes')
                        .then(({data}) => {
                            this.$emit('latest-seen-episode-was-updated', data)
                        })
                }
            },
        },
    }
</script>

<style lang="sass">

    @import '../../../sass/includes/variables'

    .series-list-element__mark-as-seen
        cursor: pointer
        color: $primary
        font-size: 1.1em
        vertical-align: baseline

</style>
