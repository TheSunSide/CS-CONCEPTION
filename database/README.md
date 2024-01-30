# SQL / Base de données
Vous êtes un nouveau développeur de la compagnie Monkeys in the Jungle.
Un groupe de développement dans la jungle Amazonienne qui se doit de la restaurer et de l’entretenir pour les générations futures. Vous êtes le développeur de la base de données SQL qui est responsable de la représentation et de l’entretien de la jungle.

## Schémas
Vous devez créer, à l’aide de PostgreSQL, de créer une représentation SQL de ce projet, qui suit les requis suivants (MySQL possible, mais m’avertir / l’identifier clairement) :

- Vous devez pouvoir lister des plantes/arbres, ceux-ci ont une famille, produisent 1 à 3 éléments utile à la consommation, pousse dans possiblement plusieurs types d’environnements (près de rivières, jungle dense…)
- Vous devez lister des animaux, ceux-cis ont un nom, un nom scientifique, appartiennent à une famille, un type: Proie ou Prédateur, puis un type d’environnement
- Les prédateurs ont plusieurs types de proies, un mode d’attaque, puis une quantité de proie nécessaire à la consommation chaque jour
- Les proies ont plusieurs types de prédateurs, un mode de défense, puis ils peuvent manger certains types de produits dérivés d’une plante

## Requêtes

Pour les requêtes, vous devez faire les suivantes:
- Vous devez faire une requête qui permet de lister tous les prédateurs qui protègent indirectement un type de plante/arbre X
- Lister toutes les plantes/arbres qui ont un produit en commun
- Lister tous les prédateurs qui ont une Proie en commun
- Lister tous les prédateurs et proie qui vivent dans un environnement commun
