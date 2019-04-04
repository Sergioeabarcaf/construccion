import datetime

def finishDate(strDate):
    return datetime.datetime.strptime(strDate, '%Y-%m-%d')

def finishTime(strTime):
    return datetime.time.strftime(strTime, '%H-%M' )


