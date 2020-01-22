let extensionActivate = document.getElementById('extensionActivate')


chrome.storage.sync.get(['extensionStatus'], function(response) {
  if (response['extensionStatus'] == 'active'){
    document.getElementById("extensionCheckbox").checked = true;
  }
});





extensionActivate.onclick = function(element){
  chrome.storage.sync.get(['extensionStatus'], function(response) {
    
    if (response['extensionStatus'] == 'inactive'){
      chrome.storage.sync.set({'extensionStatus':'active'}, function() {
        console.log('extension status settings saved (active)');
      });
    } else {
      chrome.storage.sync.set({'extensionStatus':'inactive'}, function() {
        console.log('extension status settings saved (inactive)');
      });
    }
  
  });

}
