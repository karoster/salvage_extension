
///////////////////////////
/* INITIALIZATION SCRIPT */
///////////////////////////

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

///////////////////////////
/* DYNAMIC UPDATE SCRIPT */
///////////////////////////

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
    //cart has items, but there is no save button -> add it
    if(Object.keys(extensionCartChange.newValue).length && saveButton===null){
      //handle case where cart is saved, causing removal of saveButton preventing double clearButton
      // if(clearButton){ clearButton.parentNode.removeChild(clearButton)}

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

    //cart does not have items, but there is a save button -> remove it
    } else if (!Object.keys(extensionCartChange.newValue).length && saveButton){
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
