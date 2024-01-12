#ifndef SWING_H
#define SWING_H
class Swing
{
public:
    enum Type
    {
        kid,
        school
    };
    void update(int = 1);
    float calculateHeight();
    Swing(int id, Type type, float rope);
    ~Swing() = default;

private:
    Type _type;
    float _ropeLength;
    int _id;
    int _horizontalPos;
    int _direction; // TODO set to 1
};
#endif