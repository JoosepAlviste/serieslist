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
    $elem-border-radius: 4px;
    $elem-sizes: (
                    (120px, 80px),
                    (170px, 60px),
                    (80px, 60px),
                    (85px, 80px),
                    (110px, 60px),
    );
    $elem-padding: (57px - $elem-height) / 2;
    $elem-background: rgba(77, 83, 130, 0.4);

    .loading-list__row > td {
        padding-top: $elem-padding;
        padding-bottom: $elem-padding;
    }

    @for $i from 1 through length($elem-sizes) {
        $row: nth($elem-sizes, $i);
        $series-width: nth($row, 1);
        $episode-width: nth($row, 2);

        .loading-list__row:nth-child(#{length($elem-sizes)}n + #{$i}) {

            > td {
                > .loading-list__elem--series {
                    width: $series-width;
                }

                > .loading-list__elem--episode {
                    width: $episode-width;
                }
            }
        }
    }

    .loading-list__elem {
        background: $elem-background;

        display: block;
        height: $elem-height;
        border-radius: $elem-border-radius;

        animation: pulse 800ms ease-in infinite alternate;
    }

    @keyframes pulse {
        0% { opacity: 1 }
        100% { opacity: 0.7 }
    }

</style>