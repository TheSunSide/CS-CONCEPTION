from enum import Enum


class Atom:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    def __eq__(self, atom):
        return self.x == atom.x and self.y == atom.y

    def contact(self, ray_x, ray_y):
        if abs(self.x - ray_x) <= 1 and abs(self.y - ray_y) <= 1:
            return True
        else:
            return False

    def border_hit(self, ray_x, ray_y):
        if self.x == ray_x and self.y == ray_y:
            return True
        else:
            return False

    def border_reflection(self, ray_x, ray_y, direction):
        if (direction == Direction.UP or direction == Direction.DOWN) and ray_y == self.y and abs(ray_x - self.x) == 1:
            return True
        elif (
            (direction == Direction.LEFT or direction == Direction.RIGHT)
            and ray_x == self.x
            and abs(ray_y - self.y) == 1
        ):
            return True
        else:
            return False

    def direct_hit(self, ray_x, ray_y, direction):
        if (direction == Direction.UP or direction == Direction.DOWN) and ray_x == self.x and abs(ray_y - self.y) == 1:
            return True
        elif (
            (direction == Direction.LEFT or direction == Direction.RIGHT)
            and ray_y == self.y
            and abs(ray_x - self.x) == 1
        ):
            return True
        else:
            return False

    def corner_deflection(self, ray_x, ray_y, direction):
        if abs(self.x - ray_x) == 1 and abs(self.y - ray_y) == 1:
            if self.x > ray_x and direction != Direction.RIGHT:
                return direction.LEFT
            elif self.x < ray_x and direction != Direction.LEFT:
                return direction.RIGHT
            elif self.y > ray_y and direction != Direction.UP:
                return direction.DOWN
            elif self.y < ray_y and direction != Direction.DOWN:
                return direction.UP
        else:
            return None


class Direction(Enum):
    UP = 1
    LEFT = 2
    RIGHT = 3
    DOWN = 4


class Edge(Enum):
    UNKNOWN = 0
    HIT = 1
    REFLECTION = 2
    DETOUR_MISS = 3


class Ray:
    def __init__(self, origin: str, grid_index: int):
        self.origin = origin
        self.grid_index = grid_index


class BlackBox:
    def __init__(self, width: int, height: int, atoms: list):
        self.width = width
        self.height = height
        self.atoms = atoms
        self.edges = dict()
        self.edges["TOP"] = [(Edge.UNKNOWN, 0) for _ in range(width)]
        self.edges["BOTTOM"] = [(Edge.UNKNOWN, 0) for _ in range(width)]
        self.edges["LEFT"] = [(Edge.UNKNOWN, 0) for _ in range(height)]
        self.edges["RIGHT"] = [(Edge.UNKNOWN, 0) for _ in range(height)]
        self.ray_index = 1

    def send_ray(self, ray: Ray):
        if ray.origin == "TOP":
            position_x = ray.grid_index
            position_y = self.height - 1
            direction = Direction.DOWN
        elif ray.origin == "BOTTOM":
            position_x = ray.grid_index
            position_y = 0
            direction = Direction.UP
        elif ray.origin == "LEFT":
            position_x = 0
            position_y = ray.grid_index
            direction = Direction.RIGHT
        elif ray.origin == "RIGHT":
            position_x = self.width - 1
            position_y = ray.grid_index
            direction = Direction.LEFT
        else:
            raise ValueError(f"Invalid Ray Origin received: {ray.origin}")

        done = False
        while not done:
            atoms_contact = list()

            for atom in self.atoms:
                if atom.contact(position_x, position_y):
                    atoms_contact.append(atom)

            corner_deflections = 0
            next_direction = direction
            for atom in atoms_contact:
                if not done:
                    if atom.border_hit(position_x, position_y):
                        self.edges[ray.origin][ray.grid_index] = (Edge.HIT, self.ray_index)
                        done = True

                    elif atom.border_reflection(position_x, position_y, direction):
                        self.edges[ray.origin][ray.grid_index] = (Edge.REFLECTION, self.ray_index)
                        done = True

                    elif atom.direct_hit(position_x, position_y, direction):
                        self.edges[ray.origin][ray.grid_index] = (Edge.HIT, self.ray_index)
                        done = True

                    elif atom.corner_deflection(position_x, position_y, direction) is not None:
                        corner_deflections += 1
                        if corner_deflections > 1:
                            self.edges[ray.origin][ray.grid_index] = (Edge.REFLECTION, self.ray_index)
                            done = True
                        next_direction = atom.corner_deflection(position_x, position_y, direction)

            direction = next_direction
            if not done:
                if direction == Direction.UP:
                    if position_y == self.height - 1:
                        self.edges[ray.origin][ray.grid_index] = (
                            Edge.DETOUR_MISS,
                            self.ray_index,
                        )
                        self.edges["TOP"][position_x] = (
                            Edge.DETOUR_MISS,
                            self.ray_index,
                        )
                        done = True
                    position_y += 1
                elif direction == Direction.DOWN:
                    if position_y == 0:
                        self.edges[ray.origin][ray.grid_index] = (
                            Edge.DETOUR_MISS,
                            self.ray_index,
                        )
                        self.edges["BOTTOM"][position_x] = (
                            Edge.DETOUR_MISS,
                            self.ray_index,
                        )
                        done = True
                    position_y -= 1
                elif direction == Direction.RIGHT:
                    if position_x == self.width - 1:
                        self.edges[ray.origin][ray.grid_index] = (
                            Edge.DETOUR_MISS,
                            self.ray_index,
                        )
                        self.edges["RIGHT"][position_y] = (
                            Edge.DETOUR_MISS,
                            self.ray_index,
                        )
                        done = True
                    position_x += 1
                elif direction == Direction.LEFT:
                    if position_x == 0:
                        self.edges[ray.origin][ray.grid_index] = (
                            Edge.DETOUR_MISS,
                            self.ray_index,
                        )
                        self.edges["LEFT"][position_y] = (
                            Edge.DETOUR_MISS,
                            self.ray_index,
                        )
                        done = True
                    position_x -= 1
        self.ray_index += 1

    def get_edges(self):
        return self.edges
