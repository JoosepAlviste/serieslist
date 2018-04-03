<?php

namespace Tests\Unit;

use App\Models\Episode;
use App\Models\Season;
use App\Models\SeenEpisode;
use App\Models\Series;
use App\Models\SeriesProgress;
use App\Models\User;
use Illuminate\Support\Collection;
use Tests\Concerns\CreatesEpisodes;
use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class SeriesTest extends TestCase
{
    use DatabaseMigrations, CreatesEpisodes;

    /** @var Series */
    protected $series;

    public function setUp()
    {
        parent::setUp();

        $this->series = create(Series::class);
    }

    /** @test */
    function a_series_has_seasons()
    {
        $season = create(Season::class, ['series_id' => $this->series->id]);

        $this->assertTrue($this->series->seasons->contains($season));
    }

    /** @test */
    function a_series_can_make_a_string_path()
    {
        $this->assertEquals("/series/{$this->series->id}", $this->series->path());
    }

    /** @test */
    function a_series_can_add_a_season()
    {
        $season = make(Season::class, [
            'series_id' => null,
        ])->toArray();

        $this->series->addSeason($season);

        $this->assertDatabaseHas('seasons', [
            'series_id' => $this->series->id,
            'number' => $season['number'],
        ]);
    }

    /** @test */
    function it_deletes_all_its_seasons_on_deletion()
    {
        create(Season::class, ['series_id' => $this->series->id], 5);

        $this->series->delete();

        $this->assertDatabaseMissing('seasons', [
            'series_id' => $this->series->id,
        ]);
    }

    /** @test */
    function it_deletes_all_its_episodes_on_deletion()
    {
        $seasons = create(Season::class, ['series_id' => $this->series->id], 3);
        $seasons->each(function ($season) {
            create(Episode::class, ['season_id' => $season->id], 3);
        });

        $this->series->delete();

        $seasons->each(function ($season) {
            $this->assertDatabaseMissing('episodes', [
                'season_id' => $season->id,
            ]);
        });
    }

    /** @test */
    function it_knows_the_newest_episode_a_user_has_watched()
    {
        $user = create(User::class);
        $series = create(Series::class);
        /** @var Collection|Episode[] $episodes */
        create(Episode::class, [
            'season_id' => create(Season::class, ['series_id' => $series->id])
        ], 5);
        $episodes = Episode::all();
        $episodes = $episodes->chunk(3);

        $episodes->first()->each(function ($episode) use ($user) {
            $episode->toggleSeen($user->id);
        });

        $latestSeen = $series->latestSeenEpisode($user->id);

        $this->assertEquals($episodes->first()->last()->id, $latestSeen->id);
    }

    /** @test */
    function it_can_be_searched_for_by_its_title_or_description()
    {
        $series    = create(Series::class, [
            'title' => 'Test title',
        ]);
        $seriesTwo = create(Series::class, [
            'title' => 'Not searchable title',
        ]);

        $query = 'test t';

        $foundSeries = Series::search($query)
                             ->get();

        $this->assertTrue($foundSeries->contains('id', $series->id));
        $this->assertFalse($foundSeries->contains('id', $seriesTwo->id));
    }

    /** @test */
    function it_has_a_progress_for_a_user()
    {
        $seriesProgress = $this->createSeriesProgress();

        $this->assertEquals(
            $this->series->id,
            $this->series->progress($seriesProgress->user_id)->series_id
        );
    }

    /** @test */
    function it_returns_no_progress_when_there_is_none()
    {
        $this->assertEquals(null, $this->series->progress(1));
    }

    /** @test */
    function it_can_set_a_new_progress_for_a_user()
    {
        $this->signIn();

        $episodes = $this->createSubsequentEpisodes($this->series);

        $this->series->setProgress(
            $episodes[0]->id,
            $episodes[1]->id,
            auth()->id()
        );

        $this->assertDatabaseHas('series_progresses', [
            'user_id' => auth()->id(),
            'series_id' => $episodes[0]->season->series_id,
            'latest_seen_episode_id' => $episodes[0]->id,
            'next_episode_id' => $episodes[1]->id,
        ]);
    }

    /** @test */
    function it_can_update_the_progress_of_a_user()
    {
        $this->signIn();

        $episodes = $this->createSubsequentEpisodes($this->series, 3);
        $progress = $this->createSeriesProgress($episodes);

        $this->series->setProgress(
            $episodes[1]->id,
            $episodes[2]->id,
            auth()->id()
        );

        $progress = $progress->fresh();

        $this->assertEquals($episodes[1]->id, $progress->latest_seen_episode_id);
        $this->assertEquals($episodes[2]->id, $progress->next_episode_id);
    }

    /** @test */
    function it_can_delete_a_users_progress()
    {
        /** @var Series $series */
        $series = create(Series::class);
        $episodes = $this->createSubsequentEpisodes($series, 1);
        /** @var SeriesProgress $progress */
        $progress = create(SeriesProgress::class, [
            'series_id' => $series->id,
            'latest_seen_episode_id' => $episodes[0]->id,
        ]);

        $progress->series->deleteProgress($progress->user_id);

        $this->assertDatabaseMissing('series_progresses', [
            'user_id' => $progress->user_id,
            'series_id' => $progress->series_id,
        ]);
    }

    /**
     * @param Episode[]|Collection $episodes
     *
     * @return SeriesProgress
     */
    private function createSeriesProgress($episodes = null)
    {
        $episodes = $episodes ?: $this->createSubsequentEpisodes($this->series);

        if (auth()->id()) {
            /** @var SeriesProgress $seriesProgress */
            $seriesProgress = create(SeriesProgress::class, [
                'user_id' => auth()->id(),
                'series_id' => $this->series->id,
                'latest_seen_episode_id' => $episodes[0]->id,
                'next_episode_id' => $episodes[1]->id,
            ]);
        } else {
            $seriesProgress = create(SeriesProgress::class, [
                'series_id' => $this->series->id,
                'latest_seen_episode_id' => $episodes[0]->id,
                'next_episode_id' => $episodes[1]->id,
            ]);
        }

        return $seriesProgress;
    }
}
