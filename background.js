chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab.url.indexOf('http://www.a16d.cn/webim/') > -1) {
    chrome.tabs.executeScript(null, {file: "eagle-color.js"});
  }
});
