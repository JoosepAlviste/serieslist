<?php

namespace Tests\Unit;

use App\Models\Episode;
use App\Models\SeenEpisode;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeenEpisodeTest extends TestCase
{
    use DatabaseMigrations;

    /** @var SeenEpisode */
    protected $seenEpisode;

    public function setUp()
    {
        parent::setUp();

        $this->seenEpisode = create(SeenEpisode::class);
    }

    /** @test */
    function it_has_a_reference_to_an_episode()
    {
        $this->assertInstanceOf(Episode::class, $this->seenEpisode->episode);
    }

    /** @test */
    function it_has_a_reference_to_the_user_who_has_seen_the_episode()
    {
        $this->assertInstanceOf(User::class, $this->seenEpisode->user);
    }
}
