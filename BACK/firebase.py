import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json

cred = credentials.Certificate('/media/Datos/proyectosSergio/github/construccion/BACK/names.json')
default_app = firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://construccion-30739.firebaseio.com/'
})

# =================    0     ===================
# cerrar todas las sesiones y almacenar registro de hora que se inicio el programa
def first(time):
    db.reference('init').set('null')
    db.reference('system/python').set(False)
    db.reference('system/start').set(False)
    db.reference('log/start').push(time)

def getNumber():
    n = db.reference('log/n').get()
    if (n != None):
        db.reference('log/n').set(n + 1)
        return n + 1
    else:
        db.reference('log/n').set(0)
        return 0

def last(time):
    db.reference('init').set('null')
    db.reference('system/python').set(False)
    db.reference('system/start').set(False)
    db.reference('log/error').push(time)


# =================    1     ===================

#validar si se inicia una nueva sesion.
def start():
    dir = 'init'
    data = db.reference(dir).get()
    if data == None:
        return 0
    elif data == 'null':
        return 0
    else:
        db.reference('system/python').set(True)
        return data

#Obtener el numero de la session a crear.
def numberSession():
    dir = 'system/lastSession'
    data = db.reference(dir).get()
    if data != None:
        db.reference('system/lastSession').set(int(data) + 1)
        return data +1
    else:
        db.reference('system/lastSession').set(0)
        return 0

#Almacenar los datos del formulario en sesion.
def setInfoSession(dir, info, startTime):
    dir = str(dir) + '/info'
    info.update({'timeStart':startTime})
    db.reference(dir).set(info)



# =================    2     ===================
# Enviar data a firebase 
def pushData(dir, data):
    dir = dir + '/data'
    print data
    db.reference(dir).push(data)

# =================    3     ===================
# Detener de manera manual (web app) la ejecución del programa 
def execManualEnd():
    dir = 'system/start'
    dir2 = 'init'
    db.reference(dir).set(False)
    db.reference(dir2).set('null')


# =================    4     ===================
#Validar si fue detenido desde la web app la medición
def finManual():
    dir = 'system/start'
    data = db.reference(dir).get()
    if data == True:
        return True
    else:
        db.reference('system/python').set(False)
        return False
