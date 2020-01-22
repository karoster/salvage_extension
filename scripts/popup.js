let extensionActivate = document.getElementById('extensionActivate')


chrome.storage.sync.get(['extensionStatus'], function(response) {
  if (response['extensionActive'] == 'on'){
    document.getElementById("extensionCheckbox").checked = true;
  }
});


extensionActivate.onclick = function(element){
  chrome.storage.sync.get(['extensionListening'], function(response) {
    
    if (response['extensionListening'] == 'inactive'){
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
