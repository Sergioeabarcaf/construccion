import firebase
import conversiones
import sensor
import time

while(True):
    init = firebase.start()
    if init != 0:
        print("inicio")
        session = int(firebase.numberSession())
        firebase.setInfoSession(session,init)
        intervalo = conversiones.intervalToSeconds(init['intervalTime'])
        if init['tipoFinalizado'] == 'manual':
            while (firebase.finManual()):
                print sensor.getInterior()
                print sensor.getExterior()
                time.sleep(intervalo)

