<template>
    <div class="seasons-list">
        <h3 class="subtitle">Seasons</h3>

        <ul class="seasons-list-list">
            <season-element v-for="(season, index) in seasons"
                            :key="index"
                            :season="season"
                            :season-number="index + 1"
                            @removed="handleSeasonRemoved">
            </season-element>
        </ul>

        <button class="button is-primary" @click="addSeason" type="button">
            Add a season
        </button>
    </div>
</template>

<script>
    import SeasonElement from './SeasonElement.vue'

    export default {
        components: { SeasonElement },

        data() {
            return {
                seasons: [],
            }
        },

        methods: {
            addSeason() {
                this.seasons.push({ })
            },

            handleSeasonRemoved(seasonNumber) {
                this.seasons.splice(seasonNumber - 1, 1)
            },
        },
    }
</script>

<style lang="sass" scoped>

    @import '../../../../sass/includes/mixins'

    .seasons-list
        margin-bottom: 20px

    .seasons-list-list
        margin-bottom: 20px
        +box-shadow(0 2px 7px -3px rgba(0, 0, 0, 0.2))

</style>
