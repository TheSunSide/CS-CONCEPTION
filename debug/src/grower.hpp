#include "visitor.hpp"

class Grower : public Visitor  {
  public:
    void visitTree(Tree* tree);
};