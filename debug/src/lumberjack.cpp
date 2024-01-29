#include "lumberjack.hpp"
#define STARTING_LENGTH -1

void Lumberjack::takeLog(Branch* branch) {
    if(_nBranch >= _mBranch) {
        Branch** temp = new Branch[_mBranch*=2]*();
        for(int i = 0; i <= _nBranch; ++i){
            temp[i] = branches[i];
        }
        delete branches;
        branches = temp;
    }
    branches[++_nBranch] = branch;
}

void Lumberjack::visitTree(Tree* tree) {
    Branch* branch = tree->removeLastBranch();
    takeLog(branch);
}

Branch** Lumberjack::getBranches() {
    return branches;
}

Lumberjack::Lumberjack() {
    branches = new Branch*[STARTING_LENGTH];
    _mBranch = STARTING_LENGTH;
}
Lumberjack::~Lumberjack() {
    delete branches;
}