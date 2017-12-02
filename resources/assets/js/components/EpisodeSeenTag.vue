<template>
    <span
            class="seen-tag tag is-medium"
            :class="{ 'is-disabled': disabled, 'is-primary': isSeenVal, 'is-default': !isSeenVal }"
            @click="handleClicked"
    >
        {{ text }}
        <button
                v-if="isSeenVal"
                class="delete is-medium"
                type="button"
        >
        </button>
    </span>
</template>

<script>
    export default {
        props: {
            itemId: {
                type: Number,
                required: true,
            },
            isSeen: {
                type: Boolean,
                required: true,
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            type: {
                type: String,
                required: false,
                default: 'episode',
            },
        },

        data() {
            return {
                isSeenVal: false,
            }
        },

        computed: {
            url() {
                return `/${this.type}s/${this.itemId}/seen-episodes`
            },

            text() {
                return this.isSeenVal ? 'Seen' : 'Mark as seen'
            },
        },

        mounted() {
            this.isSeenVal = this.isSeen
        },

        methods: {
            handleClicked(e) {
                window.axios.post(this.url)
                    .then(response => {
                        this.isSeenVal = ! this.isSeenVal
                    })
                    .catch(error => {
                        console.log(error)
                    })
            },
        },
    }
</script>

<style lang="scss" scoped>

    @import '../../sass/includes/variables';

    .seen-tag {
        cursor: pointer;

        .delete {
            display: none
        }

        &:hover .delete {
            display: block
        }

        &.has-hover {
            &.is-default:hover {
                background: $white-bis
            }

            &.is-primary:hover {
                background: darken($primary, 5%)
            }
        }
    }

</style>
