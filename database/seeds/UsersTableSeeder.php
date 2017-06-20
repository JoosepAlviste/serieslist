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
        \App\Models\User::create([
            'email' => 'admin@email.ee',
            'name' => 'Admin',
            'is_admin' => true,
            'password' => bcrypt(env('ADMIN_PASS', 'secret')),
        ]);
    }
}
