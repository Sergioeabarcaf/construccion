import datetime
import time
import socket

# ---------------------------------------------------------------------------------------
# Utilidades para tiempo
# ---------------------------------------------------------------------------------------

# Retornar el
def finishDate(strDate, strTime):
    if (len(strTime) == 5):
        return datetime.datetime.strptime(strDate + " " + strTime, '%Y-%m-%d %H:%M')
    if (len(strTime) == 8):
        return datetime.datetime.strptime(strDate + " " + strTime , '%Y-%m-%d %H:%M:%S')

def nowDateTime():
    return datetime.datetime.now()

def getTimestamp():
    return time.time()

# ---------------------------------------------------------------------------------------
# Utilidades para conexiones
# ---------------------------------------------------------------------------------------

# Funcion para validar la conexion a internet
def conection():
    test = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        test.connect(('www.google.com',80))
        test.close()
        return True
    except:
        test.close()
        return False

# ---------------------------------------------------------------------------------------
# Utilidades para maxmos y minimos
# ---------------------------------------------------------------------------------------

# Funcion para colocar valores por defecto para extreme
def cleanExtreme(module, moduleSession):
    extreme = {
        module: {
            'max':{'Ti': -1000, 'Hi': -1000, 'Te': -1000, 'He': -1000 },
            'min':{'Ti': 1000, 'Hi': 1000, 'Te': 1000, 'He': 1000 }
        }
    }
    if (moduleSession == 0):
        extreme[module]['max'].update({'TObjInt': -1000, 'TObjExt': -1000})
        extreme[module]['min'].update({'TObjInt': 1000, 'TObjExt': 1000})
    elif (moduleSession == 2):
        extreme[module]['max'].update({'TObjInt': -1000})
        extreme[module]['min'].update({'TObjInt': 1000})
    return extreme

# Funcion para actualizar los maximos y minimos
def maxAndMin(extreme, data, moduleSession):
    # Comparar maximos
    if extreme['max']['Ti'] < data['Ti']:
        extreme['max']['Ti'] = data['Ti']
    if extreme['max']['Hi'] < data['Hi']:
        extreme['max']['Hi'] = data['Hi']
    if extreme['max']['Te'] < data['Te']:
        extreme['max']['Te'] = data['Te']
    if extreme['max']['He'] < data['He']:
        extreme['max']['He'] = data['He']
    # Comparar minimos
    if extreme['min']['Ti'] > data['Ti']:
        extreme['min']['Ti'] = data['Ti']
    if extreme['min']['Hi'] > data['Hi']:
        extreme['min']['Hi'] = data['Hi']
    if extreme['min']['Te'] > data['Te']:
        extreme['min']['Te'] = data['Te']
    if extreme['min']['He'] > data['He']:
        extreme['min']['He'] = data['He']
    # Comparaciones segun modulos usados
    if (moduleSession == 0):
        # maximos
        if extreme['max']['TObjInt'] < data['TObjInt']:
            extreme['max']['TObjInt'] = data['TObjInt']
        if extreme['max']['TObjExt'] < data['TObjExt']:
            extreme['max']['TObjExt'] = data['TObjExt']
        # Minimos
         if extreme['min']['TObjInt'] < data['TObjInt']:
            extreme['min']['TObjInt'] = data['TObjInt']
        if extreme['min']['TObjExt'] < data['TObjExt']:
            extreme['min']['TObjExt'] = data['TObjExt']
    elif (moduleSession == 2):
        # maximos
        if extreme['max']['TObjInt'] < data['TObjInt']:
            extreme['max']['TObjInt'] = data['TObjInt']
        # Minimos
         if extreme['min']['TObjInt'] < data['TObjInt']:
            extreme['min']['TObjInt'] = data['TObjInt']

    return extreme
