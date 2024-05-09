# rps.py

from random import randint

options = ["ROCK", "PAPER", "SCISSORS"]

userScore = 0
npcScore = 0

# ROCK = "\033[31m" # red
# PAPER = "\033[34m" # blue
# SCISSORS = "\033[32m" # green

colors = {
    "red": "\033[31m", # red
    "blue": "\033[34m", # blue
    "green": "\033[32m", # green
    "white": "\033[0m", # white
    "yellow": "\033[33m" # yellow
}

color = colors["white"]
opponentColor = colors["white"]

while True:
    
    npc = options[randint(0, 2)]
    player = input("\nRock, Paper, Scissors? Press q to quit!\n")
    player = player.upper()
    
    if player == 'Q':
        break

    if player not in options:
        print("??? Not a valid input, silly. Try again.")
        continue

    if player == "ROCK":
        color = colors["red"]
    elif player == "PAPER":
        color = colors["blue"]
    elif player == "SCISSORS":
        color = colors["green"]
    if npc == "ROCK":
        opponentColor = colors["red"]
    elif npc == "PAPER":
        opponentColor = colors["blue"]
    elif npc == "SCISSORS":
        opponentColor = colors["green"]

    # print("\nYour", "\033[31m", player, "\033[0m", "versus NPC's", "\033[34m", npc, "\033[0m", "...")
    print("\nYour", color, player, colors["white"], "versus NPC's", opponentColor, npc, "\033[0m", "...")

    if player == npc:
        print("Tie!")
    elif (player == "ROCK" and npc == "SCISSORS") or (player == "PAPER" and npc == "ROCK") or (player == "SCISSORS" and npc == "PAPER"):
        print("You win!")
        userScore += 1
    else:
        print("You lose!")
        npcScore += 1

    print(f"Current Score is {color} {userScore} {colors['white']} - {opponentColor} {npcScore} {colors['white']}")

if userScore > npcScore:
    color = colors["yellow"]
    opponentColor = colors["white"]
elif userScore == npcScore:
    color = colors["yellow"]
    opponentColor = colors["yellow"]
else:
    color = colors["white"]
    opponentColor = colors["yellow"]

print(f"Final Score: {color} {userScore} {colors['white']} - {opponentColor} {npcScore} {colors['white']}")
print("Thanks for playing!")
        


    