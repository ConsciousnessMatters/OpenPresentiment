<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Type;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class SetupController extends Controller
{
    public function show(Request $request)
    {
        return view('mylab.setup', [
            'bodyClass' => 'mylab setup',
        ]);
    }

    public function importImages(Request $request)
    {
        $imagesOnFilesystem = $this->getRelativeImagePathPools();
        $imagesOnDatabase = Image::get();
        $types = Type::get();
        $peacefulTypeId = $types->where('name', 'Peaceful')->first()->id ?? null;
        $emotionalTypeId = $types->where('name', 'Emotional')->first()->id ?? null;
        $imageFilenamesOnDatabase = $imagesOnDatabase->pluck('path');
        $alreadyRegistered = 0;
        $imagesRegistered = 0;
        $errors = 0;

        // ToDo: Look into Laravel batch inserts using models. This method is quick but heavy on DB.
        foreach ($imagesOnFilesystem as $type => $imagesOnFilesystemByType) {
            foreach ($imagesOnFilesystemByType as $imageOnFilesystem) {
                if ($imageFilenamesOnDatabase->contains($imageOnFilesystem)) {
                    $alreadyRegistered++;
                } else {
                    $image = new Image();
                    $image->type_id = $type === 'emotional' ? $emotionalTypeId : $peacefulTypeId;
                    $image->path = $imageOnFilesystem;
                    if ($image->save()) {
                        $imagesRegistered++;
                    } else {
                        $errors++;
                    }
                }
            }
        }

        $imagesNowOnDatabase = Image::get();
        $imagesNowOnDatabaseByPath = $imagesNowOnDatabase->pluck('path');

        // ToDo: Implement success testing and reporting.
        return response()->json([
            'imagesInDb' => $imagesNowOnDatabaseByPath,
        ]);
    }

    protected function getRelativeImagePathPools(): array
    {
        $blankPublicPath = public_path('');
        $rawPathImagePool = [
            'emotional' => glob(public_path('images/emotional_images/') . '*.{jpg,jpeg,png}', GLOB_BRACE),
            'peaceful' => glob(public_path('images/peaceful_images/') . '*.{jpg,jpeg,png}', GLOB_BRACE),
        ];

        $relativePathImagePool = [];

        foreach ($rawPathImagePool as $type => $pool) {
            foreach ($pool as $rawImagePath) {
                $relativePathImagePool[$type][] = str_replace($blankPublicPath, '', $rawImagePath);
            }
        }

        return $relativePathImagePool;
    }
}
