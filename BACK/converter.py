import datetime
import time

def finishDate(strDate, strTime):
    if (len(strTime) == 5):
        return datetime.datetime.strptime(strDate + " " + strTime, '%Y-%m-%d %H:%M')
    if (len(strTime) == 8):
        return datetime.datetime.strptime(strDate + " " + strTime , '%Y-%m-%d %H:%M:%S')

def nowDateTime():
    return datetime.datetime.now()

def getTimestamp():
    return time.time()
