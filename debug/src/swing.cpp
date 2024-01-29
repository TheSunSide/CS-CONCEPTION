#include "swing.hpp"
#include "math.h"
//#define MAX_X_DISTANCE 4
void Swing::update(int time) {
    for(int i = 0; i < time; ++i) {
        if(_horizontalPos + _direction > _ropeLength) {
            _direction *= -1;
        }
        _horizontalPos += _direction;
    }
}

//Should return height from its bottom position
float Swing::calculateHeight() {
    return sqrt(_ropeLength*_ropeLength - (float)_horizontalPos*(float)_horizontalPos);
}

Swing::Swing(int id, Type type, float rope) {
    _id = id;
    _ropeLength = rope;
}