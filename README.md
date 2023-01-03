# GameIF

## Présentation

GameIF est un moteur de recherche spécialisé dans le domaine des jeux vidéos.
Il utilise des données extraites de <a href="https://www.dbpedia.org">DBpedia</a>.

Il a été développé dans le cadre de la matière **Web Sémantique**.

## Auteurs

Groupe H4121 :

- Nathan PIERRET
- François MOURIER
- Juan VALERO
- Hugo GREL
- Alexandre SENOUCI
- Max SZOSTKIEWICZ
- Kévin KANAAN

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

- Requêtes Sparql
- Bootstrap
- AJAX

## Bugs éventuels

Il est possible que l'image d'un jeu ne s'affiche pas ou que la fiche d'un jeu ne contienne pas toutes les propriétés
attendues. Cela est dû à un problème de DBpedia sur le format des données.

## Installation

Pour installer GameIF, il suffit de cloner le dépôt git et de lancer `jeu.html` dans un navigateur web :

Clonage du dépôt git :

    git clone https://github.com/pizzanome/Gam-IF.git