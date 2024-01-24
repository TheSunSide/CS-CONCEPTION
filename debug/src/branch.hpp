#ifndef BRANCH_H
#define BRANCH_H
#include "swing.hpp"
class Branch {
    public:
        int getLength();
        void setSwing(Swing swing);
        Swing* getSwing();
        int getId();
        Branch(int id, int length);
        ~Branch();
    private:
        Swing* mySwing = nullptr;
        int _id;
        int _length;
        void grow();

    friend class Tree;
};
#endif