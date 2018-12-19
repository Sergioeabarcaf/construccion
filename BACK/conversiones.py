def intervalToSeconds(interval):
    interval = interval.encode('ascii','ignore')
    temp = interval.split(":")
    seconds = (int(temp[0]) * 3600 ) + (int(temp[1]) * 60 ) + (int(temp[2]) * 1 )
    return seconds

    
