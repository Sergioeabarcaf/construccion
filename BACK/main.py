import firebase
import conversiones
import sensor
import time
import datetime
import csvFile

while(True):
    init = firebase.start()
    if init != 0:
        print("inicio")
        intervalo = conversiones.intervalToSeconds(init['intervalTime'])
        startTime = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d_%H:%M:%S')

        dir = 'sessions/S-' + str(firebase.numberSession())
        firebase.setInfoSession(dir,init,startTime)

        dirFile = csvFile.createFile(dir,init['material'],startTime)

        if init['tipoFinalizado'] == 'manual':
            while (firebase.finManual()):
                timestamp = datetime.datetime.fromtimestamp(time.time()).strftime('%Y/%m/%d-%H:%M:%S')
                data = {'timestamp': timestamp}
                data.update(sensor.getExterior())
                data.update(sensor.getInterior())
                firebase.pushData(dir, data)
                csvFile.writeData(dirFile, data)
                time.sleep(intervalo)

