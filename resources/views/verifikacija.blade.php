<!DOCTYPE html>
<html>
<body>
    <h2>Zdravo {{ $ime }},</h2>
    <p>Potvrdite svoj mejl klikom na dugme ispod:</p>
    <a href="{{ $verifikacijaUrl }}" style="padding:10px 20px;background-color:blue;color:white;text-decoration:none;">
        Verifikuj mejl
    </a>
    <p>Link važi 10 minuta.</p>
</body>
</html>
    