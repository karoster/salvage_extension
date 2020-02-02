function saveCart(event){
    chrome.storage.sync.get(['cart'], function(response){
      //make api post call to server to make db insertion and post
      //return a unique key to display that can be used to gather the data.
      let postData = getPostData(response['cart']);
      let url = "http://localhost:3000/api/v1/parts"
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
            saveButton.parentNode.removeChild(saveButton); // need to fix this...
  
          }
        }).catch(err => {console.log(err);
          console.log("failed to process save")
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
    event.preventDefault;
    
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
  
