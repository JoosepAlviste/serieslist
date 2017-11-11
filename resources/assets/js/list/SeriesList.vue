<template>
    <div>
        <table class="table series-list__table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Latest seen episode</th>
                </tr>
            </thead>
            <tbody>

                <tr v-if="loading">
                    <td colspan="2">
                        <loading-spinner></loading-spinner>
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

    export default {
        name: 'SeriesList',

        components: { ListElement, LoadingSpinner },

        data() {
            return {
                inProgressSeries: [],
                loading: false,
            }
        },

        methods: {
            findInProgressSeries() {
                window.axios.get('/users/' + window.App.user.id + '/series')
                    .then(({data}) => {
                        this.inProgressSeries = data.data

                        this.loading = false
                    })
            },

            handleLatestSeenUpdated(series, episode) {
                series.latestSeenEpisode = episode
            },
        },

        mounted() {
            this.loading = true

            setTimeout(() => {
                this.findInProgressSeries()
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

</style>
