<?php

namespace App\Http\Requests;

use App\Models\Series;
use Illuminate\Foundation\Http\FormRequest;

class StoreSeries extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'required',
            'description' => 'required',
            'start_year' => 'required|numeric',
            'end_year' => 'nullable|numeric',
            'poster' => 'nullable|file|image',
        ];
    }

    public function getInstance($series = null)
    {
        $series              = $series ?: new Series;
        $series->title       = $this->get('title');
        $series->description = $this->get('description');
        $series->start_year  = $this->get('start_year');
        $series->end_year    = $this->get('end_year');

        return $series;
    }
}
