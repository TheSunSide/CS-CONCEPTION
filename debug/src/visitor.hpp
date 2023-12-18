#ifndef VISITOR_H
#define VISITOR_H
#include "tree.hpp"
class Visitor {
    public:
        virtual void visitTree(Tree* tree) = 0;
};
#endif