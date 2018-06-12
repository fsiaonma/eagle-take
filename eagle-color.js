function getTbody(callback) {
    var cframe = document.getElementById('cframe');
    var tbody = null;
    
    try {
        tbody = cframe.contentWindow.document.getElementById('tbody');
    } catch (e) {
        console.log(e)
    }

    if (tbody) {
        callback && callback(tbody);
    } else {
        var callFunc = getTbody;
        var inside = this;
        setTimeout(function() {
            callFunc.call(inside, callback);
        }, 300);
    }
}

function getResult(tbody) {
    var result = [];
    if (tbody.children && tbody.children.length) {
        for (var i = 1, len = tbody.children.length; i < len; ++i) {
            try {
                var obj = {}
                var trEle = tbody.children[i];
                var tdChildren = trEle.children;
                obj.time = tdChildren[0].innerHTML;
                obj.chapter = tdChildren[1].innerHTML;
                obj.result = (function() {
                    var resultUl = tdChildren[2].children[0];
                    var resultNO = [];
                    for (var j = 0, jLen = resultUl.children.length; j < jLen; ++j) {
                        for (var t = 0; t < 10; ++t) {
                            if (resultUl.children[j].className.indexOf('numsm' + t) > -1) {
                                resultNO.push(t);
                                break;
                            }
                        }
                    }
                    return resultNO;
                })();
                obj.total = [
                    tdChildren[3].innerText,
                    tdChildren[4].innerText,
                    tdChildren[5].innerText
                ];
                obj.tiger = tdChildren[6].innerText;
                obj.frontMiddleEnd = tdChildren[7].innerText;
                result.push(obj);
            } catch (e) {
                console.log(e);
            }
        }
    }
    return result;
}

function ansyData(callback) {
    document.getElementById('cframe').src = 'v/openNums.do';
    getTbody(function(tbody) {
        var result = getResult(tbody);
        callback && callback(result);
    });
}

function renderHTML(data) {
    var dialogEle = document.createElement("div");
    var colorArr = [],totalArr = [],tigerArr = [];
    dialogEle.id = 'eagle-color';
    dialogEle.style.width = '100%';
    dialogEle.style.height = '100%';
    dialogEle.style.position = 'absolute';
    dialogEle.style.backgroundColor = 'white';
    dialogEle.style.overflowY = 'scroll';
    dialogEle.style.zIndex = '1000';
    dialogEle.style.top = '0';
    dialogEle.style.left = '0';
    dialogEle.style.minWidth = '750px'
    for (var i = 0; i < data.length; i++) {
        colorArr[i] = [];
        totalArr[i] = [];
        tigerArr[i] = [];
        for (var j = 0; j < data[i].result.length; j++) {
            switch(data[i].result[j]){
                case 1:
                 colorArr[i].push('square-one');
                 break;
                case 2:
                colorArr[i].push('square-two');
                break;
                case 3:
                colorArr[i].push('square-three');
                break;
                case 4:
                colorArr[i].push('square-four');
                break;
                case 5:
                colorArr[i].push('square-five');
                break;
                case 6:
                colorArr[i].push('square-six');
                break;
                case 7:
                colorArr[i].push('square-seven');
                break;
                case 8:
                colorArr[i].push('square-eight');
                break;
                case 9:
                colorArr[i].push('square-nine');
                break;
                case 0:
                colorArr[i].push('square-zero')
                break;  
                }
        }
        for (var j = 0; j < data[i].total.length; j++) {
            switch(data[i].total[j]){
                case '大':
                totalArr[i].push('red');
                break;
                case '单':
                totalArr[i].push('red');
                break;
                default:
                totalArr[i].push('default');
                break;
            }
        }

        if (data[i].tiger === "龙") {
            tigerArr[i].push('red')
        }else if (data[i].tiger === "和"){
            tigerArr[i].push('green')
        }else tigerArr[i].push('default')
    }
    var strOne = '<div><style type="text/css" rel="stylesheet">.red{color:red}.green{color:green}.text-align-center{text-align:center}table, th, td{border: 1px solid lightgray;border-collapse: collapse;}table{margin:20px auto}.square-one{background-color: #ffff01}.square-two{background-color: #0088fe}.square-three{background-color: #4d4d4d}.square-four{background-color: #ff7302}.square-five{background-color: #81fff9}.square-six{background-color: #5202fb}.square-seven{background-color: #e3e3e3}.square-eight{background-color: #fe0000}.square-nine{background-color: #7d0005}.square-zero{background-color: #2fbd07}span[class^="square"]{width: 30px;height: 30px;display: inline-block;margin: 1px;text-align: center;font-size: 21px; color: white;text-shadow: 2px 2px 3px black;}.cancle{margin:0 10px;width:20px;cursor:pointer}</style><div class="cancle" onClick="document.body.removeChild(document.getElementById(\'eagle-color\'))">x</div><table><tr><th width="130px">期数</th> <th width="80px">时间</th><th width="180px" style="letter-spacing: 16px;text-align: center;padding:0 0 0 16px">一二三四五</th><th width="80px">总和</th><th width="50px">龙虎</th></tr>';
    var strTwo = '';
    for (var i = 0; i < data.length; i++) {
        strTwo += '<tr><td class="text-align-center">'+data[i].chapter+'</td><td class="text-align-center">'
        +data[i].time+'</td><td class="text-align-center"><span class="'+colorArr[i][0]+'">'+data[i].result[0]+'</span><span class="'+colorArr[i][1]+'">'+data[i].result[1]+'</span><span class="'+colorArr[i][2]+'">'+data[i].result[2]+'</span><span class="'+colorArr[i][3]+'">'+data[i].result[3]+'</span><span class="'+colorArr[i][4]+'">'+data[i].result[4]+
        '</span></td><td class="text-align-center">'+data[i].total[0]+'<span style="padding:0 5px" class="'+totalArr[i][1]+'">'+data[i].total[1]+'</span>'+'<span class="'+totalArr[i][2]+'">'+data[i].total[2]+'</span>'+'</td><td class="text-align-center   '+tigerArr[i]+'">'+data[i].tiger+'</td></tr>'
    }
    dialogEle.innerHTML = strOne+strTwo+'</table></div>';

    document.body.appendChild(dialogEle);
}

ansyData(function(data) {
    renderHTML(data);
});
