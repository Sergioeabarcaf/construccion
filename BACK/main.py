import firebase
import converter
import sensor
import time
import csvFile
import conection

# Funcion para obtener datos de medicion, almacenarlos en CSV y Firebase.
def getData(dir, dirFile):
    data = {'timestamp': converter.getTimestamp()}
    data.update(sensor.getExterior())
    data.update(sensor.getInterior())

    firebase.pushData(dir, data)
    csvFile.writeData(dirFile, data)

# Obtener el numero de intento para loguear y Detener la ejecucion de cualquier sesion al iniciar el programa
n = firebase.getNumberLog()
key = str(n) + '-timestamp'
value = {key : converter.getTimestamp()}
firebase.clean(value, 'start')

while(True):
    try:
        # Validar que exista conexion a internet
        if( conection.valid() ):
            # Consultar si se ha enviado una nueva sesion desde la web app
            init = firebase.start()
            if init != 0:
                interval = int(init['intervalTime']) - 2

                # Obtener timestamp actual
                startTime = converter.getTimestamp()
                
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
                    # Obtener fecha y hora de finalizacion en tipo Date.
                    finishedDate = converter.finishDate(init['finishedDate'] + ' ' + init['finishedTime'] )
                    # Mientras hora actual sea menor o igual a finishedDate y el usuario no
                    # haya terminado desde la aplicacion, realizar mediciones en los intervalos
                    while( finishedDate >= converter.nowDateTime() and firebase.endManualFromWebApp() ):
                        getData(dir, dirFile)
                        time.sleep(interval)
                    # Si el sistema se detuvo por comparacion de fecha, cerrar el registro de ejecucion en firebase
                    if (finishedDate < converter.nowDateTime() ):
                        firebase.execManualEnd()
    # Si existe un error, enviar el timestamp del error a firebase
    except:
        key = str(n) + '-timestamp'
        value = {key : converter.getTimestamp()}
        firebase.clean(value, 'error')
