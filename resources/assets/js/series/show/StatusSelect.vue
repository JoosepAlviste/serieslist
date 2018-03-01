<template>
    <div class="field">
        <div class="control">
            <div class="select">
                <select v-model="status">
                    <option :value="null">No status</option>
                    <option
                        v-for="statusType in statusTypes"
                        :value="statusType.code"
                        v-text="statusType.pretty"
                    />
                </select>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'status-select',

        props: {
            dataStatus: {
                type: Number,
            },
            statusTypes: {
                type: Array,
            },
            seriesId: {
                type: Number,
            },
        },

        data() {
            return {
                status: this.dataStatus,
            }
        },

        watch: {
            status(newVal, oldVal) {
                if (newVal === oldVal) return

                if (this.status === null) {
                    this.remove()
                } else {
                    this.update(this.status)
                }
            },
        },

        methods: {
            update(status) {
                axios.put(`/series/${this.seriesId}/status`, {
                    code: status,
                }).then(response => {
                    window.Events.$emit('show-notification', {
                        message: 'Series status updated!',
                        type: 'success',
                    })
                })
            },

            remove() {
                axios.delete(`/series/${this.seriesId}/status`)
                    .then(response => {
                        window.Events.$emit('show-notification', {
                            message: 'Series status removed!',
                            type: 'success',
                        })
                    })
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>