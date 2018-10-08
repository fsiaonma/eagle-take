var snd = new Audio();
snd.src = "http://gddx.sc.chinaz.com/Files/DownLoad/sound1/201709/9251.wav";

var companyMap = {};

function getTotalPage() {
    var is = document.getElementsByTagName("i");
    for (var i = 0; i < is.length; ++i) {
        if (is[i].className.indexOf("total_page") > -1) {
            return is[i].innerText;
        }
    }
}

var totalPage = getTotalPage();

function getDetail(divs) {
    let detail;
    for (var j = 0; j < divs.length; ++j) {
        if (divs[j].className.indexOf('job_title') > -1) {
            detail = divs[j].innerText;
        }
    }
    return detail;
}

var companyMap = {};

function updateCompanyMap() {
    var dbCompanyMap = localStorage.getItem("companyMap");
    companyMap = dbCompanyMap ? JSON.parse(dbCompanyMap) : {};
}

function findTitleAndLink(ulEle, type, page) {
    var lis = ulEle.children;
    for (var i = 0; i < lis.length; ++i) {
        var divs = lis[i].getElementsByTagName("div");
        for (var j = 0; j < divs.length; ++j) {
            if (divs[j].className.indexOf('comp_name') > -1) {
                var jobDiv = divs[j].getElementsByTagName('a')[0];
                var a = divs[j].getElementsByTagName('a')[0];
                if (type === 'init') {
                    companyMap[a.title] = {
                        href: a.href,
                        detail: getDetail(divs)
                    }
                    console.log('【初始化】【公司名】：' + a.title + ' | 【链接】：' + a.href);
                    localStorage.setItem("companyMap", JSON.stringify(companyMap));
                    updateCompanyMap();
                } else {
                    if (!companyMap[a.title]) {
                        companyMap[a.title] = {
                            href: a.href,
                            detail: getDetail(divs)
                        }
                        snd.play();
                        console.log('【新增】【公司名】：' + a.title + ' | 【链接】：' + a.href + ' | 页数：' + page);
                    }
                    localStorage.setItem("companyMap", JSON.stringify(companyMap));
                    updateCompanyMap();
                }
                
            }
        }
        divs = null;
    }
    lis = null;

}

function getCompanyByPage(page, type) {
    var iframe = document.createElement("iframe");
    iframe.id = "iframe";
    iframe.src = "http://gz.58.com/panyu/job/pn" + page + "/?key=%E5%A4%96%E8%B4%B8&final=1&jump=1&PGTID=0d302408-0067-ee98-f23b-8ea8b73eb462&ClickID=3";
    document.body.appendChild(iframe);
    iframe.onload = function() {
        findTitleAndLink(iframe.contentWindow.document.getElementById('list_con'), type, page);
        document.body.removeChild(iframe);
        iframe = null;
        if (page <= totalPage) {
            return getCompanyByPage(++page, type);
        } else {
            console.log('------------------爬取结束------------------');
            console.log('------------------开始爬取：共' + totalPage + '页 | 时间：' + new Date() + '------------------');
            console.log('爬取中....');
            return getCompanyByPage(1, 'compare');
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
