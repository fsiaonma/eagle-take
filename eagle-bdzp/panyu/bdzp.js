var localStorageKey = "bdzpCompanyMapPanyu";
// var dataApi = "http://zhaopin.baidu.com/api/qzasync?query=%E5%A4%96%E8%B4%B8&city=%25E5%25B9%25BF%25E5%25B7%259E&is_adq=1&pcmod=1&district=%25E7%2595%25AA%25E7%25A6%25BA%25E5%258C%25BA&rn=10&pn=";
var dataApi = "http://zhaopin.baidu.com/api/qzasync?query=%E5%A4%96%E8%B4%B8&city=%25E5%25B9%25BF%25E5%25B7%259E&is_adq=1&pcmod=1&token=%3D%3Dgxem6oF%2FaqGWIcn9ZbUaplrt2lZZFbyl5ao9mbpV2Z&rn=10&pn=";

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
                        console.log(item.company)
                        if (type === 'init') {
                            bdzpCompanyMap[item.company] = 1;
                            console.log('【初始化】【公司名】：' + item.company + ' | 【链接】：' + item.pc_url + ' | startIndex: ' + startIndex);
                            localStorage.setItem(localStorageKey, JSON.stringify(bdzpCompanyMap));
                            updateCompanyMap();
                        } else {
                            if (!bdzpCompanyMap[item.company]) {
                                bdzpCompanyMap[item.company] = 1;
                                snd.play();
                                console.log('【新增】【公司名】：' + item.company + ' | 【链接】：' + item.pc_url + ' | startIndex: ' + startIndex);
                            }
                            localStorage.setItem(localStorageKey, JSON.stringify(bdzpCompanyMap));
                            updateCompanyMap();
                        }
                    }
                    setTimeout(function() {
                        run(startIndex + 10, type);
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

