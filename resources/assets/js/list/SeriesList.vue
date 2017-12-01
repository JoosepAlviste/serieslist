<template>
    <div>
        <table class="table series-list__table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Latest seen episode</th>
                </tr>
            </thead>

            <loading-list v-if="loading"></loading-list>

            <tbody v-if="!loading">

                <!--<tr v-if="loading">-->
                    <!--<td colspan="2">-->
                        <!--<loading-spinner></loading-spinner>-->
                    <!--</td>-->
                <!--</tr>-->

                <tr v-if="!inProgressSeries.length">
                    <td colspan="2">
                        <p class="no-series-seen-message">
                            Set an episode as 'seen' and the series will show up here!
                        </p>
                    </td>
                </tr>

                <list-element
                        v-for="series in inProgressSeries"
                        :key="series.id"
                        :series="series"
                        @latest-seen-episode-was-updated="handleLatestSeenUpdated(series, $event)"
                >
                </list-element>
            </tbody>
        </table>
    </div>
</template>

<script>
    import ListElement from './ListElement.vue'
    import LoadingSpinner from '../components/LoadingSpinner.vue'
    import LoadingList from './LoadingList'

    export default {
        name: 'SeriesList',

        components: { ListElement, LoadingSpinner, LoadingList },

        data() {
            return {
                inProgressSeries: [],
                loading: false,
            }
        },

        methods: {
            /**
             * Fetch the in progress series for the current user.
             */
            fetchInProgressSeries() {
                window.axios.get(`/users/${window.App.user.id}/series`)
                    .then(({data}) => {
                        this.inProgressSeries = data.data

                        this.loading = false
                    })
            },

            /**
             * When the latest seen is updated, set the latest seen to the
             * next episode and next episode id to the one after that.
             *
             * @param {Object} series
             * @param {{id: Number, shortSlug: String}} latestSeenEpisode
             * @param {Number} next_episode_id
             */
            handleLatestSeenUpdated(series, { latestSeenEpisode, next_episode_id }) {
                series.latestSeenEpisode = latestSeenEpisode
                series.next_episode_id = next_episode_id
            },
        },

        mounted() {
            this.loading = true

            setTimeout(() => {
                // This timeout is here so we can see the request in
                // the debug bar.
                this.fetchInProgressSeries()
            }, 100)
        },
    }
</script>

<style lang="sass">

    .series-list__table
        width: 100%

        td
            padding-top: 1em
            padding-bottom: 1em

        th
            padding-top: 1em
            padding-bottom: 1em

    .no-series-seen-message
        margin-top: 20px
        margin-bottom: 20px
        text-align: center

</style>
