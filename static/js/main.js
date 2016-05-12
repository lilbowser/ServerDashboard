//Main JS for Dashboard

// window.onload = init;

$(document).ready(function(){
    $('#myTabs a').click(function (e) {
        e.preventDefault();

        var url = $(this).attr("data-url");
        var href = this.hash;
        var pane = $(this);

        // ajax load from data-url
        $(href).load(url,function(result){
            pane.tab('show');
        });
    });

    // load first tab content
    $('#home').load($('.active a').attr("data-url"),function(result){
      $('.active a').tab('show');
    });

});
