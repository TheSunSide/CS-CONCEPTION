#include "swing.hpp"
#include "math.h"
#define MAX_X_DISTANCE 4
void Swing::update(int time) {
    if(abs(_horizontalPos) == 4) {
        _direction *= -1;
    }

    _horizontalPos += _direction*time;
}

float Swing::calculateHeight() {
    return sqrt(_ropeLength*_ropeLength - _horizontalPos*_horizontalPos);
}

Swing::Swing(int id, Type type, float rope) {
    _id = id;
    _ropeLength = rope;
    _type = type; // TODO remove type set...
}