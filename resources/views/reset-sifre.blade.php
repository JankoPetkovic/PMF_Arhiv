<!DOCTYPE html>
<html>
<body>
    <h2>Zdravo {{ $mejl }},</h2>
    <p>Primili smo zahtev za resetovanje šifre vašeg naloga.</p>
    <p>Kliknite na dugme ispod da postavite novu šifru:</p>
    <a href="{{ $resetUrl }}" style="padding:10px 20px;background-color:blue;color:white;text-decoration:none;">
        Resetuj šifru
    </a>
    <p>Link važi 60 minuta.</p>
    <p>Ako niste tražili resetovanje šifre, ignorišite ovaj email.</p>
</body>
</html>
