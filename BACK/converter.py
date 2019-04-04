import datetime
import time

def finishDate(strDate):
    return datetime.datetime.strptime(strDate, '%Y-%m-%d %H:%M')

def nowDateTime():
    return datetime.datetime.now()

def getTimestamp():
    print ( datetime.datetime.fromtimestamp( time.time() ) )
    return datetime.datetime.fromtimestamp(time.time()).strftime('%Y/%m/%d-%H:%M:%S')


