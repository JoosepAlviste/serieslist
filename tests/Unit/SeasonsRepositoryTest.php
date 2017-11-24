<?php

namespace Tests\Unit;

use App\Http\Repositories\SeasonsRepository;
use App\Models\Episode;
use App\Models\Season;
use App\Models\SeenEpisode;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class SeasonsRepositoryTest extends TestCase
{
    use DatabaseMigrations;

    /** @var SeasonsRepository */
    protected $seasonsRepository;

    public function setUp()
    {
        parent::setUp();

        $this->seasonsRepository = app()->make(SeasonsRepository::class);
    }

    /** @test */
    function it_fetches_season_by_series_and_season_number()
    {
        $season = create(Season::class)->fresh();

        $result = $this->seasonsRepository->fetch($season->series_id, $season->number);

        $this->assertEquals($season->id, $result->id);
    }

    /** @test */
    function it_eager_loads_series_while_fetching()
    {
        $season = create(Season::class)->fresh();

        $result = $this->seasonsRepository->fetch($season->series_id, $season->number);

        $this->assertEquals($season->series_id, $result->toArray()['series']['id']);
    }

    /** @test */
    function it_eager_loads_episodes_while_fetching()
    {
        $episode = create(Episode::class);
        $season = $episode->season;

        $result = $this->seasonsRepository->fetch($season->series_id, $season->number);

        $this->assertEquals($episode->id, $result->toArray()['episodes'][0]['id']);
    }

    /** @test */
    function it_eager_loads_seen_episodes_by_the_authenticated_user_while_fetching()
    {
        $this->signIn();

        $seenEpisode = create(SeenEpisode::class, ['user_id' => auth()->id()]);
        $season = $seenEpisode->episode->season;

        $result = $this->seasonsRepository->fetch($season->series_id, $season->number);

        $this->assertEquals(
            $seenEpisode->id,
            $result->toArray()['episodes'][0]['seen_episodes'][0]['id']
        );
    }
}
