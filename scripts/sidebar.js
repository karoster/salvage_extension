let extensionActivate = document.getElementById('extensionActivateListener')

//flip the extension toggle switch to be consistent with initial listening state (aesthetic)
chrome.storage.sync.get(['extensionListening', 'cart'], function(response) {
  if (response['extensionListening'] == 'on'){
    document.getElementById("extensionCheckbox").checked = true;
  }

  let parent = document.getElementById("list-of-auctions");
  for(let item in response['cart']){
    let child = document.createElement("li");
    child.id = `${item}`
    child.innerHTML = `${item}...${response['cart'][item][0]}`;
    parent.appendChild(child);
  }
});

//turn extensions eent listeners on and off
extensionActivate.onclick = function(element){
  chrome.storage.sync.get(['extensionListening'], function(response) {
    
    if (response['extensionListening'] == 'off'){
      chrome.storage.sync.set({'extensionListening':'on'}, function() {
      });
    } else {
      chrome.storage.sync.set({'extensionListening':'off', 'cart':{}}, function() {
      });
    }
  
  });
}


// NEED TO ADD LINE TO INITIALIZE TEXT STORE//

chrome.storage.onChanged.addListener(function(changes, namespace) {
  let extensionCartChange = changes['cart'];
  let extensionListeningChange = changes['extensionListening'];

  if(extensionListeningChange){
    if(extensionListeningChange.newValue == "on"){
      document.getElementById('extensionCheckbox').checked = true;
    } else {
      document.getElementById('extensionCheckbox').checked = false;
    }
  }

  if (extensionCartChange){
    let diff = symmetricDifference(Object.keys(extensionCartChange.newValue), Object.keys(extensionCartChange.oldValue));
    let parent = document.getElementById("list-of-auctions");

    for (let diffEle of diff){
      let existingChild = document.getElementById(`${diffEle}`) 
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
  let difference = new Set(newValues);

  for (let elem of setB) {
      if (difference.has(elem)) {
          difference.delete(elem)
      } else {
          difference.add(elem)
      }
  }
  return difference
}


