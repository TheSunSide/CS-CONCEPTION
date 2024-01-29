/** A Tree implementation, this tree should contain multiple branches only 1 swing at the time
 *
 */

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
    Tree(std::string name);
    std::string getName();
    void acceptVisitor(Visitor *visitor);
    void pushSwing(int duration = 1);

private:
    void grow();
    std::string _name;
    Branch **_branches;
    int _nBranches = 0;
    int _maxBranches = DEFAULT_MAX_BRANCHES;
    Swing *_swing = nullptr;
};