import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json
import converter

cred = credentials.Certificate('/home/pi/construccion/BACK/names.json')
default_app = firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://construccion-30739.firebaseio.com/'
})

# =================    0     ===================
# cerrar todas las sesiones y almacenar registro de hora que se inicio el programa
def clean(module, time, dir, error = False, arg = ''):
    # Limpiar init en Firebase
    db.reference('init/' + module).set('null')
    # Limpiar status del modulo
    db.reference('system/status/' + module + '/value').set(0)
    db.reference('system/status/' + module + '/sessionNumber').set(-1)
    # Si es error, enviar a ruta de Errores con mensaje de error, si no, enviar a log de start
    if (dir == 'start'):
        db.reference('log/' + dir ).push(time)
    elif (dir == 'error'):
        db.reference('log/' + dir ).push({'value': error, 'timestamp': time, 'arg': arg})


# =================    1     ===================
# validar si se inicia una nueva sesion.
def start(module):
    dir = 'init/' + module
    data = db.reference(dir).get()
    if data == None:
        return 0
    elif data == 'null':
        return 0
    else:
        # Actualizar valores cuando se usan ambos modulos o solo uno
        # uso de solo modulo termico
        if int(data['module']) == 0:
            db.reference('system/status/thermal').set({'value': 2, 'sessionNumber': int(data['sessionNumber'])})
        # Uso de solo modulo acustico
        elif int(data['module']) == 1:
            db.reference('system/status/sound').set({'value': 2, 'sessionNumber': int(data['sessionNumber'])})
        # Uso de ambos modulos
        elif int(data['module']) == 2:
            db.reference('system/status/thermal').set({'value': 2, 'sessionNumber': int(data['sessionNumber'])})
            db.reference('system/status/sound').set({'value': 2, 'sessionNumber': int(data['sessionNumber'])})
            db.reference('system/status/both').set({'value': 2, 'sessionNumber': int(data['sessionNumber'])})
        return data

def sendInfoShort(infoShort):
    dir = 'info/short/S-' + str(infoShort['sessionNumber'])
    db.reference(dir).set(infoShort)

def sendInfoLarge(infoLarge):
    print infoLarge
    dir = 'info/large/S-' + str(infoLarge['sessionNumber'])
    db.reference(dir).set(infoLarge)

def updateInfoLarge(sessionNumber, infoUpdate):
    dir = 'info/large/S-' + str(sessionNumber)
    db.reference(dir).update(infoUpdate)

# =================    2     ===================
# Enviar data a firebase
def pushData(module, sessionNumber, data):
    dir = 'data/S-' + str(sessionNumber) + '/' + module
    print data
    db.reference(dir).push(data)


# =================    3     ===================
# Detener la ejecucion del programa
def execManualEnd(ownModule, infoShort, usedModule):
    # Limpiar init/module
    db.reference('init/' + ownModule).set('null')
    # Cambiar estado en infoShort y en Status del modulo
    db.reference('info/short/S-' + str(infoShort['sessionNumber']) + '/status').set(0)
    # en caso de usar solo el modulo termico
    if usedModule == 0:
        db.reference('system/status/thermal').set({'value': 0, 'sessionNumber': -1})
    # en caso de usar solo el modulo acustico
    elif usedModule == 1:
        db.reference('system/status/sound').set({'value': 0, 'sessionNumber': -1})
    # en caso de usar ambos modulos
    elif usedModule == 2:
        db.reference('system/status').set({'thermal': {'value': 0, 'sessionNumber': -1}, 'sound': {'value': 0, 'sessionNumber': -1}, 'both': {'value': 0, 'sessionNumber': -1}})

# =================    4     ===================
# Validar si fue detenido desde la web app la medicion
def endManualFromWebApp(module):
    dir = 'system/status/' + module + '/value'
    data = db.reference(dir).get()
    # Si recibe el valor 3 es finalizacion web
    if data == 3:
        print 'finalizado desde web'
        return False
    else:
        return True