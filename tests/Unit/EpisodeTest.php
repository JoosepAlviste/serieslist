<?php

namespace Tests\Unit;

use App\Models\Episode;
use App\Models\Season;
use App\Models\SeenEpisode;
use App\Models\Series;
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
        $this->signIn();

        $this->episode->toggleSeen();

        $this->assertDatabaseHas('seen_episodes', [
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
}
