#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>

/**
 * Le programme fait les choses suivantes :
 * 1. Créer une balance pour avoir 3 plantes par animal
 * 2. Il faut libérer 3 plantes avec 1 animal en meme temps (print AAAP, PAAA, APAA, etc.)
 * 3. Verifiez manuellement 
 *    (ou avec un autre processus si vous êtes motivés) 
 *    que vos sorties sont correctes
*/


typedef struct {
    // User defined data may be declared here.
    // Probably need some semaphores...
    
} EcosystemBalance;

EcosystemBalance* createBalance() {
    EcosystemBalance* obj = (EcosystemBalance*) malloc(sizeof(EcosystemBalance));
    
    // Initialize user defined data here.
    
    return obj;
}

// For a plant thread, probably need to use semaphores...
void plant(EcosystemBalance* obj) {
    
    // releaseAnimal() outputs "A". Do not change or remove this line.
    releaseAnimal();
}

// For an animal thread, probably need to use semaphores...
void animal(EcosystemBalance* obj) {
    
    // releasePlant() outputs "P". Do not change or remove this line.
    releasePlant();
}

// Clean up the balance resources you created.
void cleanupBalance(EcosystemBalance* obj) {
    // User defined data may be cleaned up here.
    
}

releaseAnimal() {
    printf("A");
}

releasePlant() {
    printf("P");
}

int main() {
    EcosystemBalance* obj = createBalance();

    // Test case 1
    printf("Test case 1\n");
    pthread_t thread[100];
    int i;
    for (i = 0; i < 100; i++) {
        if (i % 4 == 0) {
            pthread_create(&thread[i], NULL, (void*)animal, (void*)obj);
        } else {
            pthread_create(&thread[i], NULL, (void*)plant, (void*)obj);
        }
    }
    for (i = 0; i < 100; i++) {
        pthread_join(thread[i], NULL);
    }
    cleanupBalance(obj);
    printf("\n");

    // Test case 2
    printf("Test case 2\n");
    obj = createBalance();
    pthread_t thread2[16];
    char* input2 = "AAAAPPPPPPPPPPPP";
    for (i = 0; i < 16; i++) {
        if (input2[i] == 'A') {
            pthread_create(&thread2[i], NULL, (void*)animal, (void*)obj);
        } else {
            pthread_create(&thread2[i], NULL, (void*)plant, (void*)obj);
        }
    }
    for (i = 0; i < 100; i++) {
        pthread_join(thread[i], NULL);
    }
    cleanupBalance(obj);
    printf("\n");

    // Test case 3
    printf("Test case 3\n");
    obj = createBalance();
    pthread_t thread3[32];
    char* input3 = "PPAPAPPPAPPPPAPPPPAPPPPAAPPPAPPP";
    for (i = 0; i < 32; i++) {
        if (input3[i] == 'A') {
            pthread_create(&thread3[i], NULL, (void*)animal, (void*)obj);
        } else {
            pthread_create(&thread3[i], NULL, (void*)plant, (void*)obj);
        }
    }
    for (i = 0; i < 100; i++) {
        pthread_join(thread[i], NULL);
    }
    cleanupBalance(obj);
    return 0;
}