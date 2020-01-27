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


chrome.storage.onChanged.addListener(function(changes, namespace) {
  let extensionCartChange = changes['cart'];

  //might get error with adding/deleting...
  if (extensionCartChange){
    let diff = symmetricDifference(Object.keys(extensionCartChange.newValue), Object.keys(extensionCartChange.oldValue));
    let parent = document.getElementById("list-of-auctions");

    for (let diffEle of diff){
      let existingChild = document.getElementById(`${diffEle}`) 
      console.log(existingChild);
      //should be true if selected...
      if(existingChild){
        parent.removeChild(existingChild);
      } else {
        
        let child = document.createElement("li");
        child.id = `${diffEle}`
        child.innerHTML = `${diffEle}...${extensionCartChange.newValue[diffEle][0]}`;
        parent.appendChild(child);
      } 

    }
  }
});

/* HELPER FUNCTIONS */
function symmetricDifference(newValues, oldValues) {
  let setB = new Set(oldValues);
  let _difference = new Set(newValues);

  for (let elem of setB) {
      if (_difference.has(elem)) {
          _difference.delete(elem)
      } else {
          _difference.add(elem)
      }
  }
  return _difference
}


