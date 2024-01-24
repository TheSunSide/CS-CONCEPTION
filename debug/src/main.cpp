#include <iostream>
#include "tree.hpp"
#include "registry.hpp"
#include "lumberjack.hpp"
#include "grower.hpp"

void printSeparator()
{
    std::cout << "\n" << "============================================================================================" << "\n" << std::endl;
}

void printSubSeparator()
{
    std::cout << "\n" << "-------------------------------------------------------------------------------------------" << "\n" << std::endl;
}

int main()
{
    printSeparator();
    std::cout << "Start of Test program, these tests might not do all the edge-cases done by the evaluator" << std::endl;
    printSubSeparator();
    std::cout << "#1 Testing 1 Tree with 1 Branch and a registry" << std::endl;
    Tree *tree = new Tree("sapin");
    Branch branch = Branch(5, 44);
    tree->addBranch(branch);
    tree->listBranches();
    Registry registry = Registry();
    registry.addTree(tree);
    std::cout << registry.getList()[0]->getName() << std::endl;
    printSubSeparator();

    std::cout << "#2 Testing 1 Tree with 2 Branches and a registry" << std::endl;
    registry = Registry();
    tree = new Tree("sapin");
    branch = Branch(5, 44);
    tree->addBranch(branch);
    branch = Branch(6, 45);
    tree->addBranch(branch);
    tree->listBranches();
    registry.addTree(tree);
    std::cout << registry.getList()[0]->getName() << std::endl;
    printSubSeparator();

    std::cout << "#3 Testing 2 Tree with 1 Branches each and a registry" << std::endl;
    registry = Registry();
    tree = new Tree("sapin");
    branch = Branch(5, 44);
    tree->addBranch(branch);
    tree->listBranches();
    registry.addTree(tree);
    tree = new Tree("sapin");
    branch = Branch(6, 45);
    tree->addBranch(branch);
    tree->listBranches();
    registry.addTree(tree);
    std::cout << registry.getList()[0]->getName() << std::endl;
    std::cout << registry.getList()[1]->getName() << std::endl;
    printSubSeparator();

    std::cout << "#4 Testing 2 Tree with 2 Branches each and a registry" << std::endl;
    registry = Registry();
    tree = new Tree("sapin");
    branch = Branch(5, 44);
    tree->addBranch(branch);
    branch = Branch(6, 45);
    tree->addBranch(branch);
    tree->listBranches();
    registry.addTree(tree);
    tree = new Tree("sapin");
    branch = Branch(7, 46);
    tree->addBranch(branch);
    branch = Branch(8, 47);
    tree->addBranch(branch);
    tree->listBranches();
    registry.addTree(tree);
    std::cout << registry.getList()[0]->getName() << std::endl;
    std::cout << registry.getList()[1]->getName() << std::endl;
    printSubSeparator();

    std::cout << "#5 Testing too many trees" << std::endl;
    registry = Registry();
    for (int i = 0; i < 100; ++i)
    {
        tree = new Tree("sapin");
        branch = Branch(5, 44);
        tree->addBranch(branch);
        branch = Branch(6, 45);
        tree->addBranch(branch);
        registry.addTree(tree);
    }
    printSubSeparator();

    std::cout << "#6 Testing a lumberjack" << std::endl;
    Lumberjack lumberjack = Lumberjack();
    tree = new Tree("sapin");
    branch = Branch(5, 44);
    tree->addBranch(branch);
    branch = Branch(6, 45);
    tree->addBranch(branch);
    tree->acceptVisitor(&lumberjack);

    tree = new Tree("sapin");
    branch = Branch(7, 46);
    tree->addBranch(branch);
    branch = Branch(8, 47);
    tree->addBranch(branch);
    tree->acceptVisitor(&lumberjack);
    std::cout << lumberjack.getBranches()[0]->getLength() << "== 45" << std::endl;
    std::cout << lumberjack.getBranches()[1]->getLength() << "== 47" << std::endl;
    printSubSeparator();

    std::cout << "#7 Testing a grower" << std::endl;
    Grower grower = Grower();
    tree = new Tree("sapin");
    branch = Branch(5, 44);
    tree->addBranch(branch);
    branch = Branch(6, 45);
    tree->addBranch(branch);
    tree->listBranches();
    tree->acceptVisitor(&grower);
    tree->listBranches();
    printSeparator();

    std::cout << "End of program" << "\n";
    printSeparator();
    return 0;
}