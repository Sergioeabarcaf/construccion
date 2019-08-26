import sys
import firebaseOwn as firebase
import converter
import time
import csvFile
import conection
import sensorSht31
import sensorMlx90614
import os

# Cambiar segun el modulo donde se esta utilizando, pudiendo ser thermal o sound
module = 'thermal'

# Funcion para obtener datos de medicion.
def getData(dirFile, module, sessionNumber):
    data = {'timestamp': converter.getTimestamp()}
    data.update(sensorSht31.getTempHum(0x44))
    data.update(sensorSht31.getTempHum(0x45))
    data.update(sensorMlx90614.getTempObj())

    firebase.pushData(module, sessionNumber, data)
    csvFile.writeData(dirFile, data)

    return data

# Funcion para actualizar los maximos y minimos
def maxAndMin(extreme, data):
    # Comparar maximos
    if extreme['max']['Ti'] < data['Ti']:
        extreme['max']['Ti'] = data['Ti']
    if extreme['max']['Hi'] < data['Hi']:
        extreme['max']['Hi'] = data['Hi']
    if extreme['max']['Te'] < data['Te']:
        extreme['max']['Te'] = data['Te']
    if extreme['max']['He'] < data['He']:
        extreme['max']['He'] = data['He']
    if extreme['max']['TObj'] < data['TObj']:
        extreme['max']['TObj'] = data['TObj']
    # Comparar minimos
    if extreme['min']['Ti'] > data['Ti']:
        extreme['min']['Ti'] = data['Ti']
    if extreme['min']['Hi'] > data['Hi']:
        extreme['min']['Hi'] = data['Hi']
    if extreme['min']['Te'] > data['Te']:
        extreme['min']['Te'] = data['Te']
    if extreme['min']['He'] > data['He']:
        extreme['min']['He'] = data['He']
    if extreme['min']['TObj'] > data['TObj']:
        extreme['min']['TObj'] = data['TObj']
    # Retornar nuevo valores de extreme
    return extreme

# Funcion para colocar valores por defecto para extreme
def cleanExtreme(module):
    extreme = {
        module: {
            'max':{
                'Ti': -1000,
                'Hi': -1000,
                'Te': -1000,
                'He': -1000,
                'TObj': -1000
            },
            'min':{
                'Ti': 1000,
                'Hi': 1000,
                'Te': 1000,
                'He': 1000,
                'TObj': 1000
            }
        }
    }

    return extreme

# Detener la ejecucion de cualquier sesion al iniciar el programa
firebase.clean(module, converter.getTimestamp(), 'start')

while(True):
    # try:
    # Validar que exista conexion a internet
    if( conection.valid() ):
        # Consultar si se ha enviado una nueva sesion desde la web app
        init = firebase.start(module)
        if init != 0:
            print(init)
            
            # Colocar valores de extreme por defecto
            extreme = cleanExtreme(module)

            # Obtener intervalo de tiempo entre mediciones, se restan 2 debido al procesamiento y envio de datos
            interval = int(init['timeInterval']) - 2

            # Crear infoLarge y almacenar en info/large de firebase
            infoLarge = {'material': init['material'], 'startResponsable': init['startResponsable'], 'startTimestamp': str(converter.getTimestamp()), 'module': int(init['module']), 'timeInterval': int(init['timeInterval']), 'sessionNumber': int(init['sessionNumber']), 'endResponsable': init['startResponsable'], 'endType': int(init['endType'])}
            firebase.sendInfoLarge(infoLarge)

            # Crear infoShort y actualizar en info/short de firebase
            infoShort = {'material': init['material'], 'startResponsable': init['startResponsable'], 'startTimestamp': infoLarge['startTimestamp'], 'sessionNumber': int(init['sessionNumber']), 'status': 1, 'module': int(init['module'])}
            firebase.sendInfoShort(infoShort)

            # Crear archivo CSV con tiempo actual y cabeceras de informacion
            dirFile = csvFile.createFile(converter.getTimestamp(), init)

            # Funcionamiento en modo manual
            if int(init['endType']) == 0:
                print('manual')
                # Esperar a que el usuario termine desde la WebApp
                while (firebase.endManualFromWebApp(infoShort['sessionNumber'])):
                    data = getData(dirFile, module, infoShort['sessionNumber'])
                    # Actualizar los valores maximos y minimos de extreme
                    extreme[module] = maxAndMin(extreme[module], data)
                    # Pausar ejecucon en el intervalo definido
                    time.sleep(interval)
            # Funcionamiento en modo automatico
            elif int(init['endType']) == 1:
                print('automatico')
                # Obtener fecha y hora de finalizacion en tipo Date.
                finishedDate = converter.finishDate(init['endDate'], init['endTime'] )
                # Mientras hora actual sea menor o igual a finishedDate y el usuario no
                # haya terminado desde la aplicacion, realizar mediciones en los intervalos
                while( finishedDate >= converter.nowDateTime() and firebase.endManualFromWebApp(infoShort['sessionNumber']) ):
                    data = getData(dirFile, module, infoShort['sessionNumber'])
                    # Actualizar los valores maximos y minimos de extreme
                    extreme[module] = maxAndMin(extreme[module], data)
                    # Pausar ejecucion en el intervalo definido
                    time.sleep(interval)
                print('Finalizado por tiempo')
            # Subir archivo CSV a storage
            name = "python3 /home/pi/construccion/BACK/upload.py 'mediciones' " + str(dirFile) + " " + str(dirFile)
            print name
            os.system(name)
            url = 'https://storage.googleapis.com/mediciones/' + str(dirFile)
            # Actualizar la infoLarge con endTimestamp y url en firebase
            firebase.updateInfoLarge(int(infoLarge['sessionNumber']), {'endTimestamp': converter.getTimestamp(), 'url': url, 'extreme': extreme})
            # Almacenar la infomacion en firebase y finalizar medicion
            firebase.execManualEnd(module, infoShort['sessionNumber'], int(infoShort['module']))
            # Limpiar infoLarge
            infoLarge.clear()
# Si existe un error, enviar el timestamp del error a firebase y el tipo de error
    # except:
    #     print sys.exc_info()
    #     firebase.clean(module, converter.getTimestamp(), 'error', str(sys.exc_info()[0]), str(sys.exc_info()[1]))
    #     time.sleep(5)
