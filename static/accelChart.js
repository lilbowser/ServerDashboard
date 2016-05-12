/**
 * Created by Administrator on 4/25/2016.
 */
/**
 * Created by jgoldfarb on 4/22/2016.
 */
function addToArray(array, value) {if(array.length > xAxisLength) {array.shift();}array.push(value);}
function getMaxOfArray(numArray) {var max = Math.max.apply(null, numArray);var min = Math.min.apply(null, numArray);return Math.max(Math.abs(max),Math.abs(min));}
function draw(dataX, dataY, dataZ) {
    if (null==canvas || !canvas.getContext) return;
    var axes={}, ctx=canvas.getContext("2d");
    axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
    axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
    axes.scale = 40/getMaxOfArray(dataX.concat(dataY, dataZ));  // 40 pixels from x=0 to x=1
    axes.doNegativeX = true;
    clearCanvas(ctx, canvas);
    showAxes(ctx,axes);
    funArray(ctx,axes,dataX,"rgb(11,153,11)",1);
    funArray(ctx,axes,dataY,"rgb(255,0,0)",1);
    funArray(ctx,axes,dataZ,"rgb(0,0,255)",1);
}
function clearCanvas(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    var w = canvas.width;
    canvas.width = 1;
    canvas.width = w;
}
function funArray (ctx,axes,array,color,thick) {
    var xx, yy, dx=1, x0=axes.x0, y0=axes.y0, scale=axes.scale;
    var iMax = Math.round((ctx.canvas.width-x0)/dx);
    var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;
    for (var i=0; i<= array.length; i++){
        xx = dx*i;
        yy = scale*array[i];
        if (i==iMin) ctx.moveTo(0+xx,y0-yy);
        else         ctx.lineTo(0+xx,y0-yy);
    }
    ctx.stroke();
}
function funGraph (ctx,axes,func,color,thick) {
    var xx, yy, dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;
    var iMax = Math.round((ctx.canvas.width-x0)/dx);
    var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;
    for (var i=iMin;i<=iMax;i++) {
        xx = dx*i; yy = scale*func(xx/scale);
        if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
        else         ctx.lineTo(x0+xx,y0-yy);
    }
    ctx.stroke();
}
function showAxes(ctx,axes) {
    var x0=axes.x0, w=ctx.canvas.width;
    var y0=axes.y0, h=ctx.canvas.height;
    var xmin = axes.doNegativeX ? 0 : x0;
    ctx.beginPath();
    ctx.strokeStyle = "rgb(128,128,128)";
    ctx.moveTo(xmin,y0); ctx.lineTo(w,y0);  // X axis
    ctx.moveTo(x0,0);    ctx.lineTo(x0,h);  // Y axis
    ctx.stroke();
}