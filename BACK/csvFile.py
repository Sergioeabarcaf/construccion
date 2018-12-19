import csv

fieldNames = ['timestamp', 'Te', 'Ti', 'Hi', 'He']

def createFile(session, material, start):
    session = session.split('/')[1]
    nameFile = str(session) + '_' + str(material) + '_' + str(start) + '.csv'
    with open(nameFile, 'a') as csvfile:
        write = csv.DictWriter(csvfile, fieldnames = fieldNames)
        write.writeheader()
    return nameFile

def writeData(file, data):
    with open(file, 'a') as csvfile:
        write = csv.DictWriter(csvfile, fieldnames = fieldNames)
        write.writerow(data)
    print "escrito con exito"