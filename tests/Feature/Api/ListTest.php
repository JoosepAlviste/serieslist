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

    /** @var SeriesStatusType */
    private $seriesStatusType;
    /** @var Series */
    private $series;
    /** @var SeenEpisode */
    private $seenEpisode;

    public function setUp()
    {
        parent::setUp();

        $this->signIn();
        $this->seriesStatusType = create(SeriesStatusType::class);
        $this->seenEpisode = create(SeenEpisode::class, [
            'user_id' => auth()->id(),
        ]);
        $this->series = $this->seenEpisode->episode->season->series;

        $this->series->setProgress($this->seenEpisode->episode_id);

        create(SeriesStatus::class, [
            'user_id' => auth()->id(),
            'series_id' => $this->series->id,
            'series_status_type_code' => $this->seriesStatusType->code,
        ]);
    }

    /** @test */
    function a_user_can_get_their_in_progress_series_by_status_type()
    {
        $this->fetchList($this->seriesStatusType->status)
            ->assertSee($this->series->title);
    }

    /** @test */
    function a_user_can_get_all_their_series_when_no_status_type_is_specified()
    {
        /** @var SeriesStatus $seriesStatusB */
        $seriesStatusB = create(SeriesStatus::class, [
            'user_id' => auth()->id(),
        ]);

        $this->fetchList()
            ->assertSee($this->series->title)
            ->assertSee($seriesStatusB->series->title);
    }

    /** @test */
    function series_list_does_not_include_series_the_user_has_not_assigned_a_status_to()
    {
        /** @var Series $series */
        $series = create(Series::class);

        $this->fetchList()
            ->assertDontSee($series->title);
    }

    /** @test */
    function series_list_has_the_correct_format()
    {
        $nextEpisode = $this->nextEpisode();
        $this->series->setProgress(
            $this->seenEpisode->episode_id, $nextEpisode->id
        );

        /** @var SeriesStatus $seriesStatusB */
        $seriesStatusB = create(SeriesStatus::class, [
            'user_id' => auth()->id(),
        ]);

        $response = $this->fetchList();

        $response->assertExactJson(['data' => [
            [
                'id' => $this->series->id,
                'title' => $this->series->title,
                'latestSeenEpisode' => [
                    'id' => $this->seenEpisode->episode->id,
                    'shortSlug' => $this->seenEpisode->episode->shortSlug(),
                ],
                'next_episode_id' => $nextEpisode->id,
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
        $response = $this->fetchList();

        $this->containsSeenEpisode($response, $this->seenEpisode);
    }

    /** @test */
    function series_list_does_not_contain_not_seen_episodes()
    {
        $notSeenEpisode = create(Episode::class, [
            'season_id' => create(Season::class, [
                'series_id' => $this->series->id,
            ])->id,
        ]);

        $response = $this->fetchList();

        $this->containsSeenEpisode($response, $this->seenEpisode);

        $response->assertJsonMissing([
            'latestSeenEpisode' => [
                'id' => $notSeenEpisode->id,
                'shortSlug' => $notSeenEpisode->shortSlug(),
            ],
        ]);
    }

    /** @test */
    function series_list_contains_next_episode()
    {
        $nextEpisode = $this->nextEpisode();
        $this->series->setProgress(
            $this->seenEpisode->episode_id, $nextEpisode->id
        );

        $this->fetchList()
            ->assertJsonFragment([
                'next_episode_id' => $nextEpisode->id,
            ]);
    }

    /** @test */
    function next_episode_has_a_higher_number_than_the_seen_episode()
    {
        $notNextEpisode = create(Episode::class, [
            'number' => $this->seenEpisode->episode->number - 1,
            'season_id' => $this->seenEpisode->episode->season->id,
        ]);

        $response = $this->fetchList();

        $response->assertJsonMissing([
            'next_episode_id' =>  $notNextEpisode->id,
        ]);
    }

    /** @test */
    function next_episode_can_be_in_the_next_season_if_seen_is_last_episode_of_season()
    {
        $episodeInNextSeason = create(Episode::class, [
            'season_id' => create(Season::class, [
                'series_id' => $this->seenEpisode->episode->season->series_id,
                'number' => $this->seenEpisode->episode->season->number + 1,
            ]),
        ]);
        $this->series->setProgress(
            $this->seenEpisode->episode_id, $episodeInNextSeason->id
        );

        $response = $this->fetchList();

        $response->assertJsonFragment([
            'next_episode_id' =>  $episodeInNextSeason->id,
        ]);
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

    /**
     * Create a next episode for the seen episode.
     *
     * @return Episode
     */
    protected function nextEpisode()
    {
        return create(Episode::class, [
            'number' => $this->seenEpisode->episode->number + 1,
            'season_id' => $this->seenEpisode->episode->season->id,
        ]);
    }
}
