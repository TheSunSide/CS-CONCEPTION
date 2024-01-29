#include "grower.hpp"

void Grower::visitTree(Tree* tree) {
    tree->addBranch(Branch());
}