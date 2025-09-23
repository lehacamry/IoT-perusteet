import machine # used for accessing hardware components of a microcontroller.
import time # provides time-related functions
import utime

#configure internal LED Pin as output pin and create led object for Pin class:
external_led = machine.Pin(15, machine.Pin.OUT)
push_button = machine.Pin(13, machine.Pin.IN, machine.Pin.PULL_UP)

external_led.value(0)

while True:
    if push_button.value() == 0:
        external_led.value(1)
    else:
        external_led.value(0)
