let extensionActivate = document.getElementById('extensionActivateListener')

//event listener to add to the 'li' in the sidebar.
//removes the 'li' from the sidebar and removes the item from the extensions storage['cart']
function cartItemEventListener(event){
  let titleKey = event.target.id;

  chrome.storage.sync.get(['cart', 'total'], function(response) {
    let price = response['cart'][titleKey][0];
    delete response['cart'][titleKey];

    chrome.storage.sync.set({ 
      'cart': response['cart'],
      'total': response['total'] - parseFloat(price.replace(/,/g, ""))
    });

  });
  
}



//flip the extension toggle switch to be consistent with initial listening state (aesthetic)
chrome.storage.sync.get(['extensionListening', 'cart', 'total'], function(response) {

  if (response['extensionListening'] == 'on'){
    document.getElementById("extensionCheckbox").checked = true;
  }

  let parent = document.getElementById("list-of-auctions");
  for(let item in response['cart']){
    let child = document.createElement("li");
    child.id = `${item}`
    child.innerHTML = `${item}: <strong>${response['cart'][item][0]}</strong>`;
    child.addEventListener("click", cartItemEventListener);
    parent.appendChild(child);
  }

  let totalDiv = document.createElement('div');
  totalDiv.id = "cart-total";
  totalDiv.innerHTML = `Total: <strong>${response['total']}</strong>`;
  document.getElementById('salvage-sidebar').appendChild(totalDiv);

});

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

//track changes to cart and on/off extension listening
chrome.storage.onChanged.addListener(function(changes, namespace) {
  let extensionCartChange = changes['cart'];
  let extensionListeningChange = changes['extensionListening'];
  let extensionTotalChange = changes['total']

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
      let existingChild = document.getElementById(`${diffEle}`);
      // if document query found something, that means diffEle exists on page and
      //because it is a symmetric difference it shouldn't; remove it.
      if(existingChild){
        parent.removeChild(existingChild);
        
      } else {//child was not existing so we go ahead and make it because symmetric difference implies it should then exist
        let child = document.createElement("li");

        child.id = `${diffEle}`;
        child.innerHTML = `${diffEle}: <strong>${extensionCartChange.newValue[diffEle][0]}</strong>`;
        child.addEventListener("click", cartItemEventListener);
        parent.appendChild(child);
      } 
    }
  }

  if(extensionTotalChange){
    let totalDiv = document.getElementById('cart-total');
    let displayTotal = extensionTotalChange.newValue.toFixed(2);
    
    totalDiv.innerHTML = `Total: <strong>${numberWithCommas(displayTotal)}</strong>`;

  }
});

/* HELPER FUNCTIONS */

//this function returns all elements in newValues not in oldValues unioned with
//all elements in oldValues not in newValues (symmetric difference)
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

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
