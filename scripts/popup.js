let extensionActivate = document.getElementById('extensionActivateListener')


chrome.storage.sync.get(['extensionListening'], function(response) {
  if (response['extensionListening'] == 'on'){
    document.getElementById("extensionCheckbox").checked = true;
  }
});

console.log(extensionActivate)
extensionActivate.onclick = function(element){
  chrome.storage.sync.get(['extensionListening'], function(response) {
    
    if (response['extensionListening'] == 'off'){
      chrome.storage.sync.set({'extensionListening':'on'}, function() {
        console.log('extension extension listening saved (on)');
      });
    } else {
      chrome.storage.sync.set({'extensionListening':'off'}, function() {
        console.log('extension extension listening saved (off)');
      });
    }
  
  });

}
