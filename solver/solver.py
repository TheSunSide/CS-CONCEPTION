import numpy as np
from blackbox import Edge, Atom, BlackBox, Ray
import itertools


class Solver:
    def __init__(self, grid_width, grid_height, num_atoms):
        self.grid_width = grid_width
        self.grid_height = grid_height
        self.num_atoms = num_atoms
        self.atoms = list()

    def solve(self, edges):
        # Find the atoms using the edges here
        pass
