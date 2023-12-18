#include "tree.hpp"
#include "registry.hpp"

int main() {
    Tree* tree = new Tree("sapin");
    Branch branch = Branch(5, 44);
    tree->addBranch(branch);
    tree->listBranches();

    Registry registry = Registry();
    registry.addTree(tree);
    return 0;
}