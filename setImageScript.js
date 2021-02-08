/* Author: Aaron Scher
 */ //This  function is called at the very end of the main buttonFunction(). The purpose of this function is to generate the correct figure to display based on the user's source, inverter, rectifier, and load options.

function setImage(sourceType, invConst, rectConst, loadType, compensation) {
  //Display correct source image
  if (sourceType == 1) {
    document.getElementById("sourceImage").src = "images/sourceVg.png";
  }
  if (sourceType == 2) {
    document.getElementById("sourceImage").src = "images/sourceIg.png";
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

  //Display correct compensation network
  if (compensation == 1) {
    document.getElementById("couplerImage").src = "images/seriesSeries.png";
  }
  if (compensation == 2) {
    document.getElementById("couplerImage").src = "images/seriesParallel.png";
  }
  if (compensation == 3) {
    document.getElementById("couplerImage").src = "images/lccSeries.png";
  }

  if (compensation == 4) {
    document.getElementById("couplerImage").src = "images/lccLCC.png";
  }

  //Display correct rectifier image
  if (rectConst == 1 && compensation == 1) {
    document.getElementById("rectifierImage").src =
      "images/rectifierHalfBridgeCurrentDriven.png";
  }
  if (rectConst == 1 && compensation == 2) {
    document.getElementById("rectifierImage").src =
      "images/rectifierHalfBridgeVoltageDriven.png";
  }
  if (rectConst == 1 && compensation == 3) {
    document.getElementById("rectifierImage").src =
      "images/rectifierHalfBridgeCurrentDriven.png";
  }
  if (rectConst == 1 && compensation == 4) {
    document.getElementById("rectifierImage").src =
      "images/rectifierHalfBridgeCurrentDriven.png";
  }

  if (rectConst == 2 && compensation == 1) {
    document.getElementById("rectifierImage").src =
      "images/rectifierFullBridgeCurrentDriven.png";
  }
  if (rectConst == 2 && compensation == 2) {
    document.getElementById("rectifierImage").src =
      "images/rectifierFullBridgeVoltageDriven.png";
  }
  if (rectConst == 2 && compensation == 3) {
    document.getElementById("rectifierImage").src =
      "images/rectifierFullBridgeCurrentDriven.png";
  }
  if (rectConst == 2 && compensation == 4) {
    document.getElementById("rectifierImage").src =
      "images/rectifierFullBridgeCurrentDriven.png";
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
    document.getElementById("loadImage").src = "images/loadCplCD.png";
  }
}
