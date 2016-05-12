/**
* Created by Administrator on 5/2/2016.
*/


window.onload = init;
window.onresize = function () {
    Chart.defaults.global.legend.display = false;
    // Chart.defaults.global.tooltips.enabled = false;

};

function Disk_Chart(canvas, chart, name, used_space) {
    this.canvas = canvas;
    this.chart = chart;
    this.name = name;
    this.used_space = used_space;
}

var canvas = null;
var xAxisLength = null;
var myPieChart = null;
var charts = [];
var chartMap = {}; //mqp Name to chart-id
// var protoObject = new Disk_Chart("chart-area", myPieChart, "C:/", 78.2);

function init(){
    Chart.defaults.global.legend.display = false;
    // Chart.defaults.global.tooltips.enabled = false;

    // displayDonut();
    updateStatus();
}
function updateStatus() {
    setTimeout(updateStatus, 10000);
    request = new XMLHttpRequest();
    request.onreadystatechange = update;
    request.open("GET", "/diskinfo", true);
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
        data = data.results;

        var number_of_disks = data.length;

        for (var i = 0; i < number_of_disks; ++i) {
            var disk = data[i];
            var chart = find_chart(disk.folder);
            var free = parseFloat(disk.free);
            var total = parseFloat(disk.total);
            var used =  total - free;
            if (chart != null){
                updateChart(chart, [used, free]);
            }else{
                var canvasHolder = addNewCanvasDiv(disk.folder);

                var newChart = createNewDonut(disk.folder, used, free);
                // charts.push(newChart);
                chartMap[disk.folder] = newChart;
            }
            // updateText(disk.folder);
        }
    }
}

function updateChart(chart, newValues){
    chart.data.datasets[0].data = newValues;
    chart.update();
}

function updateText(name){
    // var chart = find_chart(name);
    // if(chart){
    //
    //     var canvas = chart.chart.canvas;
    //     var x = canvas.width / 2;
    //     var y = canvas.height / 2;
    //
    //     var context = chart.chart.ctx;
    //     context.font = '30pt Calibri';
    //     context.textAlign = 'center';
    //     context.fillStyle = 'blue';
    //     context.fillText('Hello World!', x, y);
    // }

    var root_ele = $(jq('#diskChart-' + name));

    if(root_ele){
        var textCanvas = root_ele.find('#text-area')[0];
        var x = textCanvas.width / 2;
        var y = textCanvas.height / 2;

        var context = textCanvas.getContext('2d');
        context.font = '30pt Calibri';
        context.textAlign = 'center';
        context.fillStyle = 'blue';
        context.fillText('Hello World!', x, y);
    }

}

function createNewDonut(name, used, free){
    var total = used+free;
    var percentage = ((used / total) * 100).toFixed(2) + "%";
    var data = {
    labels: [
        "Used",
        "Free"
    ],
    datasets: [
        {
            data: [used, free],
            backgroundColor: [
                "#FF6384",
                "#36A2EB"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB"
            ]
        }]
};
    console.log("Creating New Chart");

    var root_ele = $(jq('#diskChart-' + name));
    var chartCanvas = root_ele.find('#chart-area');
    var newPieChart = new Chart(chartCanvas,{

        type: 'doughnut',
        data: data,

        options:{
            responsive: true,
            title: {
                display: true,
                text: name + "  Used: " + percentage
            },
            animation:{
                animateScale: false,
                onComplete: function(animation) {
                           // console.log('animate!');
                            // addTitle(animation);
                        }
            },
            // cutoutPercentage:70,
            legend: {
                display: false,
                position: 'bottom',
                fullWidth: false
            },
            scales:{
                xAxes:[{
                    afterUpdate: function (scales) {
                    },
                    gridLines:{
                        display: false
                    },
                    ticks:{
                        display: false
                    },
                    scaleLabel:{
                        display: false
                    }
                }]
            }

        }

    });
    // charts.append(newPieChart);
    return newPieChart;
}

// function addTitle(ani) {
//             var ctx = ani.chartInstance.chart.ctx;
//             var canvas = ani.chartInstance.chart.canvas;
//             console.log("adding Text");
//             var canvasWidthvar = canvas.width();
//             var canvasHeight = canvas.height();
//             //this constant base on canvasHeight / 2.8em
//             var constant = 200;
//             var fontsize = (canvasHeight / constant).toFixed(2);
//             ctx.font = fontsize + "em Verdana";
//             ctx.textBaseline = "middle";
//             var total = 0;
//             $.each(data, function () {
//                 total += parseInt(this.value, 10);
//             });
//             // var tpercentage = ((data[0].value / total) * 100).toFixed(2) + "%";
//             var tpercentage = "C:/ - Miku";
//             var textWidth = ctx.measureText(tpercentage).width;
//             var txtPosx = Math.round((canvasWidthvar - textWidth) / 2);
//             ctx.fillText(tpercentage, txtPosx, canvasHeight / 2);
//         }


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
    myid = myid.replace('\\', '\\\\');
    myid = myid.replace(':', '\\3A ');
    // return "" + myid.replace( /(:|\.|\[|\]|,)/g, "" );
    return myid;
}

function displayDonut(options){
    console.log("Creating Chart");
    var pychart = document.getElementById("chart-area");
    myPieChart = new Chart(pychart,{
        onClick: function () {
            alert('click');
        },
        type: 'doughnut',
        data: data,
        // legendCallback: function (chart) {
        //     return "";
        // },
        options:{
            responsive: true,
            title: {
                display: true,
                text: 'C:\\'
            },
            animation:{
                animateScale: false,
                onComplete: function(animation) {
                            // console.log('animate!');
                    // addTitle(animation);
                }

            },
            // cutoutPercentage:70,
            legend: {
                display: false,
                position: 'bottom',
                fullWidth: false
            },
            scales:{
                xAxes:[{
                    afterUpdate: function (scales) {
                    },
                    gridLines:{
                        display: false
                    },
                    ticks:{
                        display: false
                    },
                    scaleLabel:{
                        display: false
                    }
                }]
            }

        }

    });
}

function getEvens(a) {
    var b = [];
    for (var i = 0; i < a.length; ++i) {
        if ((a[i] % 2) === 0) {
            b.push(a[i]);
        }
    }
    return b;
}

function getOdds(a){
    var b = [];
    for (var i = 0; i < a.length; ++i) {
        if ((a[i] % 2) === 1) {
            b.push(a[i]);
        }
    }
    return b;
}

function find_chart(name) {
    // for (var i=0; i<_charts.length; ++i){
    //     if( _charts[i].name == name) {
    //         return _charts[i];
    //     }
    // }
    if(chartMap[name]){
        return chartMap[name]
    }
    return null;
}

//
// function addTitle(ani) {
//     var ctx = ani.chartInstance.chart.ctx;
//     console.log("adding Text");
//     var canvasWidthvar = $('#chart-area').width();
//     var canvasHeight = $('#chart-area').height();
//     //this constant base on canvasHeight / 2.8em
//     var constant = 200;
//     var fontsize = (canvasHeight / constant).toFixed(2);
//     ctx.font = fontsize + "em Verdana";
//     ctx.textBaseline = "middle";
//     var total = 0;
//     $.each(data, function () {
//         total += parseInt(this.value, 10);
//     });
//             // var tpercentage = ((data[0].value / total) * 100).toFixed(2) + "%";
//     var tpercentage = "C:/ - Miku";
//     var textWidth = ctx.measureText(tpercentage).width;
//     var txtPosx = Math.round((canvasWidthvar - textWidth) / 2);
//     ctx.fillText(tpercentage, txtPosx, canvasHeight / 2);
// }
//
// $(document).ready(function(){
// var ctx = $('#chart-area').get(0).getContext("2d");
//
// var myDoughnut = new Chart(ctx,{
//     type: 'doughnut',
//     data: data,
//     options: {
//         animation:{
//             animateScale:true
//             },
//         responsive: true,
//         showTooltips: false,
//         percentageInnerCutout : 70,
//         segmentShowStroke : false,
//         beforeUpdate: function () {
//             console.log("in func");
//         },
//
//         afterFit: function() {
//             console.log("adding Text");
//             var chart_ele = $('#chart-area')
//             var canvasWidthvar = chart_ele.width();
//             var canvasHeight = chart_ele.height();
//             //this constant base on canvasHeight / 2.8em
//             var constant = 114;
//             var fontsize = (canvasHeight / constant).toFixed(2);
//             ctx.font = fontsize + "em Verdana";
//             ctx.textBaseline = "middle";
//             var total = 0;
//             $.each(data, function () {
//                 total += parseInt(this.value, 10);
//             });
//             var tpercentage = ((data[0].value / total) * 100).toFixed(2) + "%";
//             var textWidth = ctx.measureText(tpercentage).width;
//             var txtPosx = Math.round((canvasWidthvar - textWidth) / 2);
//             ctx.fillText("tpercentage", txtPosx, canvasHeight / 2);
//         }
//     }
// });
// });