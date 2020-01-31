let extensionActivate = document.getElementById('extensionActivateListener')


//get the initial state of the extension
chrome.storage.sync.get(['extensionListening', 'cart', 'total'], function(response) {

  if (response['extensionListening'] == 'on'){
    document.getElementById("extensionCheckbox").checked = true;
  }



  let parentUl = document.getElementById("list-of-auctions");
  for(let item in response['cart']){
    let child = document.createElement("li");
    child.id = `${item}`
    child.innerHTML = `${item}: <strong class=${response['cart'][item][1]}>$${response['cart'][item][0]}</strong>`;
    child.addEventListener("click", cartItemEventListener);
    parentUl.appendChild(child);
  }
  //add total div to sidebar
  let totalDiv = document.createElement('div');
  totalDiv.id = "cart-total";
  totalDiv.innerHTML = `Total: <strong>$${response['total'].toFixed(2)}</strong>`;
  document.getElementById('salvage-sidebar').appendChild(totalDiv);

  //if cart has objects, insert clear button and save button.
  if(Object.keys(response['cart']).length){
    let saveButton = document.createElement('button');
    let clearButton = document.createElement('button');
    let sidebar = document.getElementById("salvage-sidebar");
    clearButton.classList.add("sidebar-button");
    saveButton.classList.add("sidebar-button");
    clearButton.addEventListener("click", clearCart);
    saveButton.addEventListener("click", saveCart);
    saveButton.innerHTML = "Save";
    clearButton.innerHTML = "Clear";
    saveButton.id = "save-button";
    clearButton.id = "clear-button";
    sidebar.appendChild(clearButton);
    sidebar.appendChild(saveButton);
  }

});



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
    let parentUl = document.getElementById("list-of-auctions");


    for (let diffEle of diff){
      let existingChild = document.getElementById(`${diffEle}`);
      // if document query found something, that means diffEle exists on page and
      //because it is a symmetric difference it shouldn't; remove it.
      if(existingChild){
        parentUl.removeChild(existingChild);
        
      } else {//child was not existing so we go ahead and make it because symmetric difference implies it should then exist
        let child = document.createElement("li");

        child.id = `${diffEle}`;
        child.innerHTML = `${diffEle}: <strong class=${extensionCartChange.newValue[diffEle][1]}>$${extensionCartChange.newValue[diffEle][0]}</strong>`;
        child.addEventListener("click", cartItemEventListener);
        parentUl.appendChild(child);
      }
    }

    let clearButton = document.getElementById('clear-button');
    let saveButton = document.getElementById('save-button')
    //cart has items, but there is no clear button -> add it
    if(Object.keys(extensionCartChange.newValue).length && clearButton===null){
      let newClearButton = document.createElement('button');
      let newSaveButton = document.createElement('button');
      let parent = document.getElementById("salvage-sidebar");
      newClearButton.classList.add('sidebar-button');
      newSaveButton.classList.add('sidebar-button');
      newClearButton.id = "clear-button";
      newSaveButton.id = "save-button"
      newClearButton.innerHTML = "Clear";
      newSaveButton.innerHTML = "Save";
      newClearButton.addEventListener('click', clearCart);
      newSaveButton.addEventListener('click', saveCart);
      parent.appendChild(newClearButton);
      parent.appendChild(newSaveButton);

    //cart does not have items, but there is a clear button -> remove it
    } else if (!Object.keys(extensionCartChange.newValue).length && clearButton){
      clearButton.parentNode.removeChild(clearButton);
      saveButton.parentNode.removeChild(saveButton);
    }
  }

  if(extensionTotalChange){
    let totalDiv = document.getElementById('cart-total');
    let displayTotal = extensionTotalChange.newValue.toFixed(2);
    
    totalDiv.innerHTML = `Total: <strong>$${numberWithCommas(displayTotal)}</strong>`;

  }
});

//////////////////////
/* HELPER FUNCTIONS */
//////////////////////

function clearCart(event){
  chrome.storage.sync.set({'cart': {}, 'total': 0});
}

function saveCart(event){
  chrome.storage.sync.get(['cart'], function(response){
    //make api post call to server to make db insertion and post
    //return a unique key to display that can be used to gather the data.
    postData = []
    for(let item in response['cart']){
      console.log(item)
      postData.push({part_id: item,
        sale_type: response['cart'][item][1],
        sale_price: response['cart'][item][0] 
      });
    }
    console.log(postData)
  });
}

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

//event listener to add to the 'li' in the sidebar.
//removes the 'li' from the sidebar and removes the item from the extensions storage['cart']
function cartItemEventListener(event){
  let titleKey = event.currentTarget.id;
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

//rewrites a float as a number with commas for displaying.
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
