#include "grower.hpp"

void Grower::visitTree(Tree* tree) {
    tree->addBranch(Branch(99, 123));
}