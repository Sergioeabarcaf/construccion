import firebase
import converter
import sensor
import time
import datetime
import csvFile
import conection

# Funcion para obtener datos de medicion, almacenarlos en CSV y Firebase.
def getData(dir, dirFile):
    data = {'timestamp': datetime.datetime.fromtimestamp(time.time()).strftime('%Y/%m/%d-%H:%M:%S')}
    data.update(sensor.getExterior())
    data.update(sensor.getInterior())

    firebase.pushData(dir, data)
    csvFile.writeData(dirFile, data)

# Obtener el numero de intento para loguear y Detener la ejecucion de cualquier sesion al iniciar el programa
n = firebase.getNumberLog()
key = str(n) + '-timestamp'
value = {key : datetime.datetime.fromtimestamp(time.time()).strftime('%Y/%m/%d-%H:%M:%S')}
firebase.clean(value, 'start')

while(True):
    try:
        # Validar que exista conexion a internet
        if( conection.valid() ):
            # Consultar si se ha enviado una nueva sesion desde la web app
            init = firebase.start()
            if init != 0:
                interval = converter.intervalToSeconds(init['intervalTime'])
                # Comprobar que interval sea > 0, interval minimo 1
                if (interval < 1):
                    interval = 1
                # Obtener timestamp actual
                startTime = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d_%H:%M:%S')

                dir = 'sessions/S-' + str(firebase.numberSession())
                firebase.setInfoSession(dir,init,startTime)
                dirFile = csvFile.createFile(dir,init['material'],startTime, init)

                # Funcionamiento en modo manual
                if init['finishedType'] == 'manual':
                    # Esperar a que el usuario termine desde la WebApp
                    while (firebase.endManualFromWebApp()):
                        getData(dir, dirFile)
                        time.sleep(interval)
                # Funcionamiento en modo automatico
                elif init['finishedType'] == 'programado':
                    finishedTimeInSeconds = converter.finishedTimeInSeconds(init['finishedDays'], init['finishedHours'], init['finishedMinutes'])
                    # Calcular la cantidad de mediciones que se deben realizar
                    loops = int(finishedTimeInSeconds / interval)
                    # Esperar a que el usuario termine desde la WebApp
                    while (firebase.endManualFromWebApp()):
                        if loops > 0:
                            loops -= 1
                            getData(dir, dirFile)
                            time.sleep(interval)
                        else:
                            firebase.execManualEnd()
    # Si existe un error, enviar el timestamp del error a firebase
    except:
        key = str(n) + '-timestamp'
        value = {key : datetime.datetime.fromtimestamp(time.time()).strftime('%Y/%m/%d-%H:%M:%S')}
        firebase.clean(value, 'error')
