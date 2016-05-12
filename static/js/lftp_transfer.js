/**
 * Created by agoldfarb on 4/22/2016.
 */


        var mb = 1048576;
        var focused = true;
        var XMLRequestTime = 1000;
        var updateTimer = null;

        window.onload = init;

        window.onfocus = function() {
            focused = true;
            XMLRequestTime = 1000;
            updateStatus();
            console.log("Tab got focus");
        };

        window.onblur = function() {
            focused = false;
            XMLRequestTime = 10000;
            if (updateTimer != null){
                window.clearTimeout(updateTimer);
                updateStatus();
            }
            console.log("Tab lost focus");
        };

        function init(){
            updateStatus();
        }

        function updateStatus() {
            updateTimer = setTimeout(updateStatus, XMLRequestTime);
            request = new XMLHttpRequest();
            request.onreadystatechange = updateTran;
            request.open("GET", "/transfer_info", true);
            request.send(null);
        }

        function updateTran() {
            
            if ((request.readyState == 4) && (request.status == 200)) {
                result = request.responseText;
                var data = JSON.parse(result);
                $("#Status")[0].innerHTML = data.status;
                setDownloadInfo(0, data.info[0], data.status);
                setDownloadInfo(1, data.info[1], data.status);
            }
        }

        function setDownloadInfo(dl_num, info, status){

            dl_num = parseInt(dl_num);
            var target = "#dl_" + dl_num;
            var Element = $(target);

                if(info != null){
                    Element.find("#Name")[0].innerHTML = "Name: " + info.name;
                    Element.find("#Speed")[0].innerHTML ="Speed: " + info.speed;
                    Element.find("#Size")[0].innerHTML = "Size: " + (Math.round(info.current_size/mb*1000)/1000) + "MB out of " + (Math.round(info.total_size/mb*1000)/1000) + "MB";
                    Element.find("#ETA")[0].innerHTML = "ETA: " + info.eta;

                    setProgBarValue(target + " #pb", info.percent);
                    Element.collapse('show');
                }else{
                    Element.collapse('hide');
                    Element.find("#Name")[0].innerHTML = "Name: ";
                    Element.find("#Size")[0].innerHTML ="Size: ";
                    Element.find("#Speed")[0].innerHTML = "Speed: ";
                    Element.find("#ETA")[0].innerHTML = "ETA: ";

                    setProgBarValue(target + " #pb", "0");
                }
        }

        function setProgBarValue(target, value) {
            value = parseInt(value);
            $(target).css("width", value +"%").attr('aria-valuenow', value);
            var span = $(target).find('span');
            if (value == 0){
                span.text("");
            }else{
                span.text(value + " %");
            }

        }
