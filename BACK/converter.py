import datetime

def finishDate(strDate):
    return datetime.datetime.strptime(strDate, '%Y-%m-%d %H:%M')

def nowDateTime():
    return datetime.datetime.now()


