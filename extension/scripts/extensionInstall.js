
//function to add the javascript of the extension to the browser's DOM
export let injectExtensionListeners = function(){
  let parents = document.getElementsByClassName("s-item") //s-item is the class for listings on ebay.

  let buttonEventListener = parent => () => {
    let listingId = parent.id
    
    if(parent.classList.contains("salvage-extension-selected")){
      parent.classList.remove("salvage-extension-selected")
    }else{
      parent.classList.add("salvage-extension-selected")
    }
  }

  for (let parent of parents) {
    let button = document.createElement("button");
    button.innerHTML = "BUTTON";
    button.className = "toggleCartButton";
    button.addEventListener("click", buttonEventListener(parent), false);

    parent.appendChild(button);
  }
}

//function to remove extension webpage buttons and associated event listeners
export let removeExtensionListeners = function(){
  let buttons = document.getElementsByClassName("toggleCartButton");
  for(let i = buttons.length-1; i>0; i--){
    let parent = buttons[i].parentNode
    parent.classList.remove("salvage-extension-selected")
    parent.removeChild(buttons[i]);
  }
}