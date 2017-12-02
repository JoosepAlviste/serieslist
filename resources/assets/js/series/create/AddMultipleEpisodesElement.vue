<template>
    <div class="add-multiple-episodes-element">

        <input
                class="input has-sharp-right-corners add-episodes-input"
                type="number"
                v-model="numberOfEpisodes"
        >

        <button
                class="button is-primary has-sharp-left-corners"
                type="button"
                @click="handleAddEpisodesClicked"
        >
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

<style lang="scss" scoped>

    .add-multiple-episodes-element {
        display: flex;
        justify-content: flex-end;
    }

    .add-episodes-input {
        width: 5em;
    }

</style>
