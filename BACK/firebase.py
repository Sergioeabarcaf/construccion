import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import json

cred = credentials.Certificate('/media/Datos/proyectosSergio/github/construccion/BACK/names.json')
default_app = firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://construccion-30739.firebaseio.com/'
})

lala = ["S00001","S00100","S00002","S00100"]
lala.sort()
print lala

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

while getSession() == 1:
    print "hola"