let extensionActivate = document.getElementById('extensionActivateListener')


//flip the extension toggle switch to be consistent with initial listening state (aesthetic)
chrome.storage.sync.get(['extensionListening', 'cart', 'total'], function(response) {

  if (response['extensionListening'] == 'on'){
    document.getElementById("extensionCheckbox").checked = true;
  }



  let parent = document.getElementById("list-of-auctions");
  for(let item in response['cart']){
    let child = document.createElement("li");
    child.id = `${item}`
    child.innerHTML = `${item}: <strong>$${response['cart'][item][0]}</strong>`;
    child.addEventListener("click", cartItemEventListener);
    parent.appendChild(child);
  }
  //add total div to sidebar
  let totalDiv = document.createElement('div');
  totalDiv.id = "cart-total";
  totalDiv.innerHTML = `Total: <strong>$${response['total'].toFixed(2)}</strong>`;
  document.getElementById('salvage-sidebar').appendChild(totalDiv);

  if(response['cart']){
    let clearButton = document.createElement('button');
    clearButton.id = "clear-button";
    clearButton.addEventListener("click", clearCart);
    clearButton.innerHTML = "clear";
    document.getElementById("salvage-sidebar").appendChild(clearButton);
  }

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
  //toggle extensio listening
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
        child.innerHTML = `${diffEle}: <strong>$${extensionCartChange.newValue[diffEle][0]}</strong>`;
        child.addEventListener("click", cartItemEventListener);
        parent.appendChild(child);
      }
    }

    let clearButton = document.getElementById('clear-button');
    //cart has items, but there is no clear button -> add it
    if(Object.keys(extensionCartChange.newValue).length && clearButton===null){
      clearButton = document.createElement('button');
      clearButton.id = 'clear-button';
      clearButton.innerHTML = "clear";
      clearButton.addEventListener('click', clearCart);
      document.getElementById('salvage-sidebar').appendChild(clearButton);
    //cart does not have items, but there is a clear button -> remove it
    } else if (!Object.keys(extensionCartChange.newValue).length && clearButton){
      clearButton.parentNode.removeChild(clearButton);
    }
  }

  if(extensionTotalChange){
    let totalDiv = document.getElementById('cart-total');
    let displayTotal = extensionTotalChange.newValue.toFixed(2);
    
    totalDiv.innerHTML = `Total: <strong>$${numberWithCommas(displayTotal)}</strong>`;

  }
});

/* HELPER FUNCTIONS */

function clearCart(event){
  chrome.storage.sync.set({'cart': {}, 'total': 0});
}

function saveCart(event){
  chrome.storage.sync.get(['total', 'cart'], function(response){
    //make api post call to server to make db insertion and post
    //return a unique key to display that can be used to gather the data.
    //mongodb or postgresql?
    //mongo -> faster, postgresql -> easier...

  });
}

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


//this function returns all elements in newValues not in oldValues unioned with
//all elements in oldValues not in newValues (symmetric difference)

function symmetricDifference(newValues, oldValues) {
  let setB = new Set(oldValues);
  let difference = new Set(newValues);

  for (let elem of setB) {
      if (difference.has(elem)) {
          difference.delete(elem);
      } else {
          difference.add(elem);
      }
  }
  return difference
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
