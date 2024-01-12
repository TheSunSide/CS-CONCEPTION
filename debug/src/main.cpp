#include <iostream>
#include "tree.hpp"
#include "registry.hpp"

int main()
{
    std::cout << "Start of program" << std::endl;
    Tree *tree = new Tree("sapin");
    Branch branch = Branch(5, 44);
    tree->addBranch(branch);
    tree->listBranches();

    Registry registry = Registry();
    registry.addTree(tree);
    std::cout << registry.getList()[0]->getName() << std::endl;
    std::cout << "End of program" << std::endl;
    return 0;
}