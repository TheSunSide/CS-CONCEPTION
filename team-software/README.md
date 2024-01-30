# TEAM SOFTWARE AKA WEB
Vous êtes une équipe chargée de conscientiser la future génération sur la flore d'aujourd'hui.
Pour cet examen, vous avez +-3 options, Vous faites juste le Front-end, parce que vous n’êtes pas confiant pour le reste, vous faites les 2, ou juste le Back-End…
## Front-End 
Vous devrez concevoir 1 Front-end en React, idéalement un Framework pas trop récent avec plein de “gimmick” (Genre que tout le monde serait familier)
- Ce Front-end doit contenir 1 Page d'accueil avec la photo des - CS Games, une description de la situation actuelle, une photo d’arbre. 
- Sur chacune des pages, une navbar verticale qui peut se refermer  
- Une page “About” qui parle des CSGames et ses créateurs
- Une page pour “upload” de nouveaux arbres (peut ne rien faire si vous ne faites pas le serveur, mais on veut le visuel associé) 
- Une page qui montre des arbres, à l’aide d’un carrousel accompagné de 2 boutons, une version alternative de la page serait accessible par un bouton “to list”, qui formerait une liste des noms  avec une photo miniature pour faire comme dans les recherches forum.
    -  Exemples: https://flowbite.com/docs/components/carousel/ Pour le carrousel
    - https://terraria.fandom.com/wiki/Category:Boss_NPCs mais avec des images à coté des noms pour la “liste”
- Chaque arbre aurait un lien associé et une page, qui mettrait des informations supplémentaires.
## Back-End
- Vous devez concevoir un dockerfile pour lancer le serveur dans un environnement “stable”, idéalement ubuntu, alpine… 
- Ce serveur doit utiliser NestJS, GraphQL et TS
- Vous devez enregistrer les arbres et leurs descriptions / photos, plus de points si c’est Redis/Mongodb/SQL > Harddrive (SSD/HDD) > InMemory (RAM)
- Vous devez avoir un chemin qui accepte les créations d’arbres, avec une photo, titre, description
- Un chemin pour avoir la liste d’arbre raccourcie (pas de description)
- Un chemin pour avoir 1 arbre spécifique
- Un chemin pour se créer un compte (dans le vide…)
## Mixte
- Les informations sur le client doivent être du serveur
- La création de nouvel assets doit être possible
- Vous devez link GraphQL entre les 2
