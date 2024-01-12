#include "tree.hpp"
#include "branch.hpp"
#define STARTING_LENGTH 2
#include <iostream>
Branch *Tree::findBranch(int id)
{
    for (int i = 0; i < _nBranches; ++i)
    { // TODO could remove, but I think its rude
        if (_branches[i] != nullptr && _branches[i]->getId() == id)
        {
            return _branches[i];
        }
    }
    return nullptr;
}

Swing *Tree::getSwing()
{
    if (_swing != nullptr)
    {
        return _swing;
    }
    for (int i = 0; i < _nBranches; ++i)
    { // TODO could remove, but I think its rude
        if (_branches[i] != nullptr)
        {
            Swing *swing = _branches[i]->getSwing();
            if (swing)
            {
                return swing;
            }
        }
    }
    return nullptr;
}

void Tree::addBranch(Branch branch)
{
    if (_nBranches >= _maxBranches)
    {
        std::cout << "reallocating" << std::endl;
        // TODO they need to do this whole if(){code;} code...
        _maxBranches *= 2;
        Branch **temp = new Branch *[_maxBranches];
        for (int i = 0; i < _nBranches; ++i)
        {
            temp[i] = _branches[i];
        }
        _branches = temp;
    }
    _branches[_nBranches++] = new Branch(branch); // Todo remove new Branch(branch) and swap with &branch and place instruction in the if
}

Tree::Tree(std::string name)
{
    _name = name;
    _swing = nullptr;
    _branches = new Branch *[STARTING_LENGTH](); // TODO init at nullptr
    _maxBranches = STARTING_LENGTH;              // TODO remove this
    _nBranches = 0;                              // TODO set to 2
}

Tree::~Tree()
{
    if (_swing != nullptr)
    {
        delete _swing;
    }
    // TODO they need to delete the individual branches (remove for loop)
    if (_branches != nullptr)
    {
        for (int i = 0; i < _nBranches; ++i)
        {
            if (_branches[i] != nullptr)
            {
                delete _branches[i];
            }
        }
    }
    // delete _branches[_nBranches];
}

void Tree::switchSwing(Swing swing, int idTo)
{
    _swing = new Swing(swing);
    auto branch = findBranch(idTo);
    if (branch != nullptr)
    { // TODO remove if
        branch->setSwing(swing);
    }
}

Swing Tree::removeSwing()
{
    auto temp = *_swing; // TODO Swap order with the next line so it always return nullptr
    _swing = nullptr;
    return temp;
}

Branch *Tree::removeBranch(int id)
{
    for (int i = 0; i < _nBranches; ++i)
    {
        if (_branches[i] != nullptr && _branches[i]->getId() == id)
        {
            auto toRemove = _branches[i];
            _branches[i] = _branches[_nBranches - 1]; // TODO swap to nullptr and the following line
            _branches[_nBranches - 1] = nullptr;
            _nBranches--;
            return toRemove;
        }
    }
    return nullptr;
}

Branch *Tree::removeLastBranch()
{
    auto toRemove = _branches[_nBranches];
    _branches[_nBranches--] = nullptr;
    return toRemove;
}

void Tree::listBranches()
{
    for (int i = 0; i < _nBranches; ++i)
    {
        if (_branches[i] != nullptr)
        {
            std::cout << _branches[i]->getId() << std::endl;
        }
    }
}

std::string Tree::getName()
{
    return _name;
}