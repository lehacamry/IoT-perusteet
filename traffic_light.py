import machine
import time
import utime

led_red    = machine.Pin(15, machine.Pin.OUT)
led_yellow = machine.Pin(12, machine.Pin.OUT)
led_green  = machine.Pin(14, machine.Pin.OUT)
buzzer     = machine.Pin(16, machine.Pin.OUT)
button     = machine.Pin(13, machine.Pin.IN, machine.Pin.PULL_DOWN)

for p in (led_red, led_yellow, led_green): p.value(0)
buzzer.value(0)

def red_and_buzzer():
    led_green.value(0); led_yellow.value(0); led_red.value(1)
    buzzer.value(1); time.sleep(10); buzzer.value(0)
    time.sleep(1)
    led_red.value(0)
    while button.value() == 1:
        time.sleep(0.01)

def pause(sec):
    steps = int(sec / 0.05)
    for _ in range(steps):
        if button.value() == 1:
            red_and_buzzer()
            return
        time.sleep(0.05)

def led_loop():
    led_green.value(1); pause(1.5); led_green.value(0)
    led_yellow.value(1); pause(1.5); led_yellow.value(0)
    led_red.value(1);    pause(1.5); led_red.value(0)
    led_yellow.value(1); pause(1.5); led_yellow.value(0)

while True:
    if button.value() == 1:
        red_and_buzzer()
    led_loop()