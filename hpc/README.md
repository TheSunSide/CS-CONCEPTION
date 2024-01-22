# High Performance Computing (HPC)
> ⚠️ **Cette section nécessite des bases en Rust**: Ne perdez pas votre temps si vous ne savez pas coder en Rust!
## Mise en situation
Alors que vous êtes dégoûtés des labos d'INF2610 pour leur mauvaise utilisation du parallélisme et leur abominable fork(), vous décidez de rejoindre le culte du crabe et ~~de vous faire torturer~~ de vous faire encadrer par le compilateur qui ne veux pas laisser votre code manquant les primitives de synchronisation compiler.

## Parallélisme
### Consignes pour ces questions
Uniquement pour la question 1, vous pouvez utiliser la librairie Rayon. Les autres questions doivent être fait uniquement avec la librairie standard.

### Question 1 (Facile) - Parallélisation avec Rayon
#### Ce que vous devez faire
Trouvez l'endroit le plus approprié pour mettre l'itérateur parallèle de Rayon.

### Question 2 (Medium) - Parallélisation simple à la main


### Question 3 (Medium) - Parallélisation avec des ressources à la main


## SIMD (Single Instruction Multiple Data)
### Consignes pour ces questions
Si vous n'avez jamais fait de SIMD, je vous conseille de lire ce [petit guide pour débutant](https://github.com/rust-lang/portable-simd/blob/master/beginners-guide.md). Aussi, je vous encourage très fortement d'utiliser l'API nightly [portable_simd](https://github.com/rust-lang/portable-simd) pour faire ces questions. Vous pouvez aussi utiliser les bindings [des instructions ASM de la librairie standard](https://doc.rust-lang.org/core/arch/x86_64/index.html) ou les instructions en ASM directement dans une macro si ça vous chante et que vous ne tenez pas trop à votre santé mentale, mais sachez que votre target est un CPU x86-64 avec AVX2.

### Question 3 (Facile) - OTP (One-time Pad)

#### Mise en contexte
Il existe un algorithme de cryptographie mathématiquement indéchiffrable, mais nécessitant des conditions très peu pratiques pour marcher. ([OTP](https://en.wikipedia.org/wiki/One-time_pad)) En gros, ce algorithme en binaire nécessite d'avoir une clé aléatoire de la même taille que le message et de faire un ou exclusif (XOR) sur tous les bits pour chiffrer et pour déchiffrer il suffit de refaire un ou exclusif avec la clé. (Ceci marche par la propriété que $k \oplus k = 0$, donc $(m \oplus k) \oplus k = m$ où k est ma clé et m mon message)

#### Ce que vous devez faire
Utilisez du SIMD pour accélérer la fonction xor_chunks()

### Question 4 (Difficile) - Exponentiation rapide + SIMD = :\(


