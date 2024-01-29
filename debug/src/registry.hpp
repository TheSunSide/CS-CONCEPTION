#include "tree.hpp"
#include <iostream>
class Registry {
    public:
        Tree** getList();
        void orderList();
        void addTree(Tree* tree);
        Registry();
        Tree* next();

    private:
        Tree** _trees;
        int _nTrees;
        int _mTrees;
        int _current;
};
