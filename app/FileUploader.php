<?php

namespace App;

use Illuminate\Http\Request;
use Intervention\Image\ImageManager;

class FileUploader
{
    /** @var ImageManager */
    private $image;

    /**
     * FileUploader constructor.
     *
     * @param ImageManager $image
     */
    public function __construct(ImageManager $image)
    {
        $this->image = $image;
    }

    /**
     * Store the poster for a series from the request. Stores two versions of
     * the image - a large one and a small one. Will return three paths, one
     * for each file size and the standard filename without size postfix or file
     * extension.
     *
     * @param Request $request
     *
     * @return string[]
     */
    public function storeSeriesPoster($request)
    {
        $file = $this->image->make($request->file('poster'));
        $path = storage_path('app/public/posters') . '/';
        $filenameHash = md5($request->file('poster')->hashName() . microtime());
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
