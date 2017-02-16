
function toData(dateTime) {
var dateTime = dateTime.split(" ");//dateTime[0] = date, dateTime[1] = time
var date = dateTime[0].split("-");
var dataFinal = date[2]+"/"+date[1];
return dataFinal;   
}

function toHora(Time) {
var Time = Time.split(" ");//dateTime[0] = date, dateTime[1] = time
var time = Time[1].split(":");
var timeFinal = time[0]+":"+time[1];
return timeFinal;    
}


