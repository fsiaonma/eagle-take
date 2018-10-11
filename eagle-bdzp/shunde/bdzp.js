var localStorageKey = "bdzpCompanyMapShunde";
var dataApi = "http://zhaopin.baidu.com/api/qzasync?query=%E5%A4%96%E8%B4%B8&city=%25E4%25BD%259B%25E5%25B1%25B1&is_adq=1&pcmod=1&district=%25E9%25A1%25BA%25E5%25BE%25B7%25E5%258C%25BA&rn=20&pn=";

var snd = new Audio();
snd.src = "http://gddx.sc.chinaz.com/Files/DownLoad/sound1/201709/9251.wav";

var bdzpCompanyMap = {};

function updateCompanyMap() {
    var dbCompanyMap = localStorage.getItem(localStorageKey);
    bdzpCompanyMap = dbCompanyMap ? JSON.parse(dbCompanyMap) : {};
}

function run(startIndex, type) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', dataApi + startIndex, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                var res = JSON.parse(xhr.response);
                var mainData = res.data;
                if (mainData && mainData.resNum > 0 && mainData.disp_data) {
                    for (var i = 0; i < mainData.disp_data.length; ++i) {
                        var item = mainData.disp_data[i];
                        if (type === 'init') {
                            bdzpCompanyMap[item.officialname] = 1;
                            console.log('【初始化】【公司名】：' + item.officialname + ' | 【链接】：' + item.url + ' | startIndex: ' + startIndex);
                            localStorage.setItem(localStorageKey, JSON.stringify(bdzpCompanyMap));
                            updateCompanyMap();
                        } else {
                            if (!bdzpCompanyMap[item.officialname]) {
                                bdzpCompanyMap[item.officialname] = 1;
                                snd.play();
                                console.log('【新增】【公司名】：' + item.officialname + ' | 【链接】：' + item.url + ' | startIndex: ' + startIndex);
                            }
                            localStorage.setItem(localStorageKey, JSON.stringify(bdzpCompanyMap));
                            updateCompanyMap();
                        }
                    }
                    setTimeout(function() {
                        run(startIndex + 20, type);
                    }, 1000);
                } else {
                    console.log('------------------ 完成爬取：' + new Date() + '------------------');
                    setTimeout(function() {
                        getAllCompany(); // 新的一轮
                    }, 1000 * 60);
                }
            } catch (e) {
                console.log(e);
                setTimeout(function() {
                    getAllCompany(); // 新的一轮
                }, 1000 * 60);
            }
        }
    };
}

function getAllCompany() {
    if (!localStorage.getItem(localStorageKey)) {
        run(0, 'init');
    } else { 
        console.log('------------------ 开始爬取：' + new Date() + '------------------');
        console.log('爬取中....');
        run(0, 'compare');
    }
}

updateCompanyMap();
getAllCompany();

