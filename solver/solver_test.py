import unittest
import random
from blackbox import BlackBox, Atom, Ray

from solver import Solver

"""
Unit tests to validate the solver
"""


class SimplePatternsTest(unittest.TestCase):
    """
    All the simple patterns contain only one atom in a 3x3 box.
    """

    def test_solve_four_hits(self):
        """
        Map:
            ?   H   ?
        ?   -   -   -   ?
        H   -   A   -   H
        ?   -   -   -   ?
            ?   H   ?
        """
        atom = Atom(1, 1)

        black_box = BlackBox(3, 3, [atom])
        black_box.send_ray(Ray("TOP", 1))
        black_box.send_ray(Ray("BOTTOM", 1))
        black_box.send_ray(Ray("LEFT", 1))
        black_box.send_ray(Ray("RIGHT", 1))

        solver = Solver(3, 3, 1)
        solver.solve(black_box.edges)

        self.assertEqual(1, len(solver.atoms))
        self.assertTrue(atom in solver.atoms)

    def test_solve_two_hits(self):
        """
        Map:
            ?   ?   ?
        ?   -   -   -   ?
        ?   -   -   -   ?
        H   -   -   A   ?
            ?   ?   H
        """
        atom = Atom(2, 0)

        black_box = BlackBox(3, 3, [atom])
        black_box.send_ray(Ray("BOTTOM", 2))
        black_box.send_ray(Ray("LEFT", 0))

        solver = Solver(3, 3, 1)
        solver.solve(black_box.edges)

        self.assertEqual(1, len(solver.atoms))
        self.assertTrue(atom in solver.atoms)

    def test_solve_hit_miss(self):
        """
        Map:
            ?   H   ?
        1   -   -   -   1
        ?   -   -   -   ?
        ?   -   A   -   ?
            ?   H   ?
        """
        atom = Atom(1, 0)

        black_box = BlackBox(3, 3, [atom])
        black_box.send_ray(Ray("TOP", 1))
        black_box.send_ray(Ray("BOTTOM", 1))
        black_box.send_ray(Ray("LEFT", 2))

        solver = Solver(3, 3, 1)
        solver.solve(black_box.edges)

        self.assertEqual(1, len(solver.atoms))
        self.assertTrue(atom in solver.atoms)

    def test_solve_misses(self):
        """
        Map:
            2   ?   ?
        ?   -   -   A   ?
        ?   -   -   -   ?
        1   -   -   -   1
            2   ?   ?
        """
        atom = Atom(2, 2)

        black_box = BlackBox(3, 3, [atom])
        black_box.send_ray(Ray("LEFT", 0))
        black_box.send_ray(Ray("TOP", 0))

        solver = Solver(3, 3, 1)
        solver.solve(black_box.edges)

        self.assertEqual(1, len(solver.atoms))
        self.assertTrue(atom in solver.atoms)

    def test_solve_deflection(self):
        """
        Map:
            ?   1   ?
        ?   -   -   -   ?
        1   -   -   -   ?
        ?   -   -   A   ?
            ?   ?   ?
        """
        atom = Atom(2, 0)

        black_box = BlackBox(3, 3, [atom])
        black_box.send_ray(Ray("TOP", 1))

        solver = Solver(3, 3, 1)
        solver.solve(black_box.edges)

        self.assertEqual(1, len(solver.atoms))
        self.assertTrue(atom in solver.atoms)

    def test_solve_reflection(self):
        """
        Map:
            ?   ?   ?
        ?   -   -   -   ?
        ?   -   -   -   ?
        ?   -   A   -   ?
            R   ?   ?
        """
        atom = Atom(1, 0)

        black_box = BlackBox(3, 3, [atom])
        black_box.send_ray(Ray("BOTTOM", 0))

        solver = Solver(3, 3, 1)
        solver.solve(black_box.edges)

        self.assertEqual(1, len(solver.atoms))
        self.assertTrue(atom in solver.atoms)


class InteractionPatternsTest(unittest.TestCase):
    """
    All these interaction patterns tests contain two atoms in a 4x4 box.
    """

    def test_solve_two_reflections(self):
        """
        Map:
            ?   ?   ?   ?
        ?   -   -   -   -   ?
        ?   -   -   -   -   ?
        ?   -   -   -   -   ?
        ?   -   A   A   -   ?
            R   ?   ?   R
        """

        atom_1 = Atom(1, 0)
        atom_2 = Atom(2, 0)

        black_box = BlackBox(4, 4, [atom_1, atom_2])
        black_box.send_ray(Ray("BOTTOM", 0))
        black_box.send_ray(Ray("BOTTOM", 3))

        solver = Solver(4, 4, 2)
        solver.solve(black_box.edges)

        self.assertEqual(2, len(solver.atoms))
        self.assertTrue(atom_1 in solver.atoms)
        self.assertTrue(atom_2 in solver.atoms)

    def test_solve_double_deflection(self):
        """
        Map:
            ?   ?   R   ?
        ?   -   -   -   -   ?
        ?   -   -   -   -   ?
        ?   -   A   -   A   H
        ?   -   -   -   -   ?
            ?   ?   R   ?
        """

        atom_1 = Atom(1, 1)
        atom_2 = Atom(3, 1)

        black_box = BlackBox(4, 4, [atom_1, atom_2])
        black_box.send_ray(Ray("BOTTOM", 2))
        black_box.send_ray(Ray("TOP", 2))
        black_box.send_ray(Ray("RIGHT", 1))

        solver = Solver(4, 4, 2)
        solver.solve(black_box.edges)

        self.assertEqual(2, len(solver.atoms))
        self.assertTrue(atom_1 in solver.atoms)
        self.assertTrue(atom_2 in solver.atoms)

    def test_solve_deflection_into_hit(self):
        """
        Map:
            H   ?   ?   ?
        ?   -   -   -   -   ?
        ?   -   -   -   -   ?
        ?   -   -   -   A   H
        ?   A   -   -   -   ?
            ?   ?   H   H
        """

        atom_1 = Atom(0, 0)
        atom_2 = Atom(3, 1)

        black_box = BlackBox(4, 4, [atom_1, atom_2])
        black_box.send_ray(Ray("BOTTOM", 2))
        black_box.send_ray(Ray("BOTTOM", 3))
        black_box.send_ray(Ray("RIGHT", 1))
        black_box.send_ray(Ray("TOP", 0))

        solver = Solver(4, 4, 2)
        solver.solve(black_box.edges)

        self.assertEqual(2, len(solver.atoms))
        self.assertTrue(atom_1 in solver.atoms)
        self.assertTrue(atom_2 in solver.atoms)

    def test_solve_deflection_into_deflection(self):
        """
        Map:
            ?   1   ?   ?
        ?   -   -   -   -   ?
        ?   -   -   -   A   ?
        ?   -   -   -   -   ?
        H   A   -   -   -   ?
            ?   ?   1   ?
        """

        atom_1 = Atom(0, 0)
        atom_2 = Atom(3, 1)

        black_box = BlackBox(4, 4, [atom_1, atom_2])
        black_box.send_ray(Ray("BOTTOM", 2))
        black_box.send_ray(Ray("BOTTOM", 3))
        black_box.send_ray(Ray("RIGHT", 1))
        black_box.send_ray(Ray("TOP", 0))

        solver = Solver(4, 4, 2)
        solver.solve(black_box.edges)

        self.assertEqual(2, len(solver.atoms))
        self.assertTrue(atom_1 in solver.atoms)
        self.assertTrue(atom_2 in solver.atoms)

    def test_solve_deflection_into_same_side(self):
        """
        Map:
            ?   ?   ?   ?
        ?   -   -   -   -   ?
        H   A   -   -   A   ?
        ?   -   -   -   -   ?
        ?   -   -   -   -   ?
            ?   1   1   ?
        """

        atom_1 = Atom(0, 2)
        atom_2 = Atom(3, 2)

        black_box = BlackBox(4, 4, [atom_1, atom_2])
        black_box.send_ray(Ray("BOTTOM", 1))
        black_box.send_ray(Ray("LEFT", 2))

        solver = Solver(4, 4, 2)
        solver.solve(black_box.edges)

        self.assertEqual(2, len(solver.atoms))
        self.assertTrue(atom_1 in solver.atoms)
        self.assertTrue(atom_2 in solver.atoms)


class ComplexPatternsTest(unittest.TestCase):
    """
    These interaction patterns tests contain multiple atoms in a 5x5 box.
    """

    def test_solve_complex_reflections(self):
        """
        Map:
            ?   ?   2   R   H
        ?   A   -   -   -   A   ?
        R   -   -   -   -   -   R
        ?   -   -   -   -   A   H
        ?   -   -   -   -   -   ?
        1   -   -   -   -   -   1
            ?   R   2   ?   ?
        """

        atom_1 = Atom(0, 4)
        atom_2 = Atom(4, 2)
        atom_3 = Atom(4, 4)

        black_box = BlackBox(5, 5, [atom_1, atom_2, atom_3])
        black_box.send_ray(Ray("BOTTOM", 1))
        black_box.send_ray(Ray("RIGHT", 2))
        black_box.send_ray(Ray("RIGHT", 3))
        black_box.send_ray(Ray("LEFT", 0))
        black_box.send_ray(Ray("LEFT", 3))
        black_box.send_ray(Ray("TOP", 3))
        black_box.send_ray(Ray("TOP", 4))
        black_box.send_ray(Ray("BOTTOM", 2))

        solver = Solver(5, 5, 3)
        solver.solve(black_box.edges)

        self.assertEqual(3, len(solver.atoms))
        self.assertTrue(atom_1 in solver.atoms)
        self.assertTrue(atom_2 in solver.atoms)
        self.assertTrue(atom_3 in solver.atoms)

    def test_solve_random_pattern(self):
        atoms = list()
        for _ in range(4):
            atoms.append(Atom(random.randint(0, 9), random.randint(0, 9)))

        black_box = BlackBox(10, 10, atoms)
        for i in range(10):
            black_box.send_ray(Ray("BOTTOM", i))
            black_box.send_ray(Ray("RIGHT", i))
            black_box.send_ray(Ray("LEFT", i))
            black_box.send_ray(Ray("TOP", i))

        solver = Solver(10, 10, len(atoms))
        solver.solve(black_box.edges)

        self.assertEqual(len(atoms), len(solver.atoms))
        for i in range(4):
            self.assertTrue(atoms[i] in solver.atoms)
