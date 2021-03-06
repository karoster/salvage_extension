function saveCart(event){
  chrome.storage.sync.get(['cart'], function(response){
    //make api post call to server to make db insertion and post
    //return a unique key to display that can be used to gather the data.
    let postData = getPostData(response['cart']);
    event.target.disabled = true;
    let url = "https://floating-escarpment-36391.herokuapp.com/api/v1/parts"
    fetch(url, {
      method: 'POST', 
      mode: 'cors', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'part': postData})
    }).then(response => response.json())
      .then(response => {
        if (response['error'] == false){
          let currentKey = saveModal.querySelector('#save-key');
          let modalContent = saveModal.querySelector('.modal-content');
          let saveButton = document.querySelector('#save-button');

          if (currentKey){
            currentKey.parentNode.removeChild(currentKey)
          }
          currentKey = document.createElement('div')
          currentKey.id = 'save-key'
          currentKey.innerHTML = `<strong>${response['message']}</strong>`
          modalContent.appendChild(currentKey);
          saveModal.style.display = 'block';
          saveButton.parentNode.removeChild(saveButton);

        }
      }).catch(err => {console.log(err);
        console.log("failed to process save")
        event.target.disabled = false;
      });
  });
}

function clearCart(event){
  chrome.storage.sync.set({'cart': {}, 'total': 0}, function(){
      let clearButton = document.querySelector('#clear-button');
      let saveButton = document.querySelector('#save-button');
      if(saveButton){saveButton.parentNode.removeChild(saveButton)}
      if(clearButton){clearButton.parentNode.removeChild(clearButton)};
  });
}

function loadCart(event){
  //prevent error messages from stacking
  let errorMsg = document.querySelector('.error-span')
  if(errorMsg){ errorMsg.parentNode.removeChild(errorMsg) }

  event.preventDefault();
  let url = "https://floating-escarpment-36391.herokuapp.com/api/v1/parts"
  let cartInput = document.getElementById('load-input');
  url += `?cart_id=${cartInput.value}`
  fetch(url)
    .then(response => response.json())
    .then(response => {
      if (response['error']){
        console.log("invalid load key!");
        let errorSpan = document.createElement('span');
        errorSpan.classList.add('error-span');
        errorSpan.innerText = "Invalid load key";
        cartInput.after(errorSpan)
      } else {
        chrome.storage.sync.set({'cart': response['parts'], 'total': response['total']});
      }
      cartInput.value = ""
    });
}


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


//////////////////////////////////
/* INSTALLING LOADCART LISTENER */
//////////////////////////////////

let loadCartForm = document.getElementById("load-cart-form");
loadCartForm.addEventListener("submit", loadCart);

