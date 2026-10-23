(function(){
"use strict";
  setTimeout(() => {
    document.getElementById("preloader").classList.add("done");
    setTimeout(() => document.getElementById("preloader").style.display = "none", 700);
  }, 2200);
})();
