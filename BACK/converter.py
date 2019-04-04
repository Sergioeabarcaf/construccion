import datetime
import time

def finishDate(strDate):
    return datetime.datetime.strptime(strDate, '%Y-%m-%d %H:%M')

def nowDateTime():
    return datetime.datetime.now()

def getTimestamp():
    return time.time()
