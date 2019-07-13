var snd = new Audio();
snd.src = "http://gddx.sc.chinaz.com/Files/DownLoad/sound1/201709/9251.wav";

// 增加头文件
var metaEle = document.createElement('meta');
metaEle.setAttribute('http-equiv', 'Content-Security-Policy');
metaEle.setAttribute('content', 'upgrade-insecure-requests');
document.head.appendChild(metaEle);

var companyMap = {};

function updateCompanyMap() {
    var dbCompanyMap = localStorage.getItem("companyMap");
    companyMap = dbCompanyMap ? JSON.parse(dbCompanyMap) : {};
}

function findTitleAndLink(ulEle, type, page) {
    var divs = ulEle;
    for (var i = 0; i < divs.length; ++i) {
        var aEles = divs[i].getElementsByTagName('a');
        for (var j = 0; j < aEles.length; ++j) {
            if (aEles[j].getAttribute('ka').indexOf('search_list_company') > -1) {
                var a = aEles[j];
                if (type === 'init') {
                    companyMap[a.innerText] = {
                        href: a.href
                    }
                    console.log('【初始化】【公司名】：' + a.innerText + ' | 【链接】：' + a.href + ' | 页数：' + page);
                    localStorage.setItem("companyMap", JSON.stringify(companyMap));
                    updateCompanyMap();
                } else {
                    if (!companyMap[a.innerText]) {
                        companyMap[a.innerText] = {
                            href: a.href
                        }
                        snd.play();
                        console.log('【新增】【公司名】：' + a.innerText + ' | 【链接】：' + a.href + ' | 页数：' + page);
                    }
                    localStorage.setItem("companyMap", JSON.stringify(companyMap));
                    updateCompanyMap();
                }
            }   
        }
        aEles = null;
    }
    divs = null;
}

function getCompanyByPage(page, type) {
    var iframe = document.createElement("iframe");
    iframe.id = "iframe";
    iframe.src = "https://www.zhipin.com/c101280800/?query=%E5%A4%96%E8%B4%B8&page=" + page + "&ka=page-" + page;
    document.body.appendChild(iframe);
    iframe.onload = function() {
        findTitleAndLink(iframe.contentWindow.document.getElementsByClassName('info-company'), type, page);

        var isEnd = false;
        var aEles = iframe.contentWindow.document.getElementsByTagName('a');
        for (var i = 0; i < aEles.length; ++i) { 
            if (aEles[i].getAttribute('ka') === 'page-next' && aEles[i].className.indexOf('disabled') > -1 ) {
                isEnd = true;
            }
        }

        document.body.removeChild(iframe);
        iframe = null;

        if (!isEnd) {
            setTimeout(function() {
                try {
                    getCompanyByPage(++page, type);
                } catch(e) {
                    console.log(e);
                }
            }, 1000 * 30 + 1000 * 30 * Math.random());
        } else {
            console.log('------------------爬取结束------------------');
            setTimeout(function() {
                console.log('------------------开始爬取：时间：' + new Date() + '------------------');
                console.log('爬取中....');
                try {
                    getCompanyByPage(1, 'compare');
                } catch(e) {
                    console.log(e);
                }
            }, 2000 * 60 + 1000 * 60 * Math.random());
        }
    }
}

function getAllCompany() {
    if (!localStorage.getItem("companyMap")) {
        getCompanyByPage(1, 'init');
    } else { 
        console.log('------------------ 开始爬取：时间： ' + new Date() + '------------------');
        console.log('爬取中....');
        getCompanyByPage(1, 'compare');
    }
}

updateCompanyMap();
getAllCompany();
