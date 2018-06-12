chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {file: "eagle-color-3.0-min.js"});
});
