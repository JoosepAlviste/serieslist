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
                        <p class="no-series-status-message" v-text="noSeriesStatusMessage" />
                    </td>
                </tr>

                <list-element
                    v-for="oneSeries in seriesWithNextEpisode"
                    :key="oneSeries.id"
                    :series="oneSeries"
                    @latest-seen-episode-was-updated="handleLatestSeenUpdated(oneSeries, $event)"
                />

                <tr v-if="seriesWithNextEpisode.length && seriesWithoutNextEpisode.length">
                    <td colspan="2">
                        <p><strong>Waiting for more episodes</strong></p>
                    </td>
                </tr>

                <list-element
                    v-for="oneSeries in seriesWithoutNextEpisode"
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

            /**
             * The message to show when the user has not marked any episodes as
             * the currently active status type.
             *
             * @return {string}
             */
            noSeriesStatusMessage() {
                if (this.activeStatusType.code === 0) {
                    return 'Set a status for a series and it will show up here!'
                }

                return `Set a series as '${this.activeStatusType.pretty}' and it will show up here!`
            },

            /**
             * Series where there is a next episode to be seen.
             */
            seriesWithNextEpisode() {
                return this.series
                    .filter(series => series.next_episode_id !== null ||
                        (series.latestSeenEpisode === null && series.next_episode_id === null))
            },

            /**
             * Series which don't have a next episode.
             */
            seriesWithoutNextEpisode() {
                return this.series
                    .filter(series => series.next_episode_id === null &&
                        series.latestSeenEpisode !== null)
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
                    headers: {
                        'X-CSRF-TOKEN': window.App.csrfToken,
                    },
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
                history.pushState({
                    filter: this.activeStatus
                }, '', `/list/${this.activeStatus}`)

                this.fetchSeries()
            },
        },

        mounted() {
            setTimeout(() => {
                // This timeout is here so we can see the request in
                // the debug bar.
                this.fetchSeries()
            }, 0)

            window.addEventListener('popstate', e => {
                this.activeStatus = e.state.filter
                this.fetchSeries()
            })
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

    .no-series-status-message {
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }

</style>
