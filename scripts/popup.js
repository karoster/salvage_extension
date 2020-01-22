let changeColor = document.getElementById('changeColor');
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




chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });
};