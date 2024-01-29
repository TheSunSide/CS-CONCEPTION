#include "registry.hpp"
#define DEFAULT_WIDTH 4 // TODO make this -1

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
    if (_nTrees >= _mTrees)
    {
        // TODO they need to do this whole if(){code;} code...
        _mTrees *= 2;
        Tree **temp = new Tree*[_mTrees]();
        for (int i = 0; i < _nTrees; ++i)
        {
            temp[i] = _trees[i];
        }
        std::cout << "deleting old Registry" << std::endl;
        _trees = temp;
    }
    _trees[_nTrees++] = tree;
}

Registry::Registry()
{
    _trees = new Tree *[DEFAULT_WIDTH]();
    _mTrees = DEFAULT_WIDTH;
    _nTrees = 0; // TODO remove this
}

Registry::~Registry()
{
    if(*_trees)
        delete (_trees);
}

// This should return the next tree in the list, if the end of the list is reached, it should start again from the beginning
Tree* Registry::next()
{
    _current = _current % _nTrees; // TODO replace ++var by var++, replace _nTree by _mTree
    return _trees[_current++];
}