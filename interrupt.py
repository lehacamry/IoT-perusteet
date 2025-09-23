import machine
import utime
import urandom

led = machine.Pin(15, machine.Pin.OUT)
button = machine.Pin(14 , machine.Pin.IN, machine.Pin.PULL_DOWN)

time_start = 0

def button_handler(pin):
    button.irq(handler=None)
    reaction_time = utime.ticks_diff(utime.ticks_ms(), time_start)
    print("Your reaction time was " + str(reaction_time) + " milliseconds")
    print("Program complete")

led.value(1)  # Turn LED on to indicate end of test
utime.sleep(urandom.uniform(5, 10))

led.value(0)  # Turn LED off
time_start = utime.ticks_ms()

button.irq(trigger=machine.Pin.IRQ_RISING, handler=button_handler)  # Re-enable interrupts