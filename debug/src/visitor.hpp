#include "tree.hpp"
class Visitor {
    public:
        virtual void visitTree(Tree* tree) = 0;
};