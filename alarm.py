import machine
import utime

Pir_Sensor = machine.Pin(16, machine.Pin.IN)

while True:
    if Pir_Sensor.value() == 1:
        print("Motion detected!")
    utime.sleep(0.1)
