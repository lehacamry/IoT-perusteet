import machine # used for accessing hardware components of a microcontroller.
import time # provides time-related functions
import utime

#configure internal LED Pin as output pin and create led object for Pin class:
external_led = machine.Pin(15, machine.Pin.OUT)
push_button = machine.Pin(13, machine.Pin.IN, machine.Pin.PULL_UP)

external_led.value(False)

while True:
    if push_button.value() == 1:
        external_led.value(True)
    else:
        external_led.value(False)
