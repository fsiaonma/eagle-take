chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab.url.indexOf('http://mem1.yeperi311.gewubengou.com') > -1) {
    chrome.tabs.executeScript(null, {file: "eagle-color-2.0.min.js"});
  }
});
