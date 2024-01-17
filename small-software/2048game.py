import tkinter as tk
import random

root = tk.Tk()
root.title('2048')
root.geometry('800x800')
root.resizable(False, False)

grid = []
for i in range(4):
    grid.append([0] * 4)

up_button = tk.Button(root, text='Up', command=lambda: up())
up_button.grid(row=0, column=1)

left_button = tk.Button(root, text='Left', command=lambda: left())
left_button.grid(row=1, column=0)

right_button = tk.Button(root, text='Right', command=lambda: right())
right_button.grid(row=1, column=2)

down_button = tk.Button(root, text='Down', command=lambda: down())
down_button.grid(row=2, column=1)

quit_button = tk.Button(root, text='Quit', command=lambda: root.destroy())
quit_button.grid(row=3, column=1)

canvas = tk.Canvas(root, width=400, height=400)
canvas.grid(row=4, column=4, rowspan=4, columnspan=3)

def draw_grid():
    for i in range(4):
        for j in range(4):
            canvas.create_rectangle(100 * i, 100 * j, 100 * (i + 1), 100 * (j + 1), fill='white')

def draw_numbers():
    for i in range(4):
        for j in range(4):
            if grid[i][j] != 0:
                canvas.create_text(100 * i + 50, 100 * j + 50, text=str(grid[i][j]), font=('Arial', 20))

def draw():
    draw_grid()
    draw_numbers()

def update_grid():
    canvas.delete('all')
    draw()



def update_grid():
    #Print in console for debugging
    for i in range(4):
        print(grid[i])

def add_two():
    a = random.randint(0, 3)
    b = random.randint(0, 3)
    while grid[a][b] != 0:
        a = random.randint(0, 3)
        b = random.randint(0, 3)
    grid[a][b] = 2

def new_game():
    for i in range(4):
        for j in range(4):
            grid[i][j] = 0
    add_two()
    add_two()
    update_grid()

def left():
    for i in range(4):
        for j in range(3):
            if grid[i][j] == 0:
                for k in range(j + 1, 4):
                    if grid[i][k] != 0:
                        grid[i][j] = grid[i][k]
                        grid[i][k] = 0
                        break
    for i in range(4):
        for j in range(3):
            if grid[i][j] == grid[i][j + 1]:
                grid[i][j] *= 2
                grid[i][j + 1] = 0
    for i in range(4):
        for j in range(3):
            if grid[i][j] == 0:
                for k in range(j + 1, 4):
                    if grid[i][k] != 0:
                        grid[i][j] = grid[i][k]
                        grid[i][k] = 0
                        break
    add_two()
    update_grid()

def right():
    for i in range(4):
        for j in range(3, 0, -1):
            if grid[i][j] == 0:
                for k in range(j - 1, -1, -1):
                    if grid[i][k] != 0:
                        grid[i][j] = grid[i][k]
                        grid[i][k] = 0
                        break
    for i in range(4):
        for j in range(3, 0, -1):
            if grid[i][j] == grid[i][j - 1]:
                grid[i][j] *= 2
                grid[i][j - 1] = 0
    for i in range(4):
        for j in range(3, 0, -1):
            if grid[i][j] == 0:
                for k in range(j - 1, -1, -1):
                    if grid[i][k] != 0:
                        grid[i][j] = grid[i][k]
                        grid[i][k] = 0
                        break
    add_two()
    update_grid()

def up():
    for j in range(4):
        for i in range(3):
            if grid[i][j] == 0:
                for k in range(i + 1, 4):
                    if grid[k][j] != 0:
                        grid[i][j] = grid[k][j]
                        grid[k][j] = 0
                        break
    for j in range(4):
        for i in range(3):
            if grid[i][j] == grid[i + 1][j]:
                grid[i][j] *= 2
                grid[i + 1][j] = 0
    for j in range(4):
        for i in range(3):
            if grid[i][j] == 0:
                for k in range(i + 1, 4):
                    if grid[k][j] != 0:
                        grid[i][j] = grid[k][j]
                        grid[k][j] = 0
                        break
    add_two()
    update_grid()

def down():
    for j in range(4):
        for i in range(3, 0, -1):
            if grid[i][j] == 0:
                for k in range(i - 1, -1, -1):
                    if grid[k][j] != 0:
                        grid[i][j] = grid[k][j]
                        grid[k][j] = 0
                        break
    for j in range(4):
        for i in range(3, 0, -1):
            if grid[i][j] == grid[i - 1][j]:
                grid[i][j] *= 2
                grid[i - 1][j] = 0
    for j in range(4):
        for i in range(3, 0, -1):
            if grid[i][j] == 0:
                for k in range(i - 1, -1, -1):
                    if grid[k][j] != 0:
                        grid[i][j] = grid[k][j]
                        grid[k][j] = 0
                        break
    add_two()
    update_grid()

def test_funcs_console():
    new_game()
    while(True):
        print('Enter w, a, s, d, or q')
        inp = input()
        if inp == 'w':
            up()
        elif inp == 'a':
            left()
        elif inp == 's':
            down()
        elif inp == 'd':
            right()
        elif inp == 'q':
            print('Quitting')
            break
        else:
            print('Invalid input')

def test_funcs_gui():
    new_game()
    root.mainloop()
    update_grid()

test_funcs_gui()