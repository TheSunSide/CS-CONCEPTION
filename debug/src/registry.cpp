#include "registry.hpp"
#define DEFAULT_WIDTH 4 // TODO make this -1

Tree **Registry::getList()
{
    return _trees;
}

void Registry::orderList()
{
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
    delete[] (_trees);
    std::cout << "Registry deleted" << std::endl;
}

Tree *Registry::next()
{
    _current = _current++ % _nTrees; // TODO replace ++var by var++, replace _nTree by _mTree
    return _trees[_current];
}