///////////////////////////
/* INITIALIZATION SCRIPT */
///////////////////////////

//get the initial state of the extension
//(i.e. add extension iframe and event listeners on page refresh if extension is originally open and on)
chrome.storage.sync.get(['extensionStatus', 'extensionListening', 'cart'], function(response) {
  if (response['extensionStatus'] == 'active'){
    iframe.classList.remove("salvage-extension-iframe-off");
    iframe.classList.add("salvage-extension-iframe-on");
  }

  if(response['extensionListening'] == 'on'){
    injectExtensionListeners();
  }

  //don't perform costly initialization if cart is empty
  if(response['cart']){
    let parents = document.getElementsByClassName('s-item')

    for(let parent of parents){
      for (let listingTitle in response['cart']){ 
        let parentTitle = parent.querySelector(".s-item__title")
        if(!parentTitle){ continue; }
        parentTitle = parentTitle.innerHTML;

        if(listingTitle == parentTitle){
          parent.classList.add('salvage-extension-selected')
        }
      }
    }
  }
});


///////////////////////////
/* DYNAMIC UPDATE SCRIPT */
///////////////////////////

//updates the extension DOM when action is fired to storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
  let extensionOpenChange = changes['extensionStatus'];
  let extensionListeningChange = changes['extensionListening'];
  let extensionCartChange = changes['cart'];


  //if multiple tabs are open, update the 'salvage-extension-selected' for all tabs when a
  //change is made on one. (can be slow if displaying many results on a page or have many items in cart -> O(n*m))
  if(extensionCartChange){
    let parents = document.getElementsByClassName('s-item')
    let listingTitles = symmetricDifference(Object.keys(extensionCartChange.newValue), Object.keys(extensionCartChange.oldValue));
    for(let parent of parents){
      for (let listingTitle of listingTitles){
        let parentTitle = parent.querySelector(".s-item__title")
        if(!parentTitle){ continue; }

        parentTitle = parentTitle.innerHTML;

        if(listingTitle == parentTitle && parent.classList.contains('salvage-extension-selected')){
          parent.classList.remove('salvage-extension-selected')
        } else if(listingTitle == parentTitle){
          parent.classList.add('salvage-extension-selected')
        }
      }
    }
    
  }
  //handle extension opening
  if(extensionOpenChange){ toggleIframe(); }
    
  //handle extension activation
  if(extensionListeningChange){
    if(extensionListeningChange.newValue == "on"){
      injectExtensionListeners();
    } else{
      removeExtensionListeners();
    }
  }

});
