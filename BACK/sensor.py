import Adafruit_DHT

pinInt = 23
pinExt = 24
sensor = Adafruit_DHT.DHT11

def getInterior():
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pinInt)
    return {'Ti':temperature, 'Hi':humidity}

def getExterior():
    humidity, temperature = Adafruit_DHT.read_retry(sensor, pinExt)
    return {'Te':temperature, 'He':humidity}
