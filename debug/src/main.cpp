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

    printSubSeparator();

    std::cout << "#8 Testing a swing" << std::endl;
    tree = new Tree("sapin");
    branch = Branch(5, 44);
    tree->addBranch(branch);
    branch = Branch(6, 45);
    tree->addBranch(branch);
    Swing swing = Swing(1, Swing::Type::babies, 3);
    tree->switchSwing(swing, 5);
    tree->pushSwing(3);
    std::cout << tree->getSwing()->calculateHeight() << " == 3" << std::endl;

    std::cout << "Switching swing should reset height to 0" << std::endl;

    tree->switchSwing(swing, 6);
    std::cout << tree->getSwing()->calculateHeight() << " == 0" << std::endl;

    std::cout << "Switching should delete nullptr" << std::endl;
    Swing swing1 = Swing(1, Swing::Type::babies, 3);
    tree->switchSwing(swing1, 6);

    printSubSeparator();
    std::cout << "#9 Testing iteration of registry" << std::endl;
    registry = Registry();
    tree = new Tree("sapin1");
    branch = Branch(5, 44);
    tree->addBranch(branch);
    registry.addTree(tree);
    tree = new Tree("sapin2");
    branch = Branch(6, 45);
    tree->addBranch(branch);
    registry.addTree(tree);
    tree = new Tree("sapin3");
    branch = Branch(7, 46);
    tree->addBranch(branch);
    registry.addTree(tree);

    std::cout << registry.next()->getName() << " == sapin1" << std::endl;
    std::cout << registry.next()->getName() << " == sapin2" << std::endl;
    std::cout << registry.next()->getName() << " == sapin3" << std::endl;
    std::cout << registry.next()->getName() << " == sapin1" << std::endl;

    std::cout << "\n" << "End of program" << "\n";
    printSeparator();
    
    return 0;
}