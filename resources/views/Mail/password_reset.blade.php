<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mot de Passe Provisoire</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            background-color: #f9fafb;
            padding: 20px;
            margin: 0;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            max-width: 600px;
            margin: 50px auto;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            border: 1px solid #e5e7eb;
        }
        h1 {
            font-size: 22px;
            color: #1f2937;
            margin-bottom: 15px;
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            color: #4b5563;
        }
        ul {
            margin: 15px 0;
            padding-left: 20px;
            color: #4b5563;
        }
        li {
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            background-color: #2563eb;
            color: #ffffff;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            transition: background-color 0.3s ease;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #1e40af;
        }
        .footer {
            font-size: 14px;
            color: #9ca3af;
            text-align: center;
            margin-top: 30px;
        }
        .footer a {
            color: #2563eb;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bonjour Mme/Mr {{ $person->manager_name }},</h1>
        <p>Nous vous envoyons votre mot de passe provisoire afin que vous puissiez accéder à votre compte.</p>

        <p><strong>Votre mot de passe provisoire est :</strong> {{ $temporaryPassword }}</p>

        <p>Nous vous conseillons de le changer immédiatement après votre première connexion. Voici les étapes à suivre :</p>
        <ul>
            <li>Connectez-vous avec le mot de passe provisoire ci-dessus.</li>
            <li>Accédez à vos paramètres de compte.</li>
            <li>Changez votre mot de passe en choisissant une nouvelle combinaison sécurisée.</li>
        </ul>

        <a href="#" class="button">Accéder à mon compte</a>

        <div class="footer">
            <p>Si vous avez des questions, n'hésitez pas à nous contacter à l'adresse suivante : <a href="mailto:support@example.com">support@example.com</a></p>
            <p>Merci, L'équipe de Atalix Sécurité</p>
        </div>
    </div>
</body>
</html>
