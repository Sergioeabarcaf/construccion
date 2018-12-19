import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json

cred = credentials.Certificate('/media/Datos/proyectosSergio/github/construccion/BACK/names.json')
default_app = firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://construccion-30739.firebaseio.com/'
})

# =================    1     ===================

#validar si se inicia una nueva sesion.
def start():
    dir = 'init'
    data = db.reference(dir).get()
    if data != None:
        db.reference('system/python').set(True)
        return data
    else:
        return 0

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
def setInfoSession(dir,info):
    dir = str(dir) + '/info'
    db.reference(dir).set(info)



# =================    2     ===================
def pushData(dir, data):
    dir = dir + '/data'
    print data
    db.reference(dir)



# =================    4     ===================

#Detener ejecucion de forma manual
def finManual():
    dir = 'system/start'
    data = db.reference(dir).get()
    if data == True:
        return data
    else:
        db.reference('system/python').set(False)
        return data