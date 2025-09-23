import time
time.sleep(0.1) # Wait for USB to become ready

print("Ready to go!")
print("Loop starting")

for i in range(10):
    print("Loop number", i)

print("Loop finished")
