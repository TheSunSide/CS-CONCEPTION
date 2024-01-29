#include "swing.hpp"
#include "math.h"
//#define MAX_X_DISTANCE 4
void Swing::update(int time) {
    for(int i = 0; i < time; ++i) {
        if(abs(_horizontalPos + _direction) > _ropeLength) {
            _direction *= -1;
        }
        _horizontalPos += _direction;
    }
}

float Swing::calculateHeight() {
    return _ropeLength - sqrt(_ropeLength*_ropeLength - (float)_horizontalPos*(float)_horizontalPos);
}

Swing::Swing(int id, Type type, float rope) {
    _id = id;
    _ropeLength = rope;
}