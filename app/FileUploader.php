<?php

namespace App;

use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;

class FileUploader
{
    /**
     * @param Request $request
     *
     * @return array
     */
    public function storeSeriesPoster($request)
    {
        $file          = Image::make($request->file('poster'));
        $path          = storage_path('app/public/posters') . '/';
        $filenameHash  = md5($request->file('poster')->hashName() . microtime());
        $largeFilename = $filenameHash . '-poster-large.png';
        $smallFilename = $filenameHash . '-poster-small.png';

        $file->encode('png')
             ->resize(666, 1000)
             ->save($path . $largeFilename)
             ->resize(182, 268)
             ->save($path . $smallFilename);

        return [
            'largeFilename' => $largeFilename,
            'smallFilename' => $smallFilename,
            'filename' => $filenameHash,
        ];
    }
}
