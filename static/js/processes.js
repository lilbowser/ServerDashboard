/**
* Created by Administrator on 5/2/2016.
*/


window.onload = init;
window.onresize = function () {

};


function init(){
    updateStatus();
}
function updateStatus() {
    setTimeout(updateStatus, 10000);
    request = new XMLHttpRequest();
    request.onreadystatechange = update;
    request.open("GET", "/process_info", true);
    request.send(null);
}

function updateSimple(){
    if ((request.readyState == 4) && (request.status == 200)) {
        result = request.responseText;

        var used = parseFloat(result);
        var free = 100 - used;
        for (var i = 0; i < charts.length; ++i) {
            updateChart(charts[i], [used+i*10, free-i*10]);
        }
    }
}

function update() {
    // http://stackoverflow.com/questions/25510176/dynamically-add-bootstrap-rows-using-modulo
    if ((request.readyState == 4) && (request.status == 200)) {
        result = request.responseText;

        var data = JSON.parse(result);
        var hosts = data.results;

        for (var i = 0; i < hosts.length; i++) {
            var host_name = hosts[i]['name'];
            if(!findHostDiv(host_name)){
                addNewHost(host_name);
            }

            var processes = hosts[i]['process_data'];
            for (var j = 0; j < processes.length; j++) {
                var process_name = processes[j]['name'];
                var process_status = processes[j]['status'];
                if(!findProcessDiv(host_name, process_name)){
                    addNewProcess(process_name, host_name);
                }
                var procDiv =  $('#host-' + host_name).find(jq("#process-" + process_name));
                // $.find(jq("#process-" + process_name))[0].innerHTML = process_name + " is " + process_status;
                updateProcess(process_name, process_status);
            }
        }
    }
}

function updateProcess(proc_name, proc_status){
    var target = $.find(jq("#process-" + proc_name));

    if(proc_status == 'up'){
        $(target).find('#proc_name')[0].innerHTML = '<span class="bg-success">' + proc_name + '</span>';
        $(target).find('#proc_status')[0].innerHTML = '<span class="bg-success">' + proc_status + '</span>';
        $(target).find('#proc_button')[0].innerHTML = '<button type="button" class="btn btn-primary btn-xs">Bring '+proc_name+' down</button>';
    }else{
        $(target).find('#proc_name')[0].innerHTML = '<span class="bg-danger">' + proc_name + '</span>';
        $(target).find('#proc_status')[0].innerHTML = '<span class="bg-danger">' + proc_status + '</span>';
        $(target).find('#proc_button')[0].innerHTML = '<button type="button" class="btn btn-primary btn-xs">Bring '+proc_name+' up</button>';
    }


}

function addNewHost(hostname){
    // var element =
    // var newDiv = '<div class="col-sm-6 col-sm-offset-3 well" id="host-' + hostname + '"></div>';
    var colDiv = '<div class="col-sm-8 col-sm-offset-2">';
    var newDiv = '<table class="table table-striped">' +
        '<thead><tr><th style="text-align: center">Process</th><th style="text-align: center">Status</th><th style="text-align: center">Change Status</th></tr></thead>' +
        '<tbody id="host-' + hostname + '"></tbody></table></div>';

    $("#hosts").append(colDiv + newDiv);
    return $('#host-' + hostname);
}

function addNewProcess(proc_name, hostname){
    var hostDiv = $('#host-' + hostname);
    var divStart =
        '<tr id="process-' + proc_name + '">' +
            '<td id="proc_name"></td>' +
            '<td id="proc_status"></td>' +
            '<td id="proc_button"></td>'+
        '</tr>';
    // var newText = '<td id="name"></td>';//<p id="status"></p>';
    // var divEnd = '</div>';
    hostDiv.append(divStart);// + newText + divEnd);
    return hostDiv.find(jq("#process-" + proc_name));
}

function findHostDiv(hostname){
    var host = $('#hosts').find('#host-'+hostname);
    if (host.length > 0){
        return host;
    }
    return null;
}

function findProcessDiv(hostname, proc_name){
    var proc = $('#host-' + hostname).find(jq('#process-' + proc_name));
    if(proc.length > 0){
        return proc;
    }
    return null;
}

function addNewCanvasDiv(name){
    var divStart = '<div class="col-sm-3" id="diskChart-' + name + '">';
    // var div2Start = '<div class="wrapper">';
    var newCanvas = '<canvas id="chart-area" width="100%" height="100%"></canvas>';
    var newCanvas2 = '<canvas id="text-area" width="100%" height="100%"></canvas>';
    var divEnd = '</div>';
    $('#diskCharts').append(divStart + newCanvas + divEnd);
    return $(jq('#diskChart-' + name));
}

// function jq(myid) {
//     var id = myid.replace(/(:|\.|\[|\]|,)/g, "\\$1")
//     return "" + myid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
// }

function jq(myid) {
    // myid = myid.replace('\\', '\\\\');
    // myid = myid.replace(':', '\\3A ');
    return "" + myid.replace( /(:|\.|\[|\]|,)/g, "\\$1");
    // return myid;
}
