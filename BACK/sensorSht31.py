import smbus
import time

# Se aceptan los valores 0x44 y 0x45

def getTempHum(dir):
    # Get I2C bus
    bus = smbus.SMBus(1)

    # SHT31 address, 0x44(68)
    # Send measurement command, 0x2C(44)
    #               0x06(06)        High repeatability measurement
    bus.write_i2c_block_data(dir, 0x2C, [0x06])

    time.sleep(0.5)

    # SHT31 address, 0x44(68)
    # Read data back from 0x00(00), 6 bytes
    # Temp MSB, Temp LSB, Temp CRC, Humididty MSB, Humidity LSB, Humidity CRC
    data = bus.read_i2c_block_data(dir, 0x00, 6)

    # Convert the data
    temp = data[0] * 256 + data[1]
    cTemp = round(-45 + (175 * temp / 65535.0), 2)
    humidity = round(100 * (data[3] * 256 + data[4]) / 65535.0, 2)

    if (dir == 0x44):
        # Output data to screen
        print "Temperatura interior: " + cTemp
        print "Humedad interior: " + humidity

        return {'Ti': cTemp, 'Hi': humidity}
    elif (dir == 0x45):
        # Output data to screen
        print "Temperatura exterior: " + cTemp
        print "Humedad exterior: " + humidity

        return {'Te': cTemp, 'He': humidity}
