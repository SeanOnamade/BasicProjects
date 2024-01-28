#tic_tac_toe.py


import tkinter as tk
# Tkinter is Tk interface; allows you to build desktop applications
# with widgets and graphical interfaces
# Event-driven programming and very simple
from itertools import cycle
# iterates through iterable indefinitely through copying
from tkinter import font # can change game font
from typing import NamedTuple
# I think this is deadass just a named tuple


class Player(NamedTuple):
    label: str
    # will store Xs and Os
    color: str
    # cause why not

class Move(NamedTuple):
    row: int
    col: int
    label: str = ""

BOARD_SIZE = 3
DEFAULT_PLAYERS = (
    Player(label = "X", color = "blue"),
    Player(label = "O", color = "green"),
)

class TicTacToeGame:
    def __init__(self, players = DEFAULT_PLAYERS, board_size = BOARD_SIZE):
        self._players = cycle(players)
        # iterates over input tuple of players
        self.board_size = board_size
        self.current_player = next(self._players)
        # next player up
        self.winner_combo = []
        # combination of cells defining a win
        self._current_moves = []
        # list of players' moves in a giving game
        self._has_winner = False
        self._winning_combos = []
        # cell combos that define a win
        self._setup_board()
    
    def _setup_board(self):
        self._current_moves = [
            [Move(row, col) for col in range(self.board_size)]
            for row in range(self.board_size)
        ]
        # create a list of lifts
        #
        self._winning_combos = self._get_winning_combos()

    def _get_winning_combos(self):
        rows = [
            [(move.row, move.col) for move in row]
            for row in self._current_moves
        ]
        # builds a sublist of coordinates
        # each sublist is a winning combo
        columns = [list(col) for col in zip(*rows)]
        first_diagonal = [row[i] for i, row in enumerate(rows)]
        second_diagonal = [col[j] for j, col in enumerate(reversed(columns))]
        return rows + columns + [first_diagonal, second_diagonal]
    
    def is_valid_move(self, move):
        row, col = move.row, move.col
        move_was_not_played = self._current_moves[row][col].label == ""
        no_winner = not self._has_winner
        return no_winner and move_was_not_played

    def process_move(self, move):
        row, col = move.row, move.col
        self._current_moves[row][col] = move
        # adds in our current move
        for combo in self._winning_combos:
            # checks all winning combos
            results = set(
                self._current_moves[n][m].label
                for n, m in combo
                )
            # retrieves labels of all moves in the current win combo
            # result is then converted into a set object
            # because sets don't allow repeated values
            # e.g. turns 3 X's (a win) into 1 X
            is_win = (len(results) == 1) and ("" not in results)
            # if results has a single value that isn't "",
            # we have a winner
            if is_win:
                self._has_winner = True
                self.winner_combo = combo
                break

    def has_winner(self):
        return self._has_winner
    
    def is_tied(self):
        no_winner = not self._has_winner
        played_moves = (
            move.label for row in self._current_moves for move in row
        )
        return no_winner and all(played_moves)
    
    def toggle_player(self):
        self.current_player = next(self._players)

    def reset_game(self):
        for row, row_content in enumerate(self._current_moves):
            for col, _ in enumerate(row_content):
                row_content[col] = Move(row, col)
        self._has_winner = False
        self.winner_combo = []

class TicTacToeBoard(tk.Tk): #
    def __init__(self, game):
        super().__init__() # initialize the superclass's init method
        self.title("Tic-Tac-Toe Game") # window title
        self._cells = {} # an empty dictionary; will represent cells
        #_ in _cells indicates a private variable
        self._game = game
        self._create_menu()
        self._create_board_display()
        self._create_board_grid()

    def _create_menu(self):
        menu_bar = tk.Menu(master = self)
        self.config(menu = menu_bar) # set as the main menu for window
        file_menu = tk.Menu(master = menu_bar) # add File menu
        file_menu.add_command(
            label = "Play Again",
            command = self.reset_board
        )
        file_menu.add_separator()
        file_menu.add_command(
            label = "Exit",
            command = quit
        )
        menu_bar.add_cascade(label = "File", menu = file_menu)
        # adds File menu to main menu

    def _create_board_display(self):
        display_frame = tk.Frame(master = self) 
        # frame object to hold game
        # master = self means the main window is the parent of this frame
        display_frame.pack(fill = tk.X) 
        # places frame onto main window's top border, and fills width
        self.display = tk.Label( 
            master = display_frame, #label belongs to display_frame
            text = "Ready?",
            font = font.Font(size = 28, weight = "bold"),
        )
        self.display.pack()

    def _create_board_grid(self):
        grid_frame = tk.Frame(master = self)
        grid_frame.pack()
        for row in range(self._game.board_size):
            self.rowconfigure(row, weight = 1, minsize = 50)
            # rows have weight of 1, and minsize of 50 (if window
            # is resized)
            self.columnconfigure(row, weight = 1, minsize = 75)
            for col in range(self._game.board_size):
                button = tk.Button(
                    master = grid_frame,
                    text = "",
                    font = font.Font(size = 36, weight = "bold"),
                    fg = "black",
                    width = 3,
                    height = 2,
                    highlightbackground = "lightblue"
                )
                self._cells[button] = (row, col)
                # adds to the _.cells dictionary
                # the buttons are keys
                # their row and col are the values
                # ultimately, keeps track of button positions
                button.bind("<ButtonPress-1>", self.play)
                # binds the click event of every button
                # to the .play() method
                button.grid(
                    # adds all buttons to main window
                    row = row,
                    column = col,
                    # these specify where to place the buttons
                    padx = 5,
                    # padding
                    pady = 5,
                    sticky = "nsew"
                    # button will expand in all directions
                    # when the window is resized
                )

    def play(self, event):
        clicked_btn = event.widget
        # i.e. one of the buttons on the board grid
        row, col = self._cells[clicked_btn]
        # gets the button's coordinates
        move = Move(row, col, self._game.current_player.label)
        if self._game.is_valid_move(move):
            self._update_button(clicked_btn)
            self._game.process_move(move)
            if self._game.is_tied():
                self._update_display(msg = "Tied game!", color = "red")
            elif self._game.has_winner():
                self._highlight_cells()
                msg = f'Player "{self._game.current_player.label}" won!'
                color = self._game.current_player.color
                self._update_display(msg, color)
            else:
                self._game.toggle_player()
                msg = f"{self._game.current_player.label}'s turn"
                self._update_display(msg)

    def _update_button(self, clicked_btn):
        clicked_btn.config(text = self._game.current_player.label)
        clicked_btn.config(fg = self._game.current_player.color)
        # fg is foreground color

    def _update_display(self, msg, color = "black"):
        self.display["text"] = msg
        self.display["fg"] = color

    def _highlight_cells(self):
        for button, coordinates in self._cells.items():
            if coordinates in self._game.winner_combo:
                button.config(highlightbackground="red")

    def reset_board(self):
        self._game.reset_game()
        self._update_display(msg = "Ready?")
        for button in self._cells.keys():
            button.config(highlightbackground = "lightblue")
            button.config(text = "")
            button.config(fg = "black")

def main():
    game = TicTacToeGame()
    board = TicTacToeBoard(game)
    board.mainloop()

if __name__ == "__main__": # calls main if the .py is run as an executable
    main()