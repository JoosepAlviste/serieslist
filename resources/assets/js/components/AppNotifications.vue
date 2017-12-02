<template>
    <div class="notifications">

        <div
                v-for="notification in notifications"
                v-if="notification.visible"
                class="notification"
                :class="'is-' + notification.type"
        >
            <button class="delete" @click="notification.visible = false"></button>
            <span v-html="notification.message"></span>
        </div>

    </div>
</template>

<script>
    export default {
        name: "app-notifications",

        data() {
            return {
                notifications: [ ],
            }
        },

        methods: {
            add({ type = 'success', message }) {
                let notification = {
                    type, message,
                    visible: true,
                }

                this.notifications.push(notification)
            },
        },

        mounted() {
            window.Events.$on('show-notification', this.add)
        },
    }
</script>

<style lang="scss" scoped>

    .notifications {
        position: fixed;
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        bottom: 25px;
        right:  15px;
        margin-left: 15px;  /* So that left gap is as wide as right gap */
        max-width: 500px;
    }

</style>
