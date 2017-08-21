<?php

namespace Tests\Unit;

use App\Models\Episode;
use App\Models\Season;
use App\Models\SeenEpisode;
use App\Models\Series;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class EpisodeTest extends TestCase
{
    use DatabaseMigrations;

    /** @var Episode */
    protected $episode;

    public function setUp()
    {
        parent::setUp();

        $this->episode = create(Episode::class);
    }

    /** @test */
    function an_episode_belongs_to_a_season()
    {
        $this->assertInstanceOf(Season::class, $this->episode->season);
    }

    /** @test */
    function an_episode_can_make_a_string_path()
    {
        $this->assertEquals(
            "/series/{$this->episode->season->series->id}/episodes/{$this->episode->id}",
            $this->episode->path()
        );
    }

    /** @test */
    function it_can_be_marked_as_seen()
    {
        $user = create(User::class);

        $this->episode->markAsSeen($user->id);

        $this->assertDatabaseHas('seen_episodes', [
            'user_id' => $user->id,
            'episode_id' => $this->episode->id,
        ]);
    }

    /** @test */
    function it_can_be_marked_as_not_seen()
    {
        /** @var SeenEpisode $seenEpisode */
        $seenEpisode = create(SeenEpisode::class);

        $seenEpisode->episode->markAsNotSeen($seenEpisode->user_id);

        $this->assertDatabaseMissing('seen_episodes', [
            'user_id' => $seenEpisode->user_id,
            'episode_id' => $seenEpisode->episode_id,
        ]);
    }

    /** @test */
    function its_seen_status_can_be_toggled()
    {
        $this->signIn();

        $this->episode->toggleSeen();

        $this->assertDatabaseHas('seen_episodes', [
            'episode_id' => $this->episode->id,
            'user_id' => auth()->id(),
        ]);

        $this->episode->fresh()->toggleSeen();

        $this->assertDatabaseMissing('seen_episodes', [
            'episode_id' => $this->episode->id,
            'user_id' => auth()->id(),
        ]);
    }

    /** @test */
    function its_seen_status_can_be_queried()
    {
        $this->signIn();

        $this->assertFalse($this->episode->isSeen);

        create(SeenEpisode::class, ['user_id' => auth()->id(), 'episode_id' => $this->episode->id]);

        $this->assertTrue($this->episode->fresh()->isSeen);
    }

    /** @test */
    function it_can_make_a_string_short_slug()
    {
        $episode = create(Episode::class, [
            'season_id' => create(Season::class, ['number' => 2]),
            'number' => 4
        ]);

        $this->assertEquals(
            "S02E04",
            $episode->shortSlug()
        );
    }

    /** @test */
    function it_knows_the_next_episode()
    {
        $season = create(Season::class);
        $episode = create(Episode::class, [
            'number' => 1,
            'season_id' => $season->id,
        ]);
        $episodeTwo = create(Episode::class, [
            'number' => 2,
            'season_id' => $season->id,
        ]);

        $this->assertEquals(
            $episodeTwo->id,
            $episode->nextEpisode()->id
        );
    }

    /** @test */
    function it_knows_the_next_episode_if_its_in_the_next_season()
    {
        $series = create(Series::class);
        $season = create(Season::class, [
            'series_id' => $series->id,
        ]);
        $seasonTwo = create(Season::class, [
            'number' => $season->number + 1,
            'series_id' => $series->id,
        ]);
        $episode = create(Episode::class, [
            'number' => 1,
            'season_id' => $season->id,
        ]);
        $episodeTwo = create(Episode::class, [
            'number' => 1,
            'season_id' => $seasonTwo->id,
        ]);

        $this->assertEquals(
            $episodeTwo->id,
            $episode->nextEpisode()->id
        );
    }

    /** @test */
    function episodes_are_ordered_by_their_number_by_default()
    {
        $episodeSecond = create(Episode::class, [
            'number' => $this->episode->number - 1,
            'season_id' => $this->episode->season_id,
        ]);

        $episodes = Episode::all();

        $this->assertEquals(
            $episodeSecond->id,
            $episodes[0]->id
        );
        $this->assertEquals(
            $this->episode->id,
            $episodes[1]->id
        );
    }
}
