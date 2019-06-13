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
def getData(dirFile, module, sessionNumber):
    data = {'timestamp': converter.getTimestamp()}
    data.update(sensor.getExterior())
    data.update(sensor.getInterior())

    firebase.pushData(module, sessionNumber, data)
    csvFile.writeData(dirFile, data)

# Detener la ejecucion de cualquier sesion al iniciar el programa
firebase.clean(module, converter.getTimestamp(), 'start')

while(True):
    # try:
    # Validar que exista conexion a internet
    if( conection.valid() ):
        # Consultar si se ha enviado una nueva sesion desde la web app
        init = firebase.start(module)
        if init != 0:
            # Obtener intervalo de tiempo entre mediciones, se restan 2 debido al procesamiento y envio de datos
            interval = int(init['timeInterval']) - 2

            # Crear infoLarge
            infoLarge = {'material': init['material'], 'startResponsable': init['startResponsable'], 'startTimestamp': str(converter.getTimestamp()), 'module': int(init['module']), 'timeInterval': int(init['timeInterval']), 'sessionNumber': int(init['sessionNumber']), 'endResponsable': init['startResponsable']}

            # Crear infoShort y actualizar en info/short de firebase
            infoShort = {'material': init['material'], 'startResponsable': init['startResponsable'], 'startTimestamp': infoLarge['startTimestamp'], 'sessionNumber': int(init['sessionNumber']), 'status': 1}

            # Crear archivo CSV con tiempo actual y cabeceras de informacion
            dirFile = csvFile.createFile(converter.getTimestamp(), init)

            # Funcionamiento en modo manual
            if init['endType'] == 0:
                # Esperar a que el usuario termine desde la WebApp
                while (firebase.endManualFromWebApp(module)):
                    getData(dirFile, module, init['sessionNumber'])
                    # 
                    # Comparar valores para almacenar maximos y minimos
                    # 
                    time.sleep(interval)
                # 
                # Subir archivo CSV a storage
                # 
                url = 'algo'
                # Actualizar la infoLarge con endTimestamp y url
                infoLarge.update({'endTimestamp': converter.getTimestamp(), 'url': url})
                # Almacenar la informacion y detener la medicion
                firebase.execManualEnd(infoLarge)
                # Limpiar infoLarge
                infoLarge.clear()

            # Funcionamiento en modo automatico
            elif init['endType'] == 1:
                # Obtener fecha y hora de finalizacion en tipo Date.
                finishedDate = converter.finishDate(init['finishedDate'], init['finishedTime'] )
                print finishedDate
                # Mientras hora actual sea menor o igual a finishedDate y el usuario no
                # haya terminado desde la aplicacion, realizar mediciones en los intervalos
                while( finishedDate >= converter.nowDateTime() and firebase.endManualFromWebApp(module) ):
                    getData(dirFile, module, init['sessionNumber'])
                    # 
                    # Comparar valores para almacenar maximos y minimos
                    # 
                    time.sleep(interval)
                    # 
                # Subir archivo CSV a storage
                # 
                url = 'algo'
                # Actualizar la infoLarge con endTimestamp y url
                infoLarge.update({'endTimestamp': converter.getTimestamp(), 'url': url})
                # Si el sistema se detuvo por comparacion de fecha, cerrar el registro de ejecucion en firebase
                if (finishedDate < converter.nowDateTime() ):
                    firebase.execManualEnd(infoLarge)
                    # Limpiar infoLarge
                    infoLarge.clear()
# Si existe un error, enviar el timestamp del error a firebase y el tipo de error
    # except:
    #     print sys.exc_info()
    #     firebase.clean(module, converter.getTimestamp(), 'error', str(sys.exc_info()[0]), str(sys.exc_info()[1]))
    #     time.sleep(5)
