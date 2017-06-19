<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        create(\App\Models\User::class, [
            'email' => 'admin@email.ee',
            'name' => 'Admin',
            'is_admin' => true,
        ]);
    }
}
