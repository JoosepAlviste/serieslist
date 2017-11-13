<?php

namespace Tests\Feature;

use App\FileUploader;
use App\Models\Series;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Intervention\Image\Image;
use Tests\TestCase;
use \Mockery as M;

class AdministrateSeriesTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function an_admin_user_can_create_a_series()
    {
        $this->signInAdmin();

        $series = make(Series::class);
        $this->post('/series', $series->toArray());

        $this->assertDatabaseHas('series', $series->toArray());
    }

    /** @test */
    public function a_user_who_is_not_an_admin_may_not_create_a_series()
    {
        $this->withExceptionHandling()
             ->signIn();

        $series = make(Series::class);
        $this->post('/series', $series->toArray())
             ->assertStatus(403);

        $this->assertDatabaseMissing('series', $series->toArray());
    }

    /** @test * */
    public function an_admin_user_can_see_series_create_form()
    {
        $this->signInAdmin();

        $status = $this->get('/series/create');

        $status->assertStatus(200)
               ->assertSee('Create a new series');
    }

    /** @test * */
    public function a_user_who_is_not_an_admin_may_not_see_the_create_series_form()
    {
        $this->withExceptionHandling()
             ->signIn();

        $this->get('/series/create')
             ->assertStatus(403);
    }

    /** @test */
    public function a_series_requires_a_title()
    {
        $this->createSeries(['title' => null])
             ->assertSessionHasErrors('title');
    }

    /** @test */
    public function a_series_requires_a_description()
    {
        $this->createSeries(['description' => null])
             ->assertSessionHasErrors('description');
    }

    /** @test */
    public function a_series_requires_a_numeric_start_year()
    {
        $this->createSeries(['start_year' => null])
             ->assertSessionHasErrors('start_year');

        $this->createSeries(['start_year' => 'testing'])
             ->assertSessionHasErrors('start_year');
    }

    /** @test */
    public function a_series_can_have_a_numeric_end_year()
    {
        $this->createSeries(['end_year' => 'testing'])
             ->assertSessionHasErrors('end_year');
    }

    /** @test */
    function an_admin_user_can_update_a_series()
    {
        $this->signInAdmin();

        $savedSeries = create(Series::class);

        $updatedSeries = make(Series::class, [
            'title'       => 'Test title',
            'description' => 'Test description',
        ]);

        $this->put("/series/{$savedSeries->id}", $updatedSeries->toArray());

        $this->assertEquals('Test title', $savedSeries->fresh()->title);
        $this->assertEquals('Test description', $savedSeries->fresh()->description);
    }

    /** @test */
    function a_user_who_is_not_an_admin_may_not_update_a_series()
    {
        $this->withExceptionHandling()
             ->signIn();

        $savedSeries = create(Series::class, [
            'title'       => 'Actual title',
            'description' => 'Actual description',
        ]);

        $updatedSeries = make(Series::class);

        $this->put("/series/{$savedSeries->id}", $updatedSeries->toArray())
             ->assertStatus(403);

        $this->assertEquals('Actual title', $savedSeries->fresh()->title);
        $this->assertEquals('Actual description', $savedSeries->fresh()->description);
    }

    /** @test */
    function an_admin_user_can_see_the_series_edit_form()
    {
        $this->signInAdmin();

        $series = create(Series::class);

        $response = $this->get("/series/{$series->id}/edit");

        $response->assertStatus(200);
        $response->assertSee($series->title);
        $response->assertSee($series->description);
    }

    /** @test * */
    function a_user_who_is_not_an_admin_may_not_see_the_edit_series_form()
    {
        $this->withExceptionHandling()
             ->signIn();

        $series = create(Series::class);

        $this->get("/series/{$series->id}/edit")
             ->assertStatus(403);
    }

    /** @test */
    function an_admin_user_can_delete_a_series()
    {
        $this->signInAdmin();

        $series = create(Series::class);

        $this->delete($series->path())
             ->assertRedirect('/series');

        $this->assertDatabaseMissing('series', ['id' => $series->id]);
    }

    /** @test */
    function a_user_who_is_not_an_admin_may_not_delete_a_series()
    {
        $this->signIn()
             ->withExceptionHandling();

        $series = create(Series::class);

        $this->delete($series->path())
             ->assertStatus(403);

        $this->assertDatabaseHas('series', ['id' => $series->id]);
    }

    /** @test */
    function a_series_can_have_a_poster()
    {
        $mockFileUploader = M::mock(FileUploader::class)
            ->shouldReceive('storeSeriesPoster')
            ->andReturn(['filename' => 'chicken'])
            ->getMock();
        $this->app->instance(FileUploader::class, $mockFileUploader);

        $this->createSeries([
            'poster' => $file = UploadedFile::fake()->image('poster.jpg'),
        ]);
        $series = Series::first();

        $this->assertEquals('chicken', $series->poster);
    }

    /** @test */
    function a_poster_has_to_be_a_file()
    {
        $mockFileUploader = M::mock(FileUploader::class)
             ->shouldNotReceive('storeSeriesPoster')
             ->getMock();
        $this->app->instance(FileUploader::class, $mockFileUploader);

        $response = $this->createSeries([
            'poster' => 'test',
        ]);

        $response->assertSessionHasErrors('poster');
    }

    /** @test */
    function a_poster_has_to_be_an_image()
    {
        $mockFileUploader = M::mock(FileUploader::class)
             ->shouldNotReceive('storeSeriesPoster')
             ->getMock();
        $this->app->instance(FileUploader::class, $mockFileUploader);

        $response = $this->createSeries([
            'poster' => $file = UploadedFile::fake()->create('poster.pdf'),
        ]);

        $response->assertSessionHasErrors('poster');
    }

    /** @test */
    function a_series_poster_can_be_updated()
    {
        $mockFileUploader = M::mock(FileUploader::class)
                             ->shouldReceive('storeSeriesPoster')
                             ->andReturn(['filename' => 'chicken'])
                             ->getMock();
        $this->app->instance(FileUploader::class, $mockFileUploader);

        $this->updateSeries([
            'poster' => $file = UploadedFile::fake()->image('poster.jpg'),
        ]);
        $series = Series::first();

        $this->assertEquals('chicken', $series->poster);
    }

    /** @test */
    function while_updating_a_poster_it_has_to_be_an_image()
    {
        $mockFileUploader = M::mock(FileUploader::class)
                             ->shouldNotReceive('storeSeriesPoster')
                             ->getMock();
        $this->app->instance(FileUploader::class, $mockFileUploader);

        $response = $this->updateSeries([
            'poster' => $file = UploadedFile::fake()->create('poster.pdf'),
        ]);

        $response->assertSessionHasErrors('poster');
    }

    protected function createSeries($overrides = [])
    {
        $this->withExceptionHandling()
             ->signInAdmin();
        $series = make(Series::class, $overrides);

        return $this->post('/series', $series->toArray());
    }

    protected function updateSeries($updates, $originalOverrides = [])
    {
        $this->withExceptionHandling()
             ->signInAdmin();
        $series = create(Series::class, $originalOverrides);

        $params = array_merge($series->toArray(), $updates);

        return $this->put("/series/{$series->id}", $params);
    }
}
