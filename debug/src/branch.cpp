#include "branch.hpp"
int Branch::getLength() {
    return _length;
}

void Branch::setSwing(Swing swing) {
    // TODO remove this if
    if(mySwing != nullptr) {
        delete mySwing;
    }
    mySwing = &swing;
}

Swing* Branch::getSwing() {
    return mySwing;
}

int Branch::getId() {
    return _id;
}

Branch::Branch(int id, int length) {
    _id = id;
    _length = length;
}

Branch::~Branch() {
    if(mySwing != nullptr)
    {
        delete mySwing;
    }
    
}