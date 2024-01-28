# High Performance Computing (HPC)

> ⚠️ **Cette section nécessite des bases en Rust**: Ne perdez pas votre temps si vous ne savez pas coder en Rust!

# Mise en situation

Alors que vous êtes dégoûtés des labos d'INF2610 pour leur mauvaise utilisation du parallélisme et leur abominable fork(), vous décidez de rejoindre le culte du crabe et ~~de vous faire torturer~~ de vous faire encadrer par le compilateur qui ne veux pas laisser votre code manquant les primitives de synchronisation compiler.

Après que vous croyiez avoir atteint le sommet de la performance, vous apprenez en infographie la puissance brute des GPUs et vous décider d'utiliser un langage de shader ~~expérimental~~ based et performant pour calculer encore plus vite. Vous vous rendez vite bien compte que vous n'êtes qu'au sommet de l'iceberg et que la vitesse de calcul est une méchante addiction.

# Comment répondre aux questions

Dans le dossier src, il y a un module question avec des todos pour chaque question. Vu la complexité de cette section, des tests unitaires vont sont fournis pour vérifier le fonctionnement et la performance de vos calculs. Pour tester le fonctionnement d'une question faite `cargo test **questionX**`. Pour tester la performance d'une question faites `cargo bench **questionX**`. Des exemples d'implémentations naives sont utilisé pour les tests de fonctionnalitées et de performance, vos implémentations **doivent** être plus rapide. N'hésitez pas à partir un cargo build dès maintenant pour compiler les dépendances. Suivez les Warnings pour trouver le code à compléter.

## Question 1 (Facile) - Parallélisation avec Rayon

### Mise en contexte

La parallélisation avec [rayon](https://github.com/rayon-rs/rayon) est très facile à utiliser pour augmenter la performance, mais il faut l'utiliser au bon endroit et écrire le code avec des itérateurs de manière fonctionnelle.

### Ce que vous devez faire

Parallélisez le code avec rayon qui calcule le factoriel d'un vecteur. Vous devez utilisez la même logique qui vous est fournis pour calculer le factoriel. Vous devez aussi ne pas utiliser de for loops dans ce code que des itérateurs. (Pas de caching ou de prime swing factorial)

## Question 2 (Medium) - Parallélisation simple à la main

### Mise en contexte
Rayon est très utile pour parallèliser rapidement, mais il arrive souvent des problèmes où la parallélisation doit être fait à la main dû à des contraintes entre le partage des ressources.

### Ce que vous devez faire
Vous devez faire la somme du premier chiffre de la puissance de e chaque entrée d'un vecteur de manière parallèle sans utiliser rayon (juste des std::thread). La somme doit rester dans une variable partagée entre les threads, mais elle peut être actualisé qu'à la fin du thread. (Ne peut pas être envoyer comme valeur de retour) Vous pouvez attendre après le thread avec un join. Ex: si les entrées sont 0, 1, 2, 3, 4 les puissances seront **1**, **2**.71..., **7**,38..., **2**0,08..., **5**4,60... et les premiers chiffres seront 1, 2, 7, 2, 5 et la somme sera 17. Vous pouvez supposer que la machine a 8 coeurs et que les entrées sont divisibles par 8 et qu'il y a plus que 8 entrées.

## Question 3 (Facile) - du SIMD et des XORs

### Consigne pour cette question

Si vous n'avez jamais fait de SIMD, je vous conseille de lire ce [petit guide pour débutant](https://github.com/rust-lang/portable-simd/blob/master/beginners-guide.md). Aussi, je vous encourage très fortement d'utiliser l'API nightly [portable_simd](https://github.com/rust-lang/portable-simd) pour faire ces questions. Vous pouvez aussi utiliser les bindings [des instructions ASM de la librairie standard](https://doc.rust-lang.org/core/arch/x86_64/index.html) ou les instructions en ASM directement dans une macro si ça vous chante et que vous ne tenez pas trop à votre santé mentale, mais sachez que votre target est un CPU x86-64 avec AVX2.

### Mise en contexte

Il existe un algorithme de cryptographie mathématiquement indéchiffrable, mais nécessitant des conditions très peu pratiques pour marcher. ([OTP](https://en.wikipedia.org/wiki/One-time_pad)) En gros, ce algorithme en binaire nécessite d'avoir une clé aléatoire de la même taille que le message et de faire un ou exclusif (XOR) sur tous les bits pour chiffrer et pour déchiffrer il suffit de refaire un ou exclusif avec la clé. (Ceci marche par la propriété que $k \oplus k = 0$, donc $(m \oplus k) \oplus k = m$ où k est ma clé et m mon message)

### Ce que vous devez faire

Utilisez du SIMD pour accélérer la fonction xor_chunks() qui consiste à donner le résultat du xor de deux chunks de donnée.

## Question 4 (difficile) - intégration numérique sur le GPU

### Consignes pour cette question

Cette question est difficile et nécessite d'écrire du WGSL. Ce langage ressemble beaucoup au Rust, mais ne perdez pas de temps si vous ne voulez pas écrire de shader. Une courte introduction au WGSL est disponible en ligne à [https://google.github.io/tour-of-wgsl/](https://google.github.io/tour-of-wgsl/). (WebGPU n'est stabilisé que sur chromium donc il vous faut un navigateur basé sur chromium pour voir ce lien)

### Mise en contexte

L'intégration numérique est une technique pour obtenir l'intégrale de fonction n'ayant pas de primitive, mais pouvant être intégré. Un exemple de ces fonctions est la loi normale. Le calcul de l'intégrale entre moins l'infini et x permet de calculer la PDF de la loi normale et est très pratique en statistique. Pour intégrer de manière numérique la manière la plus simple est de diviser la zone d'intégration en un nombre N de rectangle et ensuite calculer la somme de l'aire de ces N rectangles. Voici un exemple avec une fonction quelquonque.
![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Integration_rectangle.svg/1024px-Integration_rectangle.svg.png)

Voici l'intégrale de la loi normale et une simplification pour x >= 0.

$ f(x) = \frac{e^{-\frac{1}{2} x^2}}{\sqrt{2 \pi}} $

$ F(x) = \int_{-\infty}^{x} f(x) dx $

$ F(x) = 0.5 + \int_{0}^{x} f(x) dx $

Ce qui peut être approximé par l'intégration numérique par rectangle

$ F(x) \approx  0.5 + \sum_{i = 0}^{N} \frac{x}{N} \cdot f((i + 0.5) \cdot \frac{x}{N}) $

### Ce que vous devez faire

Vous devez écrire un shader WGSL qui intègre une liste de x avec l'intégration numérique avec 32768 rectangles. Les x vont toujours être positif. Ce n'est pas grave si la carte graphique est plus lente que le CPU dans ce cas vu qu'il faut une carte graphique décente pour voir les différences et pas des graphiques intégrés de portable.
