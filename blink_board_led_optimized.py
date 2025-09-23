import machine # used for accessing hardware components of a microcontroller.
import time # provides time-related functions
import utime

#configure internal LED Pin as output pin and create led object for Pin class:
led = machine.Pin('LED', machine.Pin.OUT)

#blink the LED
while True:
    led.toggle()
    utime.sleep(1)
