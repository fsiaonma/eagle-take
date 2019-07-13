chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab.url.indexOf('https://www.zhipin.com') > -1) {
    chrome.tabs.executeScript(null, {file: "zhipin-min.js"});
  }
});
