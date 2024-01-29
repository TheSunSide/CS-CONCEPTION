#include "branch.hpp"
int Branch::getLength() {
    return _length;
}

void Branch::setSwing(Swing swing) {
    mySwing = &swing;
    mySwing->_horizontalPos = 0;
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
    delete mySwing;
}

void Branch::grow() {
    _length++;
}