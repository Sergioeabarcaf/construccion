import csv

keys = []

def getFieldNames(moduleSession):
    # fieldnames segun modulo utilizado
    if (moduleSession == 0):
        return ['timestamp', 'Te', 'Ti', 'Hi', 'He', 'TObjInt', 'TObjExt']
    elif (moduleSession == 1):
        return ['timestamp', 'Te', 'Ti', 'Hi', 'He']
    elif (moduleSession == 2):
        return ['timestamp', 'Te', 'Ti', 'Hi', 'He', 'TObjInt']


def createFile(start, info, moduleSession):
    # Crear nombre del archivo
    nameFile = 'S-' + str(info['sessionNumber']) + '_' + str(info['material']) + '_' + str(start) + '.csv'
    # Crear cabeceras con informacion 
    for key in info:
        keys.append(key)  
    with open(nameFile, 'a') as csvfile:
        write = csv.DictWriter(csvfile, fieldnames = keys)
        write.writeheader()
        write.writerow(info)
        write = csv.DictWriter(csvfile, fieldnames = getFieldNames(moduleSession))
        write.writeheader()
    return nameFile

def writeData(file, data):
    with open(file, 'a') as csvfile:
        write = csv.DictWriter(csvfile, fieldnames = getFieldNames(moduleSession))
        write.writerow(data)
    print "escrito con exito"