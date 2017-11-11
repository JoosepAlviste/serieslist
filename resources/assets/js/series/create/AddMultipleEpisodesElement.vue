<template>
    <div class="add-multiple-episodes-container">

        <input class="input add-episodes-input"
               type="number"
               v-model="numberOfEpisodes">

        <button class="button is-primary add-episodes-button"
                type="button"
                @click="handleAddEpisodesClicked">
            Add episodes
        </button>

    </div>
</template>

<script>
    export default {

        data() {
            return {
                isOpen: false,
                numberOfEpisodes: null,
            }
        },

        methods: {
            handleAddEpisodesClicked() {
                this.$emit('episodes-were-added', this.numberOfEpisodes)

                this.numberOfEpisodes = null
            },
        },
    }
</script>

<style lang="sass" scoped>

    .add-multiple-episodes-container
        display: flex
        justify-content: flex-end

    .add-episodes-button
        border-top-left-radius: 0
        border-bottom-left-radius: 0

    .add-episodes-input
        width: 5em

        border-top-right-radius: 0
        border-bottom-right-radius: 0

</style>
