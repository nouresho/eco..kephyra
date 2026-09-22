# Réserver plusieurs scooters

Le formulaire propose « Number of scooters ». Le prix est : tarif journalier par scooter × nombre de jours inclusifs × nombre de scooters. Le tarif journalier dépend toujours de la durée, sans nouvelle remise de groupe. Le nombre disponible est le minimum sur toute la période.

## À faire une seule fois

1. Dans Supabase → SQL Editor, exécuter tout `supabase/migrations/004_booking_quantity.sql`, après les migrations admin et PayPal déjà installées. Ne pas relancer les anciennes migrations.
2. Redémarrer `npm run dev` pour tester localement. Déployer le nouveau code sur Vercel après le SQL.
3. Tester par exemple deux scooters pour deux jours : 2 × 2 × 200 = 800 MAD. PayPal convertit le montant total en EUR selon le mécanisme existant.

Cette migration n'est pas exécutée automatiquement par Next.js/Vercel. Le nouveau paiement PayPal refuse de démarrer si sa fonction SQL n'est pas installée, pour éviter de facturer un seul scooter au lieu du groupe.

## Comportement

- Les anciennes réservations conservent un scooter, les prix et paiements existants ne changent pas.
- Cash, PayPal et les réservations manuelles admin comptent tous le nombre de scooters réservé, chaque jour.
- Les contrôles SQL utilisent le verrou de capacité existant pour protéger les écritures concurrentes et les réductions de parc.
- L'annulation ou l'expiration d'un hold libère toute sa quantité. Une capture PayPal incertaine reste protégée selon le fonctionnement existant.
- Le tableau admin affiche la quantité. Pour une réservation WhatsApp manuelle, saisir le prix total convenu pour tout le groupe.
- La quantité d'une réservation enregistrée est figée pour ne pas désynchroniser le paiement. Pour changer un groupe, traiter l'annulation/remboursement nécessaire puis créer une nouvelle réservation.
- Les pages de confirmation cash/WhatsApp continuent à référencer le numéro de réservation ; l'équipe retrouve le nombre enregistré dans l'admin.

Validation : tests de migration sur une base isolée (quantité, chevauchements, limites de parc, annulation, expiration, calcul PayPal, capture, rejeu et permissions). Les paiements réels ne sont pas déclenchés par ces tests.
