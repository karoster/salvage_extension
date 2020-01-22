chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log("The color is green.");
    });

    chrome.storage.sync.set({extensionStatus: 'inactive'}, function() {
      console.log("The extension is inactive by default.");
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'www.ebay.com', schemes: ['https']},
          })
          ],
              actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });

});

