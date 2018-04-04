<template>
    <div>
        <div class="tabs is-medium is-fullwidth  series-list__tabs">
            <ul>
                <li
                    v-for="statusType in statusTypes"
                    :class="{ 'is-active': statusType.status === activeStatus }"
                >
                    <a
                        v-text="statusType.pretty"
                        @click="handleTabChanged(statusType.status)"
                    />
                </li>
            </ul>
        </div>

        <table class="table series-list__table">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Latest seen episode</th>
                </tr>
            </thead>

            <loading-list v-if="initialLoading" />

            <tbody v-else>

                <tr v-if="noInProgressSeries">
                    <td colspan="2">
                        <p class="no-series-seen-message">
                            Set a series as '{{ activeStatusType.pretty }}' and
                            it will show up here!
                        </p>
                    </td>
                </tr>

                <list-element
                    v-for="oneSeries in series"
                    :key="oneSeries.id"
                    :series="oneSeries"
                    @latest-seen-episode-was-updated="handleLatestSeenUpdated(oneSeries, $event)"
                />
            </tbody>
        </table>
    </div>
</template>

<script>
    import ListElement from './ListElement.vue'
    import LoadingList from './LoadingList'

    export default {
        name: 'SeriesList',

        components: { ListElement, LoadingList },

        props: {
            dataStatusTypes: {
                type: Array,
                required: true,
            },
            dataActiveStatusType: {
                type: String,
                required: false,
                default: 'in-progress',
            },
        },

        data() {
            return {
                series: [],
                loading: false,
                initialLoading: true,
                activeStatus: this.dataActiveStatusType,
            }
        },

        computed: {
            /**
             * If there are no series in progress.
             */
            noInProgressSeries() {
                return !this.series.length && !this.loading
            },

            /**
             * Include other filters (for tabs) in the status types.
             */
            statusTypes() {
                return [
                    {
                        code: 0,
                        pretty: 'All',
                        status: 'all',
                    },
                    ...this.dataStatusTypes,
                ]
            },

            /**
             * The currently active series status type.
             */
            activeStatusType() {
                return this.statusTypes
                    .filter(type => type.status === this.activeStatus)[0]
            },
        },

        methods: {
            /**
             * Fetch the in progress series for the current user.
             */
            fetchSeries() {
                const params = { }
                if (this.activeStatusType.status !== 'all') {
                    params.status = this.activeStatusType.status
                }

                this.loading = true
                window.axios.get(`/users/${window.App.user.id}/series`, {
                    params,
                })
                    .then(({data}) => {
                        this.series = data.data

                        this.initialLoading = false
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

            handleTabChanged(statusType) {
                this.activeStatus = statusType
                this.fetchSeries()
            },
        },

        mounted() {
            setTimeout(() => {
                // This timeout is here so we can see the request in
                // the debug bar.
                this.fetchSeries()
            }, 0)
        },
    }
</script>

<style lang="scss">

    .series-list__container .series-list__tabs {
        margin-bottom: 0;
    }

    .series-list__table {
        width: 100%;

        td {
            padding-top: 1em;
            padding-bottom: 1em;
        }

        th {
            padding-top: 1em;
            padding-bottom: 1em;
        }
    }

    .no-series-seen-message {
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }

</style>
