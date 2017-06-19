<template>
    <li class="season-element">
        Season {{ seasonNumber }} <span class="button is-default" @click="$emit('removed', seasonNumber)">-</span>

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
