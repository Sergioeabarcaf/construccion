import sys
import firebase
import converter
import sensor
import time
import csvFile
import conection

# Cambiar segun el modulo donde se esta utilizando, pudiendo ser thermal o sound
module = 'thermal'

# Generar estructura para almacenar la informacion larga de la sesion
infoLarge = {
    'material': '',
    'startResponsable': '',
    'startTimestamp': '',
    'module': -1,
    'intervalTime': -1,
    'sessionNumber': -1,
    'endResponsable': '',
    'endTimestamp': '',
    'url': '',
    'extreme': {
        'thermal': {
            'max':{
                'Ti': -1,
                'Hi': -1,
                'Te': -1,
                'He': -1
            },
            'min':{
                'Ti': -1,
                'Hi': -1,
                'Te': -1,
                'He': -1
            }
        },
        'sound': {
            'max':{
                'Ti': -1,
                'Hi': -1,
                'Te': -1,
                'He': -1
            },
            'min':{
                'Ti': -1,
                'Hi': -1,
                'Te': -1,
                'He': -1
            }
        }
    }
}


# Funcion para obtener datos de medicion.
def getData(dir, dirFile):
    data = {'timestamp': converter.getTimestamp()}
    data.update(sensor.getExterior())
    data.update(sensor.getInterior())

    firebase.pushData(dir, data)
    csvFile.writeData(dirFile, data)

# Detener la ejecucion de cualquier sesion al iniciar el programa
firebase.clean(module, converter.getTimestamp(), 'start')

while(True):
    try:
        # Validar que exista conexion a internet
        if( conection.valid() ):
            # Consultar si se ha enviado una nueva sesion desde la web app
            init = firebase.start(module)
            if init != 0:
                # Obtener intervalo de tiempo entre mediciones, se restan 2 debido al procesamiento y envio de datos
                interval = int(init['intervalTime']) - 2

                # Obtener timestamp actual
                startTime = converter.getTimestamp()

                # Actualizar infoLarge
                infoLarge.update({'material': init['material'], 'startResponsable': init['startResponsable'], 'startTimestamp': init['startTimestamp'], 'module': int(init['module']), 'intervalTime': int(init['intervalTime']), 'sessionNumber': int(init['sessionNumber']), 'endResponsable': init['startResponsable']})

                # Crear archivo CSV con cabeceras de informacion
                dirFile = csvFile.createFile(startTime, init)

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
        firebase.clean(module, converter.getTimestamp(), 'error', sys.exc_info()[0], sys.exc_info()[1])
