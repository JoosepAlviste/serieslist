<?php

namespace Tests\Unit;

use App\Models\Episode;
use App\Models\Season;
use App\Models\SeenEpisode;
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

        $this->assertFalse($this->episode->isSeen());

        create(SeenEpisode::class, ['user_id' => auth()->id(), 'episode_id' => $this->episode->id]);

        $this->assertTrue($this->episode->isSeen());
    }
}
