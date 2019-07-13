chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab.url.indexOf('https://fe-api.zhaopin.com') > -1) {
    chrome.tabs.executeScript(null, {file: "zhilian-min.js"});
  }
});
