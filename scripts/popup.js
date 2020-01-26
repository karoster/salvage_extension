let extensionActivate = document.getElementById('extensionActivateListener')

//flip the extension toggle switch to be consistent with initial listening state (aesthetic)
chrome.storage.sync.get(['extensionListening'], function(response) {
  if (response['extensionListening'] == 'on'){
    document.getElementById("extensionCheckbox").checked = true;
  }
});

//turn extensions eent listeners on and off
extensionActivate.onclick = function(element){
  chrome.storage.sync.get(['extensionListening'], function(response) {
    
    if (response['extensionListening'] == 'off'){
      chrome.storage.sync.set({'extensionListening':'on'}, function() {
      });
    } else {
      chrome.storage.sync.set({'extensionListening':'off'}, function() {
      });
    }
  
  });

}
