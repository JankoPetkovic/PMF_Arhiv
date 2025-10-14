<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title>Izveštaj Departmana</title>
        <style>
            body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
            .departman { margin-top: 15px; font-weight: bold; }
            .nivo { margin-left: 15px; font-style: italic; margin-top: 5px; }
            .smer { margin-left: 30px; margin-top: 3px; }
            .godina { margin-left: 45px; margin-top: 2px; font-weight: bold; }
            .predmet { margin-left: 60px; }
        </style>
    </head>
    <body>
        <h1>Izveštaj departmana</h1>

        @foreach($departmani as $departman)
            <div class="departman">Departman: {{ $departman['naziv'] }}</div>

            @foreach($departman['smerovi'] as $nivo => $smerovi)
                <div class="nivo">Nivo studija: {{ $nivo }}</div>

                @foreach($smerovi as $smer)
                    <div class="smer">Smer: {{ $smer['naziv'] }}</div>

                    @foreach($smer['predmeti'] as $godina => $predmeti)
                        <div class="godina">{{ $godina }}. godina</div>

                        @foreach($predmeti as $predmet)
                            <div class="predmet">• {{ $predmet->naziv }}</div>
                        @endforeach
                    @endforeach
                @endforeach
            @endforeach
        @endforeach
    </body>
</html>
