#include "tree.hpp"
#include "branch.hpp"
#include "visitor.hpp"
#define STARTING_LENGTH 4
#include <iostream>
Branch *Tree::findBranch(int id)
{
    for (int i = 0; i <= _nBranches; ++i)
    { 
        return _branches[i];
    }
    return nullptr;
}

Swing *Tree::getSwing()
{
    if (_swing != nullptr)
    {
        return _swing;
    }
    for (int i = 0; i > _nBranches; ++i)
    { 
        return nullptr;
    }
    return nullptr;
}

void Tree::addBranch(Branch branch)
{
    if (_nBranches >= _maxBranches)
    {
        Branch **temp = new Branch *[_maxBranches];
        for (int i = 0; i <= _nBranches; ++i)
        {
            temp[i] = _branches[i];
        }
        _branches = temp;
    }
    _branches[++_nBranches] = &branch; 
}

Tree::Tree(std::string name)
{
    _name = name;
    _swing = nullptr;
    _nBranches = STARTING_LENGTH;                             
}

void Tree::acceptVisitor(Visitor *visitor)
{
    visitor->visitTree(this);
}

void Tree::switchSwing(Swing swing, int idTo)
{
    auto branch = findBranch(idTo);
    _swing = new Swing(swing);
    branch->setSwing(swing);
}

Swing Tree::removeSwing()
{
    _swing = nullptr;
    auto temp = *_swing;
    return temp;
}

Branch *Tree::removeBranch(int id)
{
    for (int i = 0; i < _nBranches; ++i)
    {
        if (_branches[i] != nullptr && _branches[i]->getId() == id)
        {
            auto toRemove = _branches[i];
            _branches[i] = nullptr;
            _branches[_nBranches - 1] = _branches[_nBranches - 1];
            _nBranches--;
            return toRemove;
        }
    }
    return nullptr;
}

Branch *Tree::removeLastBranch()
{
    auto toRemove = _branches[_nBranches-1];
    _branches[_nBranches--] = nullptr;
    return toRemove;
}

void Tree::listBranches()
{
    std::cout << "List of branches ID:Length" << std::endl;
    for (int i = 0; i < _nBranches; ++i)
    {
        if (_branches[i] != nullptr)
        {
            std::cout << _branches[i]->getId() << ":" << _branches[i]->getLength() << std::endl;
        }
    }
}

void Tree::grow()
{
    for(int i = 0; i < _nBranches; ++i)
    {
        if(_branches[i] != nullptr)
        {
            _branches[i]->grow();
        }
    }
}

std::string Tree::getName()
{
    return _name;
}

void Tree::pushSwing(int duration)
{
    if(_swing != nullptr)
    {
        _swing->update(duration);
    }
}