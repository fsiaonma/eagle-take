function hasClass(elem, cls) {
  cls = cls || '';
  if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
  return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}

function ansyData(callback) {
    var sscSys = document.getElementById('ssc_sys');
    sscSys.click();

    setTimeout(function() {
        var as = document.getElementsByTagName('a');
        for (var i = 0; i < as.length; ++i) {
            if (as[i].getAttribute('nav') === 'result') {
                as[i].click();
                break;
            }
        }
        
        setTimeout(function() {
            var result = [];

            var tbody = document.getElementById('result_tb');
            if (tbody.innerHTML.indexOf('暫無數據') > -1) { callback && callback('nodata'); }

            var alltr = tbody.children;
            for (var j = 0; j < alltr.length; ++j) {
                var tds = alltr[j].getElementsByTagName('td');
                var obj = {}

                if (tds[0] && tds[0].innerText) {
                    obj.chapter = tds[0].innerText;
                }
                
                if (tds[1] && tds[1].innerText) {
                    obj.time = tds[1].innerText;
                }

                if (tds[2] && tds[2].children) {
                    obj.result = (function() {
                        var resultNO = [];
                        var nospans = tds[2].children;
                        for (var ni = 0; ni < nospans.length; ++ni) {
                            for (var nj = 0; nj < 10; ++nj) {
                                if (hasClass(nospans[ni],'num' + nj)) {
                                    resultNO.push(nj);
                                    break;
                                }
                            }
                        }
                        return resultNO;
                    })();
                }
                
                obj.total = [
                    tds[3] && tds[3].innerText ? tds[3].innerText : '',
                    tds[4] && tds[4].innerText ? tds[4].innerText : '',
                    tds[5] && tds[5].innerText ? tds[5].innerText : ''
                ];
                obj.tiger = tds[6].innerText;

                result.push(obj);
            }
            
            callback && callback(result);
        }, 1000);

    }, 500);
}

function renderHTML(data) {
    var dialogEle = document.getElementById("eagle-color");
    if (data === 'nodata') {
        return dialogEle.innerHTML = '<style type="text/css" rel="stylesheet">.cancle{margin:5px 15px; cursor:pointer; font-size: 30px;}</style><div class="cancle" onClick="document.body.removeChild(document.getElementById(\'eagle-color\'))">x</div><div style="text-align: center; font-size: 30px; color: cornflowerblue; padding-top: 50px;">暂无数据</div>';
    }
    var colorArr = [],totalArr = [],tigerArr = [];
    for (var i = 0; i < data.length; ++i) {
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
                case '單':
                totalArr[i].push('red');
                break;
                default:
                totalArr[i].push('default');
                break;
            }
        }

        if (data[i].tiger === "龍") {
            tigerArr[i].push('red')
        }else if (data[i].tiger === "和"){
            tigerArr[i].push('green')
        }else tigerArr[i].push('default')
    }
    var strOne = '<div><style type="text/css" rel="stylesheet">.red{color:red}.green{color:green}.text-align-center{text-align:center; font-size: 17px;}table, th, td{border: 1px solid lightgray;border-collapse: collapse;}table{margin:20px auto}.square-one{background-color: #ffff01}.square-two{background-color: #0088fe}.square-three{background-color: #4d4d4d}.square-four{background-color: #ff7302}.square-five{background-color: #81fff9}.square-six{background-color: #5202fb}.square-seven{background-color: #e3e3e3}.square-eight{background-color: #fe0000}.square-nine{background-color: #7d0005}.square-zero{background-color: #2fbd07}span[class^="square"]{width: 35px;height: 35px;display: inline-block;margin: 2px;padding-top: 5px;text-align: center;font-size: 24px; color: white;text-shadow: 3px 2px 3px black;font-weight: bold;}.cancle{margin:5px 15px; cursor:pointer; font-size: 30px;}</style><div class="cancle" onClick="document.body.removeChild(document.getElementById(\'eagle-color\'))">x</div><div style="text-align: center; font-size: 30px; color: cornflowerblue;">重庆时时彩</div><table><tr><th width="130px">期数</th> <th width="150px">时间</th><th width="200px" style="letter-spacing: 27px;text-align: center;padding:5px 0 5px 30px">一二三四五</th><th width="80px">总和</th><th width="50px">龙虎</th></tr>';
    var strTwo = '';
    for (var i = 0; i < data.length; i++) {
        strTwo += '<tr><td class="text-align-center">'+data[i].chapter+'</td><td class="text-align-center">'
        +data[i].time+'</td><td class="text-align-center"><span class="'+colorArr[i][0]+'">'+data[i].result[0]+'</span><span class="'+colorArr[i][1]+'">'+data[i].result[1]+'</span><span class="'+colorArr[i][2]+'">'+data[i].result[2]+'</span><span class="'+colorArr[i][3]+'">'+data[i].result[3]+'</span><span class="'+colorArr[i][4]+'">'+data[i].result[4]+
        '</span></td><td class="text-align-center">'+data[i].total[0]+'<span style="padding:0 5px" class="'+totalArr[i][1]+'">'+data[i].total[1]+'</span>'+'<span class="'+totalArr[i][2]+'">'+data[i].total[2]+'</span>'+'</td><td class="text-align-center   '+tigerArr[i]+'">'+data[i].tiger+'</td></tr>'
    }
    dialogEle.innerHTML = strOne+strTwo+'</table></div>';
}

var dialogEle = document.createElement("div");
dialogEle.id = 'eagle-color';
dialogEle.style.width = '100%';
dialogEle.style.height = '100%';
dialogEle.style.position = 'absolute';
dialogEle.style.backgroundColor = 'white';
dialogEle.style.overflowY = 'scroll';
dialogEle.style.zIndex = '999999999';
dialogEle.style.top = '0';
dialogEle.style.left = '0';
dialogEle.style.minWidth = '750px';
dialogEle.style.fontFamily = "Microsoft YaHei";
dialogEle.innerHTML = '<style type="text/css" rel="stylesheet">.cancle{margin:5px 15px; cursor:pointer; font-size: 30px;}</style><div class="cancle" onClick="document.body.removeChild(document.getElementById(\'eagle-color\'))">x</div><div style="text-align: center; font-size: 30px; color: cornflowerblue; padding-top: 50px;">加载中......</div>';
document.body.appendChild(dialogEle);

ansyData(function(data) {
    renderHTML(data);
});
