<?php

namespace App\Http\Controllers;

use App\Http\Resources\InProgressSeries;
use App\Models\Episode;
use App\Models\Season;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

class SeenEpisodesController extends Controller
{
    /**
     * Toggle an episode's seen status for the authenticated user. Also should
     * update the SeriesProgress for that series and user.
     *
     * @param Episode $episode
     *
     * @return InProgressSeries|Episode|RedirectResponse|Redirector
     */
    public function toggle(Episode $episode)
    {
        $episode->toggleSeen(auth()->id());
        $episode = $episode->fresh();

        $series = $episode->season->series;
        if ($episode->isSeen) {
            $nextEpisode = $episode->nextEpisode();
            if ($nextEpisode) {
                $series->setProgress($episode->id, $episode->nextEpisode()->id);
            } else {
                $series->setProgress($episode->id);
            }
        } else {
            $previousEpisode = $episode->previousEpisode();
            $nextEpisode = $episode;

            if ($previousEpisode) {
                $series->setProgress($previousEpisode->id, $episode->id);
            } else {
                $series->deleteProgress();
            }
        }

        if (request()->expectsJson()) {
            $seenEpisode = new \StdClass;
            $seenEpisode->series_id = $episode->season->series_id;
            $seenEpisode->series_title = $episode->season->series->title;
            $seenEpisode->episode_id = $episode->id;
            $seenEpisode->shortSlug = $episode->shortSlug();

            if ($nextEpisode) {
                $seenEpisode->next_episode_id = $nextEpisode->id;
            } else {
                $seenEpisode->next_episode_id = null;
            }

            return new InProgressSeries($seenEpisode);
        }

        return redirect($episode->path());
    }

    /**
     * Mark all episodes in the season as seen. Also updates the series progress
     * for the relevant series.
     *
     * @param Season $season
     *
     * @return RedirectResponse|Redirector
     */
    public function markSeasonAsSeen(Season $season)
    {
        $series = $season->series;
        foreach ($season->episodes as $episode) {
            $episode->markAsSeen();
        }

        /** @var Episode $lastEpisode */
        $lastEpisode = $season->episodes->last();
        if ($nextEpisode = $lastEpisode->nextEpisode()) {
            $series->setProgress($lastEpisode->id, $nextEpisode->id);
        } else {
            $series->setProgress($lastEpisode->id);
        }

        return redirect($season->path());
    }
}
