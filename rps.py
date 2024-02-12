# rps.py

from random import randint

options = ["rock", "paper", "scissors"]

npc = options[randint(0, 2)]

player = False
quit = False

while player == False and quit == False:
    player = input("\nRock, Paper, Scissors? Press q to quit!\n")
    print("\nYour", player, "versus NPC's", npc, "...")
    if player == 'q':
        quit = True
        break
    elif player == npc:
        print("Tie!")
    elif player == "rock":
        if npc == "paper":
            print("You lose,", npc, "covers", player)
        else:
            print("You win!")
    elif player == "paper":
        if npc == "scissors":
            print("You lose, ", npc, "cuts", player)
        else:
            print("You win!")
    elif player == "scissors":
        if npc == "rock":
            print("You lose, ", npc, "crushes", player)
        else:
            print("You win!")
    else:
        print("??? Not a valid input, idiot. Try again (all lowercase).")
    player = False
    npc = options[randint(0, 2)]
        


    