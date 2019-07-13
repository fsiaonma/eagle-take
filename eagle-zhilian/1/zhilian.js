var localStorageKey = "zhilian-companyMap";

var snd = new Audio();
snd.src = "http://gddx.sc.chinaz.com/Files/DownLoad/sound1/201709/9251.wav";

var companyMap = {};

function updateCompanyMap() {
    var dbCompanyMap = localStorage.getItem(localStorageKey);
    companyMap = dbCompanyMap ? JSON.parse(dbCompanyMap) : {};
}

function run(startIndex, type) {
    var xhr = new XMLHttpRequest();

    xhr.open(
        'GET', 
        'https://fe-api.zhaopin.com/c/i/sou?start=' + startIndex + '&pageSize=100&cityId=768&salary=0,0&workExperience=-1&education=-1&companyType=-1&employmentType=-1&jobWelfareTag=-1&kw=%E5%A4%96%E8%B4%B8&kt=3&=0&_v=0.32143006&x-zp-page-request-id=90b29c05e18948a2912c4d37c68a6d4c-1562948981506-485648&x-zp-client-id=527a763a-2b9e-4ff8-99c5-8baf17848924',
        true
    );
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                var res = JSON.parse(xhr.response);
                var mainData = res.data;
                if (mainData && mainData.results && mainData.results.length > 0) {
                    for (var i = 0; i < mainData.results.length; ++i) {
                        var item = mainData.results[i];

                        var name, href;
                        if (item.company) {
                            name = item.company.name;
                        }
                        href = item.positionURL;

                        if (type === 'init') {
                            companyMap[name] = href;
                            console.log('【初始化】【公司名】：' + name + ' | 【链接】：' + href + ' | startIndex: ' + startIndex);
                            localStorage.setItem(localStorageKey, JSON.stringify(companyMap));
                            updateCompanyMap();
                        } else {
                            if (!companyMap[item.company]) {
                                companyMap[item.company] = href;
                                snd.play();
                                console.log('【新增】【公司名】：' + name + ' | 【链接】：' + href + ' | startIndex: ' + startIndex);
                            }
                            localStorage.setItem(localStorageKey, JSON.stringify(companyMap));
                            updateCompanyMap();
                        }
                    }
                    setTimeout(function() {
                        run(startIndex + 100, type);
                    }, 1000 * 30 + 1000 * 30 * Math.random());
                } else {
                    console.log('------------------ 完成爬取：' + new Date() + '------------------');
                    setTimeout(function() {
                        getAllCompany(); // 新的一轮
                    }, 2000 * 60 + 1000 * 60 * Math.random());
                }
            } catch (e) {
                console.log(e);
                setTimeout(function() {
                    getAllCompany(); // 新的一轮
                }, 2000 * 60 + 1000 * 60 * Math.random());
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

