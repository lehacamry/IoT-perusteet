import time
time.sleep(0.1) # Wait for USB to become ready

IMPORTANT_NAME = "Clark Kent"

print ("Ready to go!")
name = input("What is your name? ")

if name == IMPORTANT_NAME:
    print("You are the Superman!")
else:
    print("You are an ordinary person.")