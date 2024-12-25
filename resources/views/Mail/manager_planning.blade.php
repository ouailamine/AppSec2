<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau Planning Disponible</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
            color: #000;
        }

        .container {
            background-color: #fff;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #000;
            font-size: 1.6em;
            text-align: center;
            margin-bottom: 20px;
        }

        p {
            font-size: 1em;
            color: #000;
            line-height: 1.6;
            margin-bottom: 20px;
        }

        .signature {
            margin-top: 30px;
            font-weight: bold;
            text-align: center;
            font-size: 0.95em;
        }

        .footer {
            margin-top: 40px;
            font-size: 0.85em;
            color: #777;
            text-align: center;
        }

        .company-info {
            margin-top: 30px;
            font-size: 0.9em;
            color: #555;
            text-align: left;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }

        .company-info p {
            margin: 0;
        }

        .logo {
            width: 80px;
            margin-right: 20px;
        }

        .highlight {
            font-weight: bold;
            color: #000;
        }

        @media (max-width: 600px) {
            .container {
                padding: 15px;
            }

            .logo {
                width: 60px;
            }

            .company-info {
                flex-direction: column;
                align-items: center;
            }

            .logo {
                margin-right: 0;
                margin-bottom: 10px;
            }
        }
    </style>
</head>

<body>
    <div class="container">

        @foreach ($siteDetails as $siteId => $details)
            <h1>Bonjour Mr/Mme {{ $details['manager_name'] }},</h1>

            @if ($isValidatePlanning == 1)
                <p>Il y a eu des changements dans le planning pour le mois de <span
                        class="highlight">{{ $monthNames[0] }} {{ $year }}</span>. Il est désormais disponible
                    dans votre espace personnel.</p>
            @else
                <p>Nous avons le plaisir de vous informer que le planning pour le mois de <span
                        class="highlight">{{ $monthNames[0] }} {{ $year }}</span> est désormais disponible dans
                    votre espace personnel.</p>
            @endif
        @endforeach

        <p>Nous vous invitons à consulter votre espace afin de prendre connaissance des détails du planning et de vous
            organiser en conséquence.</p>

        <div class="signature">
            <p>Nous vous remercions de votre confiance.</p>
            <p>Cordialement,</p>
            <p><strong>L'équipe de gestion des plannings</strong></p>
        </div>

        <div class="footer">
            <p>Ce message est généré automatiquement. Merci de ne pas y répondre.</p>
        </div>

        <div class="company-info">
            <img src="{{ asset('assets/img/logo-atalix.png') }}" alt="Logo de l'entreprise" class="logo">
            <div>
                <p><strong>Atalix Sécurité</strong><br>
                    123 Rue de l'Entreprise, Paris, France<br>
                    Téléphone: +33 1 23 45 67 89<br>
                    Email: <a href="mailto:contact@atalix.com">contact@atalix.com</a>
                </p>
            </div>
        </div>
    </div>
</body>

</html>
