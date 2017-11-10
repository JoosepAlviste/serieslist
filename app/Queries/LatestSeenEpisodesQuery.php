<?php

namespace App\Queries;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Class LatestSeenEpisodesQuery.
 *
 * @package App\Queries
 */
class LatestSeenEpisodesQuery
{
    /**
     * @var array
     */
    private $params;
    /**
     * @var string
     */
    private $query = <<<EOT
        SELECT
          series.id AS series_id,
          series.title AS series_title,
          episodes.id AS episode_id,
          seasons.id AS season_id,
          seasons.number AS season_number,
          episodes.number AS episode_number
        FROM
          episodes
        INNER JOIN
          seasons
        ON
          seasons.id = episodes.season_id
        INNER JOIN
          series
        ON
          seasons.series_id = series.id
        WHERE
          ROW(series.id, episodes.id)
          = (


            SELECT
              ser.id AS series_id,
              E.id AS episode_id
            FROM
              seen_episodes SE
            INNER JOIN
              episodes E
            ON
              SE.episode_id=E.id
            INNER JOIN
              seasons S
            ON
              S.id=E.season_id
            INNER JOIN
              series ser
            ON
              S.series_id=ser.id
              
            WHERE NOT EXISTS (
              SELECT 1
              FROM episodes inner_e
              INNER JOIN seen_episodes inner_se
              ON inner_e.id = inner_se.episode_id
              INNER JOIN seasons inner_s
              ON inner_s.id = inner_e.season_id
              WHERE
              (
                inner_e.number = E.number + 1
                AND 
                inner_s.id = S.id
              )
              OR
              (
                inner_e.number = 1
                AND
                inner_s.number = S.number + 1
                AND
                inner_s.series_id = S.series_id
              )
            )

            AND
              SE.user_id = ?
            AND
              ser.id = series.id
              
            ORDER BY S.number ASC, E.number ASC

            LIMIT 1

          )

        ORDER BY series.title ASC
          
        ;
EOT;

    /**
     * LatestSeenEpisodesQuery constructor.
     *
     * @param array $params
     */
    public function __construct($params = [])
    {
        $this->params = $params;
    }

    /**
     * Execute the query.
     *
     * @return Collection
     */
    public function execute()
    {
        $results = DB::select($this->query, $this->params);

        return Collection::make($results);
    }
}
