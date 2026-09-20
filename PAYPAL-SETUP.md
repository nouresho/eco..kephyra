# Activer PayPal — ECO KEPHYRA

Le code est intégré au formulaire existant. Le prix est recalculé côté serveur en MAD selon la durée, puis converti en EUR avec le taux quotidien Frankfurter. Le client voit le montant EUR exact avant de partir sur PayPal. Le paiement couvre la location complète. Aucun changement de vos tarifs MAD.

## 1. Supabase : indispensable

Ouvrir SQL Editor → New query. Copier tout `supabase/migrations/003_paypal_payments.sql` et cliquer Run, une seule fois. Cette migration nécessite la migration admin `001_admin_and_capacity.sql` déjà installée. Si le contrôle initial indique qu'elle manque, installer d'abord cette migration admin ; ne pas supprimer ce contrôle. Aucune clé n'est incluse dans le SQL.

Cette étape n'est PAS exécutée automatiquement par le build ou le déploiement Vercel. Installer le SQL avant de déployer le nouveau code : les disponibilités et réservations utilisent désormais la libération des paiements expirés.

## 2. Variables dans .env.local et Vercel

Conserver les variables Supabase existantes. Ajouter/vérifier ces noms exacts, sans crochets ni liens Markdown :

```dotenv
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_SANDBOX_SECRET
PAYPAL_ENV=sandbox
ADMIN_APP_ORIGIN=http://localhost:3000
PAYPAL_WEBHOOK_ID=YOUR_WEBHOOK_ID
CRON_SECRET=YOUR_RANDOM_LONG_SECRET
```

Sur Vercel, `ADMIN_APP_ORIGIN` doit être l'origine HTTPS exacte du site, sans chemin. Redémarrer le serveur local après toute modification des variables ; redéployer après une modification sur Vercel. Ne jamais committer .env.local ni donner le préfixe NEXT_PUBLIC_ au secret PayPal, au secret CRON ou à la clé Supabase de service.

## 3. Webhook PayPal

Dans PayPal Developer → Apps & Credentials → Sandbox → votre application → Webhooks → Add webhook :

URL : `https://VOTRE-DOMAINE/api/paypal/webhook`

Événements : `CHECKOUT.ORDER.APPROVED`, `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.PENDING`, `PAYMENT.CAPTURE.DENIED`.

Copier l'ID du webhook dans PAYPAL_WEBHOOK_ID, puis redéployer. Le webhook vérifie la signature auprès de PayPal et relit l'état du paiement. Il permet de confirmer un paiement même si le client ferme la page. Localhost ne reçoit pas les webhooks publics : le retour navigateur permet un premier test local, mais tester également le webhook sur votre domaine HTTPS avant le lancement.

## 4. Tester en Sandbox

Choisir des dates disponibles, remplir le formulaire, sélectionner PayPal et cliquer Continue. Vérifier le montant MAD et EUR. Payer avec un compte Sandbox Personal distinct du compte Sandbox Business de l'application. Après retour, vérifier la référence et l'état confirmed/paid dans Supabase/admin. Aucun argent réel en Sandbox.

Tester aussi abandon, annulation, double clic, paiement refusé et deux réservations pour la dernière place. Les contrôles SQL protègent la capacité finale. Une réservation non payée expire après 15 minutes ; elle est libérée lors de la prochaine consultation de disponibilité, réservation ou réconciliation. Une capture en cours reste bloquée jusqu'à vérification PayPal pour éviter de revendre le scooter après un paiement incertain.

## 5. Réconciliation des captures incertaines

Configurer un ordonnanceur pour appeler GET `/api/paypal/reconcile` avec `Authorization: Bearer <CRON_SECRET>` régulièrement, par exemple toutes les cinq minutes si votre offre d'hébergement le permet. Le code ne configure pas automatiquement un service planifié payant. Cette route vérifie au maximum cinq captures en cours par appel ; surveiller `unresolved` et les lignes `capturing` persistantes. Ne jamais annuler manuellement une capture incertaine sans vérifier PayPal.

## 6. Passer en réel

Une fois les tests complets réussis, dans PayPal Developer sélectionner Live et utiliser les identifiants de l'application Live liée au compte Business qui encaisse. Remplacer NEXT_PUBLIC_PAYPAL_CLIENT_ID et PAYPAL_CLIENT_SECRET, définir PAYPAL_ENV=live, créer un webhook Live sur la même URL et remplacer PAYPAL_WEBHOOK_ID. Vérifier ADMIN_APP_ORIGIN puis redéployer. Le code refuse Live sans HTTPS et webhook ID. Terminer les captures Sandbox avant de changer d'environnement.

Les réservations Sandbox restent dans Supabase : elles occupent aussi la capacité. Annuler dans l'admin les réservations de test confirmées après vérification. Ne pas supprimer des réservations réelles. Pour une séparation complète utiliser un projet Supabase de test.

## Limites et maintenance

- Paiements en EUR, affichage MAD + EUR au checkout. La page tarifs garde les montants MAD. Le taux quotidien est figé pendant le checkout, sans majoration ; si le service de taux est indisponible ou trop ancien, aucun paiement n'est lancé.
- Remboursements : les effectuer dans PayPal Business. L'annulation d'une réservation dans l'admin ne rembourse pas le client. Les remboursements automatiques et leur synchronisation ne sont pas inclus ; après confirmation du remboursement PayPal, un opérateur doit rapprocher l'état comptable dans Supabase. L'admin ne peut pas marquer arbitrairement un paiement PayPal payé/remboursé.
- Avant ouverture publique, configurer une limitation de débit adaptée sur les endpoints de réservation (cash et PayPal) dans votre hébergement pour réduire les blocages abusifs de disponibilité. Aucune création de compte client n'est imposée.
- Le retour URL seul ne prouve jamais un paiement : le serveur vérifie l'ordre, la devise, le montant et la capture PayPal.
- L'intégration conserve le schéma reservations et la protection de capacité existants. Les seules adaptations des routes existantes libèrent les holds expirés, utilisent l'agrégat de disponibilités et rendent une erreur claire si le dernier scooter est pris.

Documentation : https://developer.paypal.com/docs/checkout/standard/integrate/ · https://developer.paypal.com/api/rest/webhooks/rest/ · https://frankfurter.dev/
