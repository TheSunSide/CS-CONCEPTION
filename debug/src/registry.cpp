#include "registry.hpp"
#define DEFAULT_WIDTH -1

Tree **Registry::getList()
{
    return _trees;
}


// Should order the list of trees by their name in alphabetical order, if 2 trees have the same name, 
// order them by the number of branches they have
void Registry::orderList()
{
    _current = 0;
    // TODO
}

void Registry::addTree(Tree* tree)
{
    _trees[++_nTrees] = tree;
}

Registry::Registry()
{
    _trees = new Tree *[DEFAULT_WIDTH]();
    _nTrees = DEFAULT_WIDTH;
}

Registry::~Registry()
{
    delete (_trees);
}

// This should return the next tree in the list, if the end of the list is reached, it should start again from the beginning
Tree* Registry::next()
{
    _current = _current % _mTrees;
    return _trees[++_current];
}