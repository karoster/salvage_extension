chrome.runtime.onInstalled.addListener(function() {

    chrome.storage.sync.set({extensionStatus: 'inactive'}, function() {
      console.log("The extension iframe is inactive by default.");
    });

    chrome.storage.sync.set({extensionListening: 'off'}, function() {
      console.log("The extension is off by default.");
    });

    chrome.pageAction.onClicked.addListener(function(){
      chrome.storage.sync.get(['extensionStatus'], function(response) {
        if (response['extensionStatus'] == 'active'){
          chrome.storage.sync.set({extensionStatus: 'inactive'}, function() {
            console.log("The extension is now (inactive).");
          });
        } else {
          chrome.storage.sync.set({extensionStatus: 'active'}, function() {
            console.log("The extension is now (active).");
          });
        }
      });
    });

});




