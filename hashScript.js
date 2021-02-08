//Author: Aaron Scher
//After any changes occur to the URL hash string, re-analyze and re-plot by implementing the main buttonFunction()
window.addEventListener("hashchange", function () {
  buttonFunction();
});

//When the reset button is pressed, set the default hash string and implement the main buttonFunction()
function resetAll() {
  document.getElementById("compensation").value = 1;
  //Trigger the event manually (so that the window gets cleared... since we have an event listener in another module that listens for a change to the compensation dropdown.)
  const e = new Event("change");
  const element = document.querySelector("#compensation");
  element.dispatchEvent(e);

  setDefaultHash();
  buttonFunction();
}

//Get the fragement identifier values
function getHashValue() {
  return location.hash.substring(1);
}

//This function is called by the initFunction() every time the page is reloaded (not after the button is pressed). The purpose of this function is to initialize the URL hash tag (i.e., anchor part of the URL). It does this by first checking the current hash tag value (i.e., URL anchor name). If there is an error with the URL anchor name syntax or there is no URL anchor name, then the default URL anchlor name is set.
function initValuesFromHash() {
  let hash = getHashValue();

  if (hash) {
    extractCurrentHashAndSetAllHtmlIdValues();
  } else {
    setDefaultHash();
    extractCurrentHashAndSetAllHtmlIdValues();
  }
}

//These names should match the corresponding id names for each parameter in the index.html file.
var hashNames = [
  "source",
  "load",
  "inverter",
  "rectifier",
  "fmin",
  "fmax",
  "fnum",
  "Vg_Ig",
  "RL_VL_IL_PL",
  "k",
  "L1",
  "L2",
  "Ron",
  "Vfwd",
  "RL1",
  "RL2",
  "RC1",
  "RC2",
  "C1",
  "C2",
  "compensation",
  "Lf1",
  "RLf1",
  "Cf1",
  "RCf1",
  "Lf2",
  "RLf2",
  "Cf2",
  "RCf2",
];

//These are the default values of the id names saved in the variable hashNames
var hashDefaultValues = [
  "1",
  "1",
  "2",
  "2",
  "75e3",
  "95e3",
  "250",
  "500",
  "5",
  "0.21",
  "37e-6",
  "37e-6",
  "30e-3",
  "0.4",
  "45e-3",
  "45e-3",
  "1e-3",
  "1e-3",
  "9.5e-8",
  "9.5e-8",
  "1",
  "5E-6",
  "10E-3",
  "9.5E-8",
  "10E-3",
  "5E-6",
  "10E-3",
  "9.5E-8",
  "10E-3",
];

//Set the default hash string
function setDefaultHash() {
  //First, define each of the default values
  let defaultHash = [];
  for (let i = 0; i < hashNames.length; i++) {
    defaultHash[i] = hashNames[i] + "=" + hashDefaultValues[i];
  }
  //Second, create the hash string using the arrays defined above.
  let defaultHashString = "#";
  for (let i = 0; i < defaultHash.length; i++) {
    defaultHashString += defaultHash[i] + "&";
  }
  defaultHashString = defaultHashString.slice(0, -1); //Remove the last "&" symbol
  location.hash = defaultHashString;
}

//The purpose of this function is to extract the current hash tag (URL anchor name) and set the values of the corresponding index.html file to match the hash tag values.
function extractCurrentHashAndSetAllHtmlIdValues() {
  let hash = getHashValue(); //Get value of the hash (i.e., URL anchor)
  let hashArray = hash.split("&");
  if (hashArray.length !== hashNames.length) {
    //Make sure the length of the hash array is what we expect (which is 16 for our parcicular case.)
    setDefaultHash(); //If the length of the hash array is not what we expect then there is an error and we therefore set the default hash.
  } else {
    for (let i = 0; i < hashArray.length; i++) {
      setHtmlIdValuetoHashValue(hashArray[i], hashNames[i]); //Set the values in index.html values
    }
  }
}

//This function is used by the extractCurrentHashAndSetAllHtmlIdValues() function (see above)
function setHtmlIdValuetoHashValue(hashEqualityExpression, htmlElementID) {
  if (hashEqualityExpression.split("=")[1]) {
    //Check for any errors
    let valueOfParameter = hashEqualityExpression.split("=")[1];

    if (valueOfParameter.split("e")[1]) {
      //attempt to keep engineering notation... not sure if it works!
      valueOfParameter =
        String(valueOfParameter.split("e")[0]) +
        "e" +
        String(valueOfParameter.split("e")[1]);
    }
    document.getElementById(htmlElementID).value = valueOfParameter;
  } else {
    setDefaultHash();
  }
}

//Update the hash bsed on the document values
function updateHash() {
  let hashValues = [];
  for (let i = 0; i < hashNames.length; i++) {
    hashValues[i] = document.getElementById(hashNames[i]).value;
  }
  let hashStringArray = [];
  for (let i = 0; i < hashNames.length; i++) {
    hashStringArray[i] = hashNames[i] + "=" + hashValues[i];
  }
  //Second, create the hash string using the arrays defined above.
  let hashString = "#";
  for (let i = 0; i < hashStringArray.length; i++) {
    hashString += hashStringArray[i] + "&";
  }
  hashString = hashString.slice(0, -1); //Remove the last "&" symbol
  window.location.hash = hashString;
}
