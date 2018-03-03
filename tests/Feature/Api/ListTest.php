<?php

namespace Tests\Feature;

use App\Models\Episode;
use App\Models\Season;
use App\Models\SeenEpisode;
use App\Models\Series;
use App\Models\SeriesStatus;
use App\Models\SeriesStatusType;
use App\Models\User;
use Illuminate\Foundation\Testing\TestResponse;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class ListTest extends TestCase
{
    use DatabaseMigrations;

//    /** @test */
//    function in_progress_series_contains_the_last_seen_episode()
//    {
//        $response = $this->fetchList();
//
//        $this->containsSeenEpisode($response);
//
//        $response->assertDontSeeText($this->notSeenEpisode->season->series->title);
//    }
//
//    /** @test */
//    function in_progress_series_contains_next_episode()
//    {
//        $anotherSeenEpisode = create(SeenEpisode::class, [
//            'user_id' => auth()->id(),
//        ]);
//        $nextEpisode = create(Episode::class, [
//            'number' => $this->seenEpisode->episode->number + 1,
//            'season_id' => $this->seenEpisode->episode->season->id,
//        ]);
//
//        $response = $this->fetchList();
//
//        $this->containsSeenEpisode($response);
//
//        $response->assertJsonFragment([
//            'next_episode_id' => $nextEpisode->id,
//        ]);
//
//        $response->assertDontSeeText($this->notSeenEpisode->season->series->title);
//    }
//
//    /** @test */
//    function next_episode_has_a_higher_number_than_the_seen_episode()
//    {
//        $notNextEpisode = create(Episode::class, [
//            'number' => $this->seenEpisode->episode->number - 1,
//            'season_id' => $this->seenEpisode->episode->season->id,
//        ]);
//
//        $response = $this->fetchList();
//
//        $response->assertJsonFragment([
//            'next_episode_id' => null,
//        ]);
//        $response->assertJsonMissing([
//            'next_episode_id' =>  $notNextEpisode->id,
//        ]);
//    }
//
//    /** @test */
//    function next_episode_can_be_in_the_next_season_if_seen_is_last_episode_of_season()
//    {
//        $episodeInNextSeason = create(Episode::class, [
//            'season_id' => create(Season::class, [
//                'series_id' => $this->seenEpisode->episode->season->series_id,
//                'number' => $this->seenEpisode->episode->season->number + 1,
//            ]),
//        ]);
//
//        $response = $this->fetchList();
//
//        $response->assertJsonFragment([
//            'next_episode_id' =>  $episodeInNextSeason->id,
//        ]);
//    }

    public function setUp()
    {
        parent::setUp();

        $this->signIn();
    }

    /** @test */
    function a_user_can_get_their_in_progress_series_by_status_type()
    {
        /** @var SeriesStatusType $statusType */
        $statusType = create(SeriesStatusType::class);
        /** @var SeriesStatus $seriesStatus */
        $seriesStatus = create(SeriesStatus::class, [
            'series_status_type_code' => $statusType->code,
            'user_id' => auth()->id(),
        ]);

        $this->fetchList($statusType->status)
            ->assertSee($seriesStatus->series->title);
    }

    /** @test */
    function a_user_can_get_all_their_series_when_no_status_type_is_specified()
    {
        /** @var SeriesStatus $seriesStatus */
        $seriesStatus = create(SeriesStatus::class, [
            'user_id' => auth()->id(),
        ]);
        /** @var SeriesStatus $seriesStatusB */
        $seriesStatusB = create(SeriesStatus::class, [
            'user_id' => auth()->id(),
        ]);

        $this->fetchList()
            ->assertSee($seriesStatus->series->title)
            ->assertSee($seriesStatusB->series->title);
    }

    /** @test */
    function a_user_does_not_get_series_they_have_not_assigned_a_status_to()
    {
        /** @var Series $series */
        $series = create(Series::class);

        $this->fetchList()
            ->assertDontSee($series->title);
    }

    /** @test */
    function the_returned_list_has_the_correct_format()
    {
        /** @var SeriesStatus $seriesStatus */
        $seriesStatus = create(SeriesStatus::class, [
            'user_id' => auth()->id(),
        ]);
        /** @var SeriesStatus $seriesStatusB */
        $seriesStatusB = create(SeriesStatus::class, [
            'user_id' => auth()->id(),
        ]);

        $response = $this->fetchList();

        $response->assertExactJson(['data' => [
            [
                'id' => $seriesStatus->series->id,
                'title' => $seriesStatus->series->title,
                'latestSeenEpisode' => null,
                'next_episode_id' => null,
            ],
            [
                'id' => $seriesStatusB->series->id,
                'title' => $seriesStatusB->series->title,
                'latestSeenEpisode' => null,
                'next_episode_id' => null,
            ],
        ]]);
    }

    /** @test */
    function series_list_contains_the_last_seen_episode()
    {
        /** @var SeenEpisode $seenEpisode */
        $seenEpisode = create(SeenEpisode::class, [
            'user_id' => auth()->id(),
        ]);
        create(SeriesStatus::class, [
            'series_id' => $seenEpisode->episode->season->series_id,
            'user_id' => auth()->id(),
        ]);

        $response = $this->fetchList();

        $this->containsSeenEpisode($response, $seenEpisode);
    }

    /**
     * Fetch the in progress list of the authenticated user.
     *
     * @param null|string $status
     * @return TestResponse
     */
    protected function fetchList($status = null)
    {
        $userId = auth()->id();

        if (!$status) {
            return $this->json('get', "/users/{$userId}/series");
        } else {
            return $this->json('get', "/users/{$userId}/series?status={$status}");
        }
    }

    /**
     * Assert that the response contains the latest seen episode.
     *
     * @param TestResponse $response
     *
     * @return TestResponse
     */
    protected function containsSeenEpisode($response, $seenEpisode)
    {
        return $response->assertJsonFragment([
            'latestSeenEpisode' => [
                'id' => $seenEpisode->episode->id,
                'shortSlug' => $seenEpisode->episode->shortSlug(),
            ],
        ]);
    }
}
