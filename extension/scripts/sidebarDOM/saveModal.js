/////////////////////////////////////////
/* INSTALLING SAVECART MODAL LISTENERS */
/////////////////////////////////////////

let closeModal = document.getElementsByClassName("close")[0]
let saveModal = document.getElementById("sidebar-save-modal");

closeModal.onclick = function() {
  saveModal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == saveModal) {
    saveModal.style.display = "none";
  }
}
