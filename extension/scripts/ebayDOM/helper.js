//////////////////////
/* HELPER FUNCTIONS */
//////////////////////


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


//function to add the event listeners of the extension to the browser's DOM
function injectExtensionListeners(){
    let parents = document.getElementsByClassName("s-item"); //s-item is the class for listings on ebay.
  
    for (let parent of parents) {
      let button = document.createElement("button");
      button.innerHTML = "Add To Part Total";
      button.className = "toggleCartButton";
      button.addEventListener("click", buttonEventListener(parent), false);
  
      parent.appendChild(button);
    }
  }
  
  //function to remove extension webpage buttons and associated event listeners
  function removeExtensionListeners(){
    let buttons = document.getElementsByClassName("toggleCartButton");
    for(let i = buttons.length-1; i>0; i--){
      let parent = buttons[i].parentNode;
      parent.classList.remove("salvage-extension-selected");
      parent.removeChild(buttons[i]);
    }
  }
  
  //button event listener helper to get the prices/sold status from a listing
  //returns [price, saleType] saleType can be STRIKETHROUGH, ACTIVE, or POSITIVE
  //STRIKETHROUGH --> bestoffer was taken, ACTIVE --> listing is still live, POSITIVE --> Item sold for that amount
  function getPrices(parent){
    let result = [];
    let priceIfActive = parent.querySelector(".s-item__price");
    //if user is looking at sold listings, "priceIfActive" will have a child span with class "POSITIVE [, ITALIC, STRIKETHROUGH]"
    let priceIfSold = priceIfActive.firstElementChild;
    if (priceIfSold){
      result.push(priceIfSold.innerHTML.slice(1, priceIfSold.length));
      if (priceIfSold.classList.contains("STRIKETHROUGH")){
        result.push("STRIKETHROUGH");
      } else {result.push("POSITIVE")}
  
    }else{
      result.push(priceIfActive.innerHTML.slice(1,priceIfActive.length));
      result.push("ACTIVE");
    }
    return result
  }