function getLinkData(page) {
    console.log("---------------------" + page + "--------------------------");
    
    var url = "https://www.amap.com/service/poiInfo?query_type=TQUERY&pagesize=20&pagenum=" + page + "&qii=true&cluster_state=5&need_utd=true&utd_sceneid=1000&div=PC1000&addr_poi_merge=true&is_classify=true&zoom=15&city=440100&geoobj=113.246866%7C23.098093%7C113.26748%7C23.129407&keywords=%E7%BE%8E%E9%A3%9F";
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = state_Change;
    xmlhttp.open("GET", url, true);
    xmlhttp.send(null);

    function state_Change() {
        if (xmlhttp.readyState==4) {
            if (xmlhttp.status==200) {
                try {
                    var response = JSON.parse(xmlhttp.responseText); 
                    if (response && response.data && response.data.poi_list && response.data.poi_list.length) {
                        for (var i = 0; i < response.data.poi_list.length; ++i) {
                            var poi = response.data.poi_list[i];
                            console.log(poi.disp_name + " | 电话: " + poi.tel + " | 地址: " + poi.address);
                        }
                        getLinkData(++page);
                    }
                } catch(e) {
                    console.log(e);
                }
                 
            }
        }
    }
}

getLinkData(1)
