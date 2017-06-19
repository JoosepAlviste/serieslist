<template>
    <div class="seasons-list">
        <ul>
            <season-element v-for="(season, index) in seasons"
                            :key="index"
                            :season="season"
                            :season-number="index + 1"
                            @removed="handleSeasonRemoved">
            </season-element>
        </ul>

        <button class="button is-primary" @click="addSeason" type="button">
            +
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
