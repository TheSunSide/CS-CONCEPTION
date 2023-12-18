#ifndef GROWER_H
#define GROWER_H
#include "visitor.hpp"

class Grower : public Visitor  {
  public:
    void visitTree(Tree* tree);
};
#endif