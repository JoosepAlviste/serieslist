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
                <list-element v-for="series in inProgressSeries"
                              :key="series.id"
                              :series="series"
                              @latest-seen-episode-was-updated="handleLatestSeenUpdated(series, $event)">
                </list-element>
            </tbody>
        </table>
    </div>
</template>

<script>
    import ListElement from './ListElement.vue'

    export default {
        name: 'SeriesList',

        components: { ListElement },

        data() {
            return {
                inProgressSeries: [],
            }
        },

        methods: {
            findInProgressSeries() {
                window.axios.get('/users/' + window.App.user.id + '/series')
                    .then(({data}) => {
                        console.log(data)
                        this.inProgressSeries = data
                    })
            },

            handleLatestSeenUpdated(series, episode) {
                series.latestSeenEpisode = episode
            },
        },

        mounted() {
            this.findInProgressSeries()
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
