import csv

fieldNames = ['timestamp', 'Te', 'Ti', 'Hi', 'He', 'TObjInt', 'TObjExt']
keys = []


def createFile(start, info):
    # Crear nombre del archivo
    nameFile = 'S-' + str(info['sessionNumber']) + '_' + str(info['material']) + '_' + str(start) + '.csv'
    # Crear cabeceras con informacion 
    for key in info:
        keys.append(key)  
    with open(nameFile, 'a') as csvfile:
        write = csv.DictWriter(csvfile, fieldnames = keys)
        write.writeheader()
        write.writerow(info)
        write = csv.DictWriter(csvfile, fieldnames = fieldNames)
        write.writeheader()
    return nameFile

def writeData(file, data):
    with open(file, 'a') as csvfile:
        write = csv.DictWriter(csvfile, fieldnames = fieldNames)
        write.writerow(data)
    print "escrito con exito"