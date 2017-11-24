<?php

namespace Tests\Unit;

use App\Repositories\SeriesRepository;
use App\Models\Series;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class SeriesRepositoryTest extends TestCase
{
    use DatabaseMigrations;

    /** @var SeriesRepository */
    protected $seriesRepository;
    /** @var Series */
    protected $testSeries;

    public function setUp()
    {
        parent::setUp();

        $this->seriesRepository = app()->make(SeriesRepository::class);
        $this->testSeries = create(Series::class, ['title' => 'test'])->fresh();
    }

    /** @test */
    function it_finds_series_by_search_query()
    {
        create(Series::class, ['title' => 'other']);

        $results = $this->seriesRepository->search('test');

        $this->assertCount(1, $results);
        $this->assertEquals($this->testSeries, $results->first());
    }

    /** @test */
    function it_finds_series_by_search_query_with_limit()
    {
        create(Series::class, ['title' => 'test some other']);

        $results = $this->seriesRepository->search('test', 1);

        $this->assertCount(1, $results);
        $this->assertEquals($this->testSeries, $results->first());
    }

    /** @test */
    function it_finds_series_by_search_query_and_paginates()
    {
        create(Series::class, ['title' => 'test some other']);

        $results = $this->seriesRepository->searchPaginate('test', 1);

        $this->assertCount(1, $results);
        $this->assertEquals($this->testSeries, $results->first());
    }

    /** @test */
    function it_paginates_series()
    {
        create(Series::class, ['title' => 'test some other']);

        $results = $this->seriesRepository->paginate(1);

        $this->assertCount(1, $results);
        $this->assertEquals($this->testSeries, $results->first());
    }
}
