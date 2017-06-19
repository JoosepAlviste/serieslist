<template>
    <li class="season-element">
        <span class="season-number">
            Season {{ seasonNumber }}
        </span>

        <span class="button is-default" @click="$emit('removed', seasonNumber)">
            Remove
        </span>

        <input type="hidden" :name="'seasons[][number]'" :value="seasonNumber">
    </li>
</template>

<script>
    export default {
        props: {
            season: {
                type: Object,
                required: true,
            },
            seasonNumber: {
                type: Number,
                required: true,
            }
        },
    }
</script>

<style lang="sass">

    @import '../../../../sass/includes/variables'

    .season-element
        display: flex
        align-items: center
        justify-content: space-between
        padding: 5px 5px 5px 15px
        border: 1px solid #e3e1e4

        &:not(:first-child)
            border-top: 0

</style>
