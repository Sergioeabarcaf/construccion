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
def clean(module, time, dir, error = False, arg = 'False'):
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
        # Si existen datos en init, configurar infoShort, actualizar estado en system
        short = {
            'sessionNumber': int(data['sessionNumber']),
            'startResponsable': data['startResponsable'],
            'startTimestamp': data['startTimestamp'],
            'material': data['material'],
            'status': 1
        }
        print short
        db.reference('system/status/' + module).set({'value': 2, 'sessionNumber': short['sessionNumber']})
        db.reference('info/short/s-' + data['sessionNumber']).set(short)
        return data


# =================    2     ===================
# Enviar data a firebase
def pushData(module, sessionNumber, data):
    dir = 'data/S-' + sessionNumber + '/' + module
    print data
    db.reference(dir).push(data)


# =================    3     ===================
# Detener de manera manual (web app) la ejecucion del programa
def execManualEnd(infoLarge):
    # Limpiar init/module
    db.reference('init/' + infoLarge['module']).set('null')
    # Cambiar estado en infoShort y en Status del modulo
    db.reference('info/short/S-' + infoLarge['sessionNumber'] + '/status').set(0)
    db.reference('system/status/' + infoLarge['module']).set({'value': 0, 'sessionNumber': -1})
    # Enviar informacion large
    db.reference('info/large/S-' + infoLarge['sessionNumber']).set(infoLarge)


# =================    4     ===================
# Validar si fue detenido desde la web app la medicion
def endManualFromWebApp(module):
    dir = 'system/status/' + module + '/value'
    data = db.reference(dir).get()
    # Si recibe el valor 3 es finalizacion web
    if data == 3:
        return False
    else:
        return True
        
