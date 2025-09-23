import network
import time
import urequests
import dht
from machine import Pin

ssid ="xxx"  # Replace with your WiFi SSID
password ="xxxxxx"  # Replace with your WiFi password

THINGSPEAK_API_KEY = "xxxxxxx" # Replace with your ThingSpeak API key
THINGSPEAK_URL = "https://api.thingspeak.com/update"

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

print("Connecting to WiFi...", end="")
while not wlan.isconnected():
    print(".", end="")
    time.sleep(0.5)
print("Connected!")
print("IP Address:", wlan.ifconfig()[0])

sensor = dht.DHT11(Pin(15))


# Send data to ThingSpeak
def send_to_thingspeak(temperature, humidity):
    if temperature is None or humidity is None:
        print("Nthing to send")
        return

    try:
        response = urequests.post(
            THINGSPEAK_URL,
            data = "api_key={}&field1={}&field2={}".format(
                THINGSPEAK_API_KEY, temperature, humidity
            ),
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        print("Data sent to ThingSpeak, response:", response.text)
        response.close()
    except Exception as e:
        print("Failed sending data:", e)

while True:
    try:
        sensor.measure()
        temperature = sensor.temperature()
        humidity = sensor.humidity()
        print("Temperature: {}°C, Humidity: {}%".format(temperature, humidity))
        send_to_thingspeak(temperature, humidity)
    except Exception as e:
        print("Error reading sensor or sending data:", e)
    
    time.sleep(600)