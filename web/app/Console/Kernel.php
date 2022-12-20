<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\DB;
use Mockery\Undefined;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $result = DB::table('games')->select('id')->orderByDesc('id')->first();
            $error = true;
            while ($error) {
                $error = false;
                $randomGame = rand(0, $result->id);
                $result = DB::table('games')->where('id', $randomGame)->first();
                if ($result == null) {
                    $error = true;
                }
            }

            DB::table('daily_games')->insert(
                array(
                    'category' => $result->category,
                    'difficulty' => $result->difficulty,
                    'JSONQuestions' => $result->JSONQuestions,
                    'play_count' => $result->play_count,
                    'created_at' => date('Y-m-d H:i:s')
                )
            );
        })->everyMinute();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}