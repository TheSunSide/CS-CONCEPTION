# DEVOPS

Vous êtes responsable de la future infrastructure informatique de l'île de Madagascar, une île reconnue pour sa faune et sa flore, mais pas son informatique. Votre objectif sera de créer un fichier Terraform, qui hébergera un fichier docker, dans lequel vous hébergez un serveur Rust pour répondre à des requêtes HTTP. 

Idéalement, parce que l’on souhaite être capable de modifier les méthodes / chemins du serveur, celui-ci doit venir d’un repo Git.

L’image de docker de base que vous pouvez utiliser sont celle de alpine / ubuntu, pour confirmer vos habilitées à utiliser Docker.

Le terraform n’a pas besoin de déployer sur un serveur AWS / GCloud, pour pas vider votre budget ou qu’on ait à gérer des clés, le but c’est que je puisse le compiler sur mon ordinateur et que je vois qu’il fonctionne.

Le rust server doit afficher à quelque part “CS Games”, pour voir si vous êtes capable d’écrire un Rust Backend, ou du moins de le modifier...