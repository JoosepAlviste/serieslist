<?php

namespace Tests\Feature;

use App\Models\Episode;
use App\Models\Season;
use App\Models\SeenEpisode;
use Illuminate\Foundation\Testing\TestResponse;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class ListTest extends TestCase
{
    use DatabaseMigrations;

    /** @var SeenEpisode */
    protected $seenEpisode;
    /** @var Episode */
    protected $notSeenEpisode;

    public function setUp()
    {
        parent::setUp();

        $this->signIn();
        $this->seenEpisode = create(SeenEpisode::class, [
            'user_id' => auth()->id(),
        ]);
        $this->notSeenEpisode = create(Episode::class);
    }

    /** @test */
    function a_users_in_progress_list_can_be_accessed()
    {
        $seenEpisodeTwo = create(SeenEpisode::class, [
            'user_id' => auth()->id(),
        ]);

        $response = $this->fetchList();

        $response->assertSee($this->seenEpisode->episode->season->series->title);
        $response->assertSee($seenEpisodeTwo->episode->season->series->title);

        $response->assertDontSee($this->notSeenEpisode->season->series->title);
    }

    /** @test */
    function in_progress_series_contains_the_last_seen_episode()
    {
        $response = $this->fetchList();

        $this->containsSeenEpisode($response);

        $response->assertDontSeeText($this->notSeenEpisode->season->series->title);
    }
    
    /** @test */
    function in_progress_series_contains_next_episode()
    {
        $anotherSeenEpisode = create(SeenEpisode::class, [
            'user_id' => auth()->id(),
        ]);
        $nextEpisode = create(Episode::class, [
            'number' => $this->seenEpisode->episode->number + 1,
            'season_id' => $this->seenEpisode->episode->season->id,
        ]);

        $response = $this->fetchList();

        $this->containsSeenEpisode($response);

        $response->assertJsonFragment([
            'next_episode_id' => $nextEpisode->id,
        ]);

        $response->assertDontSeeText($this->notSeenEpisode->season->series->title);
    }

    /** @test */
    function next_episode_has_a_higher_number_than_the_seen_episode()
    {
        $notNextEpisode = create(Episode::class, [
            'number' => $this->seenEpisode->episode->number - 1,
            'season_id' => $this->seenEpisode->episode->season->id,
        ]);

        $response = $this->fetchList();

        $response->assertJsonFragment([
            'next_episode_id' => null,
        ]);
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

        $response = $this->fetchList();

        $response->assertJsonFragment([
            'next_episode_id' =>  $episodeInNextSeason->id,
        ]);
    }

    /**
     * Fetch the in progress list of the authenticated user.
     *
     * @return TestResponse
     */
    protected function fetchList()
    {
        $userId = auth()->id();

        return $this->json('get', "/users/{$userId}/series");
    }

    /**
     * Assert that the response contains the latest seen episode.
     *
     * @param TestResponse $response
     *
     * @return TestResponse
     */
    protected function containsSeenEpisode($response)
    {
        return $response->assertJsonFragment([
            'latestSeenEpisode' => [
                'id' => $this->seenEpisode->episode->id,
                'shortSlug' => $this->seenEpisode->episode->shortSlug(),
            ],
        ]);
    }
}
