# GameIF

## Présentation

GameIF est un moteur de recherche spécialisé dans le domaine des jeux vidéos.
Il utilise des données extraites de <a href="https://www.dbpedia.org">DBpedia</a>.

Il a été développé dans le cadre de **Web Sémantique**.

## Auteurs

Groupe H4121 :

- Nathan PIERRET
- François MOURIER
- Juan VALERO
- Hugo GREL
- Alexandre SENOUCI
- Max SZOSTKIEWICZ
- Kévin KANAAN

## Démarrage

Le moteur de recherche est disponible <a href="https://pizzanome.github.io/Gam-IF/">ici</a>.

## Fonctionnalités

Voici une liste des fonctionnalités actuellement implémentées :

* Recherche par nom de jeu
* Autocomplétion du nom de jeu
* Filtres pour affiner la recherche :
    * Date de sortie
    * Plateforme
    * Développeur
* Fiche détaillée d'un jeu
    * Genre
    * Développeur
    * Éditeur
    * Directeur
    * Date(s) de sortie
    * Plateforme(s)
    * Description

## Librairies et technologies utilisées

- HTML/CSS
- JavaScript
- Requêtes Sparql
- Bootstrap
- AJAX

## Bugs éventuels

Il est possible que l'image d'un jeu ne s'affiche pas ou que la fiche d'un jeu ne contienne pas toutes les propriétés
attendues. Cela est dû à un problème de DBpedia sur le format des données.