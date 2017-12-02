<template>
    <tbody>
    <tr v-for="row in nrOfRows" class="loading-list__row">
        <td>
                <span class="loading-list__elem  loading-list__elem--series">
                    <span class="content"></span>
                </span>
        </td>
        <td>
                <span class="loading-list__elem  loading-list__elem--episode">
                    <span class="content"></span>
                </span>
        </td>
    </tr>
    </tbody>
</template>

<script>
    export default {
        name: "loading-list",

        data() {
            return {
                nrOfRows: 6,
            }
        },
    }
</script>

<style lang="scss" scoped>

    $elem-height: 12px;
    $elem-sizes: (
                    (120px, 80px),
                    (170px, 60px),
                    (80px, 60px),
                    (85px, 80px),
                    (110px, 60px),
    );

    .loading-list__row > td {
        padding-top: 22px;
        padding-bottom: 22px;
    }

    @for $i from 1 through length($elem-sizes) {
        $row: nth($elem-sizes, $i);
        $series-width: nth($row, 1);
        $episode-width: nth($row, 2);

        .loading-list__row:nth-child(5n + #{$i}) {

            > td > .loading-list__elem--series {
                width: $series-width;
            }

            > td > .loading-list__elem--episode {
                width: $episode-width;
            }
        }
    }

    .loading-list__elem {
        background: rgba(77, 83, 130, 0.4);

        display: block;
        height: $elem-height;
        border-radius: 4px;

        animation: pulse 800ms ease-in infinite alternate;
    }

    @keyframes pulse {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0.7;
        }
    }

</style>