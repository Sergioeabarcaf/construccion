import firebase
import conversiones
import sensor
import time
import datetime
import csvFile

def getData(dir, dirFile):
    data = {'timestamp': datetime.datetime.fromtimestamp(time.time()).strftime('%Y/%m/%d-%H:%M:%S')}
    data.update(sensor.getExterior())
    data.update(sensor.getInterior())

    firebase.pushData(dir, data)
    csvFile.writeData(dirFile, data)


while(True):
    init = firebase.start()
    if init != 0:
        print("inicio")
        intervalo = conversiones.intervalToSeconds(init['intervalTime'])
        startTime = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d_%H:%M:%S')

        dir = 'sessions/S-' + str(firebase.numberSession())
        firebase.setInfoSession(dir,init,startTime)

        dirFile = csvFile.createFile(dir,init['material'],startTime, init)

        if init['finishedType'] == 'manual':
            while (firebase.finManual()):
                getData(dir, dirFile)
                time.sleep(intervalo)
        elif init['finishedType'] == 'programado':
            finishedTimeInSeconds = conversiones.finishedTimeInSeconds(init['finishedDays'], init['finishedHours'], init['finishedMinutes'])
            loops = int(finishedTimeInSeconds / intervalo)
            print loops
            while (firebase.finManual()):
                if loops > 0:
                    loops -= 1
                    getData(dir, dirFile)
                    time.sleep(intervalo)
                else:
                    firebase.execManualEnd()
                
                    

