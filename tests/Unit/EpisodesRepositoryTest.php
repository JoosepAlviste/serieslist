<?php

namespace Tests\Unit;

use App\Repositories\EpisodesRepository;
use App\Models\Episode;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class EpisodesRepositoryTest extends TestCase
{
    use DatabaseMigrations;

    /** @var EpisodesRepository */
    protected $episodesRepository;
    /** @var Episode */
    protected $testEpisode;

    public function setUp()
    {
        parent::setUp();

        $this->episodesRepository = app()->make(EpisodesRepository::class);
        $this->testEpisode = create(Episode::class, ['title' => 'test'])->fresh();
    }

    /** @test */
    function it_finds_episodes_by_search_query()
    {
        create(Episode::class, ['title' => 'other']);

        $results = $this->episodesRepository->search('test');

        $this->assertCount(1, $results);
        $this->assertEquals($this->testEpisode, $results->first());
    }

    /** @test */
    function it_finds_episodes_by_search_query_with_limit()
    {
        create(Episode::class, ['title' => 'test some other']);

        $results = $this->episodesRepository->search('test', 1);

        $this->assertCount(1, $results);
        $this->assertEquals($this->testEpisode, $results->first());
    }

    /** @test */
    function it_finds_episodes_by_search_query_and_paginates()
    {
        create(Episode::class, ['title' => 'test some other']);

        $results = $this->episodesRepository->searchPaginate('test', 1);

        $this->assertCount(1, $results);
        $this->assertEquals($this->testEpisode, $results->first());
    }
}