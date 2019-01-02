def intervalToSeconds(interval):
    interval = interval.encode('ascii','ignore')
    temp = interval.split(":")
    i = 2
    seconds = 0
    for x in range (0,len(temp)):
        seconds += ( int(temp[x]) * pow(60, i) )
        i -= 1
    return seconds

def finishedTimeInSeconds(days, hours, minutes):
    return (int(days * 1440) + int(hours * 60) + int(minutes)) * 60
    
