#include "branch.hpp"
#include "visitor.hpp"
class Tree;
class Lumberjack: public Visitor {
    public:
        // void takeLumber(Branch** branches);
        void takeLog(Branch* branch);
        void visitTree(Tree* tree);
        Branch** getBranches();
        Lumberjack();
        ~Lumberjack();

    private:
        Branch** branches;
        int _nBranch;
        int _mBranch;
};
