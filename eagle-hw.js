function getPhone(bList, index) {
  if (index >= bList.length) {
    var spans = document.getElementsByTagName('span');
    for (var i = 0; i < spans.length; ++i) {
      if (spans[i].className === 'paging-next') {
        spans[i].click();
        setTimeout(function() {
          getPageData();
        }, 1000);
      }
    }
    return;
  }

  document.getElementById(bList[index].id).click();
  setTimeout(function() {
    var name, phone;

    var h3s = document.getElementsByTagName('h3');
    for (var i = 0; i < h3s.length; ++i) {
      if (h3s[i].className === 'poiname') {
        name = h3s[i].innerText;
      }
    }

    var ps = document.getElementsByTagName('p');
    for (var i = 0; i < ps.length; ++i) {
      if (ps[i].className === 'feedphone') {
        phone = ps[i].innerText;
      }
    }

    console.log(name + ' | ' + phone);

    document.getElementById('placereturnfixed').click();
    setTimeout(function() {
      getPhone(bList, ++index);
    }, 1000);

  }, 1000);
}

function getPageData() {
  var uls = document.getElementsByTagName('ul');

  var bList;
  for (var i = 0; i < uls.length; ++i) {
      if (uls[i].className === 'serp-list') {
        bList = uls[i].children;
      }
  }

  getPhone(bList, 1);
} 


getPageData();
