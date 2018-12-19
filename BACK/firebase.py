import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json

cred = credentials.Certificate('/media/Datos/proyectosSergio/github/construccion/BACK/names.json')
default_app = firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://construccion-30739.firebaseio.com/'
})

def getSession():
    dir = 'sessiones/'
    ref = db.reference(dir)
    data = ref.get()
    i = 0
    for sesion in data:
        if sesion['estado'] == 1:
            print data[i]
            return 0
        i+=1
    return 1

def start():
    dir = 'init'
    ref = db.reference(dir)
    data = ref.get()
    if data != None:
        db.reference('system/python').set(True)
        return data
    else:
        return 0

def finManual():
    dir = 'system/start'
    data = db.reference(dir).get()
    if data == True:
        return data
    else:
        db.reference('system/python').set(False)
        return data