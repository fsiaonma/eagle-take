var snd = new Audio();
snd.src = "http://gddx.sc.chinaz.com/Files/DownLoad/sound1/201709/9251.wav";

var bdzpCompanyMap = {};

function updateCompanyMap() {
    var dbCompanyMap = localStorage.getItem("bdzpCompanyMap");
    bdzpCompanyMap = dbCompanyMap ? JSON.parse(dbCompanyMap) : {};
}

function run(startIndex, type) {

    var xhr = new XMLHttpRequest();
//     xhr.open('GET', 'http://zhaopin.baidu.com/api/quanzhiasync?query=%E5%A4%96%E8%B4%B8&sort_type=1&city=%E5%B9%BF%E5%B7%9E&district=%25E7%2595%25AA%25E7%25A6%25BA%25E5%258C%25BA&detailmode=close&rn=20&pn=' + startIndex, true);
    xhr.open('GET', 'http://zhaopin.baidu.com/api/qzasync?query=%E5%A4%96%E8%B4%B8&city=%25E5%25B9%25BF%25E5%25B7%259E&is_adq=1&pcmod=1&pn=' + startIndex + '&rn=20', true);
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
                            bdzpCompanyMap[item.officialname] = item;
                            console.log('【初始化】【公司名】：' + item.officialname + ' | 【链接】：' + item.url);
                            localStorage.setItem("bdzpCompanyMap", JSON.stringify(bdzpCompanyMap));
                            updateCompanyMap();
                        } else {
                            if (!bdzpCompanyMap[item.officialname]) {
                                bdzpCompanyMap[item.officialname] = item;
                                snd.play();
                                console.log('【新增】【公司名】：' + item.officialname + ' | 【链接】：' + item.url + ' | startIndex: ' + startIndex);
                            }
                            localStorage.setItem("bdzpCompanyMap", JSON.stringify(bdzpCompanyMap));
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
    if (!localStorage.getItem("bdzpCompanyMap")) {
        run(0, 'init');
    } else { 
        console.log('------------------ 开始爬取：' + new Date() + '------------------');
        console.log('爬取中....');
        run(0, 'compare');
    }
}

updateCompanyMap();
getAllCompany();

