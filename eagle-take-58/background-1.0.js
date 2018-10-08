chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab.url.indexOf('http://gz.58.com/') > -1) {
    chrome.tabs.executeScript(null, {file: "gz58.js"});
  }
});
