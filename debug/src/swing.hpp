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
    int _direction = 0;
};