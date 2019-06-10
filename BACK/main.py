import sys
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

# Detener la ejecucion de cualquier sesion al iniciar el programa
firebase.clean(converter.getTimestamp(), 'start')

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

                numberSession = str(firebase.numberSession())
                dir = 'sessions/S-' + numberSession
                firebase.setInfoSession(dir,init,startTime)
                dirFile = csvFile.createFile(dir,init['material'],startTime, init)

                # Funcionamiento en modo manual
                if init['finishedType'] == 'manual':
                    # Esperar a que el usuario termine desde la WebApp
                    while (firebase.endManualFromWebApp(numberSession)):
                        getData(dir, dirFile)
                        time.sleep(interval)
                # Funcionamiento en modo automatico
                elif init['finishedType'] == 'programado':
                    # Obtener fecha y hora de finalizacion en tipo Date.
                    finishedDate = converter.finishDate(init['finishedDate'], init['finishedTime'] )
                    # Mientras hora actual sea menor o igual a finishedDate y el usuario no
                    # haya terminado desde la aplicacion, realizar mediciones en los intervalos
                    while( finishedDate >= converter.nowDateTime() and firebase.endManualFromWebApp(numberSession) ):
                        getData(dir, dirFile)
                        time.sleep(interval)
                    # Si el sistema se detuvo por comparacion de fecha, cerrar el registro de ejecucion en firebase
                    if (finishedDate < converter.nowDateTime() ):
                        firebase.execManualEnd(numberSession)
# Si existe un error, enviar el timestamp del error a firebase y el tipo de error
    except:
        print(sys.exc_info())
        firebase.clean(converter.getTimestamp(), 'error', sys.exc_info()[0], sys.exc_info()[1])
