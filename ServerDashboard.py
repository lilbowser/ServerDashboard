from random import SystemRandom as random
import logging
import time

from flask import Flask, render_template, json

import diskSpace
import processMon

app = Flask(__name__)


@app.route('/pony')
def hello_pony():
    return "Hello Equestria"


@app.route('/')
def mainRoute():
    return tran()


@app.route('/diskdata')
def disk_data_rand():
    a1 = random().randint(1, 99)
    a2 = random().randint(1, 99)
    return "{},{},{},{}".format("C:", a1, "D:", a2)


@app.route('/transfers')
def tran():
    return render_template('transfer.html')


@app.route('/transfersa')
def tranajax():
    return render_template('transfer_AJAX.html')


@app.route('/transfer_info')
def transfer():
    # with open("lftpTransferInfo.json", 'r') as info:
    try:
        with open("json.json", 'r') as info:
            data = json.load(info)
            jsony = json.jsonify(data)
            return jsony
    except:
        retry_transfer("json.json")


def retry_transfer(file_name):
    time.sleep(0.2)
    try:
        with open(file_name, 'r') as info:
            data = json.load(info)
            jsony = json.jsonify(data)
            return jsony
    except:
        logging.exception("Transfer Failed")
        print("transfer failed")


@app.route('/disk')
def disp_disks():
    return render_template('diskSpaceDash.html')


@app.route('/diska')
def disp_disks_ajax():
    return render_template('diskSpaceDash_AJAX.html')


@app.route('/diskd')
def disp_disks_debug():
    return render_template('diskSpace.html')


@app.route('/diskinfo')
def disk_info():
    drives = diskSpace.get_available_disks(True, 0)
    disks_info = []
    for drive in drives:
        diskinfo = diskSpace.get_free_space(drive, "GB")
        disks_info.append(diskinfo)

    return json.jsonify(results=disks_info)


@app.route('/diskspace')
def disk_space():
    drives = diskSpace.get_available_disks(True, 0)
    output = ""
    # print(len(drives))
    for drive in drives:
        # drive = drive.strip('\\')
        # drive = drive.lower()
        diskinfo = diskSpace.get_free_space(drive, "GB")
        output += "Drive: {}, Space: {} {} of {} {}. </br>".format(drive, diskinfo['free'], diskinfo['units'], diskinfo['total'], diskinfo['units'])
        # print(output)
        # print(os.path.isdir(drive))
    return output

@app.route("/processes")
def processes():
    return render_template('processes.html')

@app.route('/process_info')
def process_info():
    proc_info = processMon.check_processes_status()
    return json.jsonify(results=proc_info)


@app.route('/main')
def main_page():
    return render_template('main.html')
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
