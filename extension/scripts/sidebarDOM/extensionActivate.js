let extensionActivate = document.getElementById('extensionActivateListener')

//turn extensions state of listeners on and off
extensionActivate.onclick = function(element){
    chrome.storage.sync.get(['extensionListening'], function(response) {
      
      if (response['extensionListening'] == 'off'){
        chrome.storage.sync.set({'extensionListening':'on'});
      } else {
        chrome.storage.sync.set({'extensionListening':'off', 'cart':{}, 'total': 0});
      }
    });
  }

