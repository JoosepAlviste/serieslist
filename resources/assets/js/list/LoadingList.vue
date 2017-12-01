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

    $elem-sizes: (
            (200px, 80px),
            (300px, 50px),
            (150px, 50px),
            (175px, 80px),
            (275px, 50px),
    );

    .loading-list__row {
        @for $i from 1 through length($elem-sizes) {
            $row: nth($elem-sizes, $i);
            $series-width: nth($row, 1);
            $episode-width: nth($row, 2);

            &:nth-child(5n + #{$i}) {
                .loading-list__elem--series {
                    width: $series-width;
                }

                .loading-list__elem--episode {
                    width: $episode-width;
                }
            }
        }
    }

    .loading-list__elem {
        background: rgba(77, 83, 130, 0.4);

        display: block;
        height: 30px;
        border-radius: 5px;

        animation: pulse 800ms ease-in-out infinite alternate;
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