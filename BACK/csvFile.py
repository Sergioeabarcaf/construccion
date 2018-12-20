import csv

fieldNames = ['timestamp', 'Te', 'Ti', 'Hi', 'He']
keys = []


def createFile(session, material, start, info):
    session = session.split('/')[1]
    nameFile = str(session) + '_' + str(material) + '_' + str(start) + '.csv'
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