chrome.browserAction.onClicked.addListener(function(tab) {
  if (tab.url.indexOf('https://search.51job.com') > -1) {
    chrome.tabs.executeScript(null, {file: "51job-min.js"});
  }
});
