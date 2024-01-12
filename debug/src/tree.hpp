/** A Tree implementation, this tree should contain multiple branches only 1 swing at the time
 *
 */
#ifndef TREE_H
#define TREE_H

#include "swing.hpp"
#include "branch.hpp"
#include <string>
#define DEFAULT_MAX_BRANCHES = 12
class Visitor;
class Tree
{
public:
    Branch *findBranch(int id);
    Swing *getSwing();
    void addBranch(Branch branch);
    Branch *removeBranch(int id);
    Branch *removeLastBranch();
    void switchSwing(Swing swing, int idTo);
    Swing removeSwing();
    void listBranches();
    ~Tree();
    Tree(std::string name);

private:
    std::string _name;
    Branch **_branches;
    int _nBranches = 0;
    int _maxBranches; // TODO set to DEFAULT_MAX
    Swing *_swing;

    friend class Visitor;
};
#endif