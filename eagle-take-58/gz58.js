var snd = new Audio();
snd.src = "http://gddx.sc.chinaz.com/Files/DownLoad/sound1/201709/9251.wav";
snd.play();

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
    var detail;
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

updateCompanyMap();

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
                    localStorage.setItem("companyMap", JSON.stringify(companyMap));
                    updateCompanyMap();
                    console.log('【初始化】【公司名】：' + a.title + ' | 【链接】：' + a.href);
                } else {
                    if (!companyMap[a.title]) {
                        companyMap[a.title] = {
                            href: a.href,
                            detail: getDetail(divs)
                        }
                        snd.play();
                        localStorage.setItem("companyMap", JSON.stringify(companyMap));
                        updateCompanyMap();
                        console.log('【新增】【公司名】：' + a.title + ' | 【链接】：' + a.href + ' | 页数：' + page);
                    }
                }
                
            }
        }
        divs = null;
    }
    lis = null;

}

var xmlhttp = new XMLHttpRequest();
function getCompanyByPage(page, type) {
    xmlhttp.open("GET", 'http://gz.58.com/panyu/job/pn' + page + '/?key=%E5%A4%96%E8%B4%B8&final=1&jump=1&PGTID=0d302408-0067-ee98-f23b-8ea8b73eb462&ClickID=3', true);
    xmlhttp.send(null);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            document.body.innerHTML = xmlhttp.responseText; 
            findTitleAndLink(document.getElementById('list_con'), type, page);
            if (page < totalPage) {
                ++currentPage;
                locked = false;
            } else {
                console.log('------------------爬取结束------------------');
                console.log('------------------开始爬取：共' + totalPage + '页 | 时间：' + new Date() + '------------------');
                console.log('爬取中....');
                currentPage = 1;
                currentType = 'compare';
                locked = false;
            }
            xmlhttp.abort();
        }
    }
}

var currentPage = 1;
var currentType = 'compare';
var locked = true;
setInterval(function() {
    if (!locked) {
        locked = true;
        getCompanyByPage(currentPage, currentType);
    }
}, 5000);

console.log('------------------ 开始爬取：共' + totalPage + '页 | 时间： ' + new Date() + '------------------');
console.log('爬取中....');

if (!localStorage.getItem("companyMap")) {
    currentPage = 1;
    currentType = 'init';
    locked = false;
} else { 
    currentPage = 1;
    currentType = 'compare';
    locked = false;
}
