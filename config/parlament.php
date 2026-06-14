<?php

return [
    // Uključuje/isključuje ceo parlament feature (rute, carousel, navbar link).
    // Postavi PRIKAZI_PARLAMENT=TRUE u .env da bude vidljiv.
    'prikazi' => filter_var(env('PRIKAZI_PARLAMENT', false), FILTER_VALIDATE_BOOLEAN),
];
