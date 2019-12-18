import sys
import os
import RPi.GPIO as GPIO
import firebaseOwn as firebase
import time
import csvFile
import conection
import sensorSht31
import sensorMlx90614
import utils

# Variables
module = 'thermal'
addrEnvInt = 0x44
addrEnvExt = 0x45
addrTempObjInt = 0x5a
addrTempObjExt = 0x5b
pinRelay = 7

# Configurar GPIO con relay
GPIO.setmode(GPIO.BOARD)
GPIO.setup(pinRelay, GPIO.OUT)

# Funcion para obtener datos de medicion y enviarlos a firebase y CSV.
# Enviar las direcciones donde se ubican los sensores
def getData(dirFile, module, sessionNumber, moduleSession):
    data = {'timestamp': utils.getTimestamp()}
    # Solo modulo termico
    if (opt == 0):
        data.update(sensorSht31.getTempHumInt(addrEnvInt))
        data.update(sensorSht31.getTempHumExt(addrEnvExt))
        data.update(sensorMlx90614.getTempObjInt(addrTempObjInt))
        data.update(sensorMlx90614.getTempObjExt(addrTempObjExt))
    # solo modulo acustico
    elif (opt == 1):
        data.update(sensorSht31.getTempHumInt(addrEnvInt))
        data.update(sensorSht31.getTempHumExt(addrEnvExt))
        data.update(sensorMlx90614.getTempObjInt(addrTempObjInt))
    # Ambos modulos
    elif (opt == 2):
        data.update(sensorSht31.getTempHumInt(addrEnvInt))
        data.update(sensorSht31.getTempHumExt(addrEnvExt))

    firebase.pushData(module, sessionNumber, data)
    csvFile.writeData(dirFile, data, moduleSession)
    return data


# Detener la ejecucion de cualquier sesion al iniciar el programa
firebase.clean(module, utils.getTimestamp(), 'start')
# Entregar energia al relay
GPIO.output(pinRelay, True)
# Lanzar aplicacion web
os.system("export DISPLAY=:0 && chromium-browser http://localhost --start-fullscreen &")

while(True):
    try:
        # Validar que exista conexion a internet
        if( utils.conection() ):
            # Consultar si se ha enviado una nueva sesion desde la web app
            init = firebase.start(module)
            if init != 0:
                print(init)
                # Obtener los modulos utilizados en la sesion
                moduleSession = int(init['module'])
                # Colocar valores de extreme por defecto
                extreme = utils.cleanExtreme(module, moduleSession)
                # Obtener intervalo de tiempo entre mediciones, se restan 2 debido al procesamiento y envio de datos
                interval = int(init['timeInterval']) - 2
                #Obtener temperatura maxima de exposicion del material
                tempMax = float(init['tempMax'])
                tempMaxTimestamp = 0
                # Crear infoLarge y almacenar en info/large de firebase
                infoLarge = {'material': init['material'], 'startResponsable': init['startResponsable'], 'startTimestamp': str(utils.getTimestamp()), 'module': moduleSession, 'timeInterval': int(init['timeInterval']), 'sessionNumber': int(init['sessionNumber']), 'endResponsable': init['startResponsable'], 'endType': int(init['endType'])}
                firebase.sendInfoLarge(infoLarge)
                # Crear infoShort y actualizar en info/short de firebase
                infoShort = {'material': init['material'], 'startResponsable': init['startResponsable'], 'startTimestamp': infoLarge['startTimestamp'], 'sessionNumber': int(init['sessionNumber']), 'status': 1, 'module': moduleSession}
                firebase.sendInfoShort(infoShort)
                # Crear archivo CSV con tiempo actual y cabeceras de informacion
                dirFile = csvFile.createFile(utils.getTimestamp(), init, moduleSession)
                # Url que almacena los CSV en Google Storage
                url = 'https://storage.googleapis.com/mediciones/' + str(dirFile)

                # Funcionamiento en modo manual
                if int(init['endType']) == 0:
                    print('manual')
                    # Esperar a que el usuario termine desde la WebApp
                    while (firebase.endManualFromWebApp(infoShort['sessionNumber'])):
                        data = getData(dirFile, module, infoShort['sessionNumber'], moduleSession)
                        # Actualizar los valores maximos y minimos de extreme
                        extreme[module] = utils.maxAndMin(extreme[module], data, moduleSession)
                        # Validar la temperatura maxima del material
                        if data['TObjExt'] > tempMax:
                            # Dejar de energizar el calefactor
                            GPIO.output(pinRelay, False)
                            # Almacenar el momento en el cual se deja de energizar el calefactor.
                            tempMaxTimestamp = utils.getTimestamp()
                        # Pausar ejecucon en el intervalo definido
                        time.sleep(interval)
                    print('Finalizado manual')

                # Funcionamiento en modo automatico
                elif int(init['endType']) == 1:
                    print('automatico')
                    # Obtener fecha y hora de finalizacion en tipo Date.
                    finishedDate = utils.finishDate(init['endDate'], init['endTime'] )
                    # Mientras hora actual sea menor o igual a finishedDate y el usuario no
                    # haya terminado desde la aplicacion, realizar mediciones en los intervalos
                    while( finishedDate >= utils.nowDateTime() and firebase.endManualFromWebApp(infoShort['sessionNumber']) ):
                        data = getData(dirFile, module, infoShort['sessionNumber'])
                        # Actualizar los valores maximos y minimos de extreme
                        extreme[module] = utils.maxAndMin(extreme[module], data, moduleSession)
                        # Validar la temperatura maxima del material
                        if data['TObjExt'] > tempMax:
                            # Dejar de energizar el calefactor
                            GPIO.output(pinRelay, False)
                            # Almacenar el momento en el cual se deja de energizar el calefactor.
                            tempMaxTimestamp = utils.getTimestamp()
                        # Pausar ejecucion en el intervalo definido
                        time.sleep(interval)
                    print('Finalizado automatico')
                    
                # Subir archivo CSV a storage
                name = "python3 /home/pi/construccion/BACK/upload.py 'mediciones' " + str(dirFile) + " " + str(dirFile)
                os.system(name)
                # Actualizar la infoLarge con endTimestamp y url en firebase
                firebase.updateInfoLarge(int(infoLarge['sessionNumber']), {'tempMaxTimestamp': tempMaxTimestamp, 'endTimestamp': utils.getTimestamp(), 'url': url, 'extreme': extreme})
                # Almacenar la infomacion en firebase y finalizar medicion
                firebase.execManualEnd(module, infoShort['sessionNumber'], int(infoShort['module']))
                # Limpiar infoLarge
                infoLarge.clear()
    # Si existe un error, enviar el timestamp del error a firebase y el tipo de error
    except:
        print sys.exc_info()
        firebase.clean(module, utils.getTimestamp(), 'error', str(sys.exc_info()[0]), str(sys.exc_info()[1]))
        time.sleep(5)
