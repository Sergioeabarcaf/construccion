import firebase
import conversiones
import sensor
import time
import datetime

while(True):
    init = firebase.start()
    if init != 0:
        print("inicio")
        intervalo = conversiones.intervalToSeconds(init['intervalTime'])
        dir = 'sessions/S-' + str(firebase.numberSession())
        firebase.setInfoSession(dir,init)
        if init['tipoFinalizado'] == 'manual':
            while (firebase.finManual()):
                timestamp = datetime.datetime.fromtimestamp(time.time()).strftime('%Y/%m/%d-%H:%M:%S')
                data = {'timestamp': timestamp}
                data.update(sensor.getExterior())
                data.update(sensor.getInterior())
                firebase.pushData(dir, data)
                time.sleep(intervalo)

