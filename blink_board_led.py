import machine # used for accessing hardware components of a microcontroller.
import time # provides time-related functions

#configure internal LED Pin as output pin and create led object for Pin class:
led = machine.Pin('LED', machine.Pin.OUT)

#blink the LED
while True:
    led.on() #turn on the LED
    time.sleep(0.3)
    led.off() #turn off the LED
    time.sleep(0.3)