/* Author: Aaron Scher
 */ //This  function is called at the very end of the main buttonFunction(). The purpose of this function is to generate the correct figure to display based on the user's source, inverter, rectifier, and load options.

function setImage(sourceType, invConst, rectConst, loadType) {
  //Display correct source image (also display coupler image)
  if (sourceType == 1) {
    document.getElementById("sourceImage").src = "images/sourceVg.png";
    document.getElementById("couplerImage").src = "images/coupler.png";
  }
  if (sourceType == 2) {
    document.getElementById("sourceImage").src = "images/sourceIg.png";
    document.getElementById("couplerImage").src = "images/coupler.png";
  }
  //Display correct inverter image
  if (invConst == 1) {
    document.getElementById("inverterImage").src =
      "images/inverterHalfBridge.png";
  }
  if (invConst == 2) {
    document.getElementById("inverterImage").src =
      "images/inverterFullBridge.png";
  }
  //Display correct rectifier image
  if (rectConst == 1) {
    document.getElementById("rectifierImage").src =
      "images/rectifierHalfBridge.png";
  }
  if (rectConst == 2) {
    document.getElementById("rectifierImage").src =
      "images/rectifierFullBridge.png";
  }

  //Display correct load
  if (loadType == 1) {
    document.getElementById("loadImage").src = "images/loadRL.png";
  }
  if (loadType == 2) {
    document.getElementById("loadImage").src = "images/loadVL.png";
  }
  if (loadType == 3) {
    document.getElementById("loadImage").src = "images/loadIL.png";
  }
  if (loadType == 4) {
    document.getElementById("loadImage").src = "images/loadCplVd.png";
  }
  if (loadType == 5) {
    document.getElementById("loadImage").src = "images/loadCplCD.png.png";
  }
}
