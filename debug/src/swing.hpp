#ifndef SWING_H
#define SWING_H
class Swing
{
public:
    enum Type
    {
        babies,
        flat
    };
    float calculateHeight();
    Swing(int id, Type type, float rope);
    ~Swing() = default;

private:
    void update(int = 1);
    Type _type;
    float _ropeLength;
    int _id;
    int _horizontalPos = 0;
    int _direction = 1; // TODO set to 1
    friend class Tree;
    friend class Branch;
};
#endif