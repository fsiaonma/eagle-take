chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab.url.indexOf('http://zhaopin.baidu.com/') > -1) {
    chrome.tabs.executeScript(null, {file: "bdzp-min.js"});
  }
});
