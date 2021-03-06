var snd = new Audio();
snd.src = "http://gddx.sc.chinaz.com/Files/DownLoad/sound1/201709/9251.wav";

function getTotalPage() {
    var spans = document.getElementsByTagName('span')
    for (var i = 0; i < spans.length; ++i) {
        if (spans[i].innerText.indexOf("共") > -1 && spans[i].innerText.indexOf("页") > -1) {
            return Number(spans[i].innerText.replace(/[^0-9]/ig,""));
        }
    }
}

var totalPage = getTotalPage();

var companyMap = {};

function updateCompanyMap() {
    var dbCompanyMap = localStorage.getItem("companyMap");
    companyMap = dbCompanyMap ? JSON.parse(dbCompanyMap) : {};
}

function findTitleAndLink(ulEle, type, page) {
    var divs = ulEle.children;
    for (var i = 0; i < divs.length; ++i) {
        if (divs[i].className === 'el') {
            var spans = divs[i].getElementsByTagName('span');
            for (var j = 0; j < spans.length; ++j) {
                if (spans[j].className === 't2') {
                    var a = spans[j].getElementsByTagName('a')[0];
                    if (type === 'init') {
                        companyMap[a.title] = {
                            href: a.href
                        }
                        console.log('【初始化】【公司名】：' + a.title + ' | 【链接】：' + a.href + ' | 页数：' + page);
                        localStorage.setItem("companyMap", JSON.stringify(companyMap));
                        updateCompanyMap();
                    } else {
                        if (!companyMap[a.title]) {
                            companyMap[a.title] = {
                                href: a.href
                            }
                            snd.play();
                            console.log('【新增】【公司名】：' + a.title + ' | 【链接】：' + a.href + ' | 页数：' + page);
                        }
                        localStorage.setItem("companyMap", JSON.stringify(companyMap));
                        updateCompanyMap();
                    }
                }
            }
            spans = null;
        }
    }
    divs = null;
}

function getCompanyByPage(page, type) {
    var iframe = document.createElement("iframe");
    iframe.id = "iframe";
    iframe.src = "https://search.51job.com/list/030200,030207,0000,00,9,99,%25E5%25A4%2596%25E8%25B4%25B8,2," + page + ".html?lang=c&stype=1&postchannel=0000&workyear=99&cotype=99&degreefrom=99&jobterm=99&companysize=99&lonlat=0%2C0&radius=-1&ord_field=0&confirmdate=9&fromType=17&dibiaoid=0&address=&line=&specialarea=00&from=&welfare=";
    document.body.appendChild(iframe);
    iframe.onload = function() {
        findTitleAndLink(iframe.contentWindow.document.getElementsByClassName('dw_table')[0], type, page);
        document.body.removeChild(iframe);
        iframe = null;
        if (page <= totalPage) {
            setTimeout(function() {
                getCompanyByPage(++page, type);
            }, 1000);
        } else {
            console.log('------------------爬取结束------------------');
            setTimeout(function() {
                console.log('------------------开始爬取：共' + totalPage + '页 | 时间：' + new Date() + '------------------');
                console.log('爬取中....');
                getCompanyByPage(1, 'compare');
            }, 1000 * 60);
        }
    }
}

function getAllCompany() {
    if (!localStorage.getItem("companyMap")) {
        getCompanyByPage(1, 'init');
    } else { 
        console.log('------------------ 开始爬取：共' + totalPage + '页 | 时间： ' + new Date() + '------------------');
        console.log('爬取中....');
        getCompanyByPage(1, 'compare');
    }
}

updateCompanyMap();
getAllCompany();
