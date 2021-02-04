//All functions in this file are concerned with the simple ancillary calculator for finding the Q-factor and resonant frequency of an LC resonator.

//The purpose of this function is to change the text when the user selects an inductor loss specification
function indLossTypeCalcFunction() {
  let val = Number(document.getElementById("indLossTypeCalc").value); //get value of pull down menu (1,2, or 3)
  switch (val) {
    case 1:
      document.getElementById("lcCalcIndLossText").innerHTML =
        "&nbsp;&nbsp;&nbsp;Inductor's series resistance, <span style='font-family:Times New Roman'><i>R</i><sub>L</sub> </span> (Ohm): ";
      break;
    case 2:
      document.getElementById("lcCalcIndLossText").innerHTML =
        "&nbsp;&nbsp;&nbsp;Inductor's quality factor, <span style='font-family:Times New Roman'><i>Q</i><sub>L</sub> </span>: ";
      break;
    case 3:
      document.getElementById("lcCalcIndLossText").innerHTML =
        "&nbsp;&nbsp;&nbsp;Inductor's dissipation factor <span style='font-family:Times New Roman'>(tan&#948;)</span>: ";
      break;
  }
}

//The purpose of this function is to change the text when the user selects a capacitor loss specification
function capLossTypeCalcFunction() {
  let val = Number(document.getElementById("capLossTypeCalc").value); //get value of pull down menu (1,2, or 3)
  switch (val) {
    case 1:
      document.getElementById("lcCalcCapLossText").innerHTML =
        "&nbsp;&nbsp;&nbsp;Capacitor's series resistance, <span style='font-family:Times New Roman'><i>R</i><sub>C</sub> </span> (Ohm): ";
      break;
    case 2:
      document.getElementById("lcCalcCapLossText").innerHTML =
        "&nbsp;&nbsp;&nbsp;Capacitor's quality factor, <span style='font-family:Times New Roman'><i>Q</i><sub>C</sub> </span>: ";
      break;
    case 3:
      document.getElementById("lcCalcCapLossText").innerHTML =
        "&nbsp;&nbsp;&nbsp;Capacitor's dissipation factor <span style='font-family:Times New Roman'>(tan&#948;)</span>: ";
      break;
  }
}

//This function is called when the user presses the calculate button. The purpose of this function is to calcululate the resonant frequency and Q factor and update the results in the output textboxes.
function calculateLCResonatorCalc() {
  let L = Number(document.getElementById("LCalcInductance").value); //Get inductance
  let C = Number(document.getElementById("CCalcCapacitance").value); //Get capacitance
  let f0 = 1 / math.sqrt(L * C) / 2 / Math.PI; //Calculate resonant frequency
  let numSigFig = 5; // specify precision (makes output look nicer)
  f0 = Number.parseFloat(f0).toPrecision(numSigFig);

  let LCalcLoss = Number(document.getElementById("LCalcLoss").value); //Get L loss value
  let Lval = Number(document.getElementById("indLossTypeCalc").value); //get L loss type value of pull down menu (1 = series resistance, 2 = Q factor, or 3 = dissipation factor)

  let QL = 0;
  //Get Q factor of inductor:
  switch (Lval) {
    case 1: //LCalcLoss = RL (series resistance of L)
      if (LCalcLoss !== 0) {
        //To avoid dividing by zerto
        QL = (2 * math.pi * L * f0) / LCalcLoss;
      } else {
        QL = 1e200; //instead of an infinite Q... Just make it really, reaally large.
      }
      break;
    case 2: //LCalcLoss = QL
      QL = LCalcLoss;
      break;
    case 3: //LCalcLoss = dissipation factor = 1/QL
      QL = 1 / LCalcLoss;
      break;
  }

  let CCalcLoss = Number(document.getElementById("CCalcLoss").value); //Get C loss value
  let Cval = Number(document.getElementById("capLossTypeCalc").value); //get L loss type value of pull down menu (1 = series resistance, 2 = Q factor, or 3 = dissipation factor)
  let QC = 0;
  //Get Q factor of inductor:
  switch (Cval) {
    case 1: //CCalcLoss = RC (series resistance of C)
      if (CCalcLoss !== 0) {
        //To avoid dividing by zerto
        QC = 1 / (2 * math.pi * C * f0) / CCalcLoss;
      } else {
        QC = 1e200; //instead of an infinite Q... Just make it really, reaally large.
      }

      break;
    case 2: //CCalcLoss = QC
      QC = CCalcLoss;
      break;
    case 3: //CCalcLoss = dissipation factor = 1/QC
      QC = 1 / CCalcLoss;
      break;
  }

  let Q = (QC * QL) / (QC + QL);

  //Update resonant frequency textbox value:
  document.getElementById("resFreqCalc").value = f0;
  //Update Q-factor textbox value:
  document.getElementById("qCalc").value = Q;
}

//this function is called when the reset button is presed. it resets all the values in the textboxes to their default values
function resetLCResonatorCalc() {
  document.getElementById("resFreqCalc").value = "";
  document.getElementById("qCalc").value = "";
  document.getElementById("LCalcInductance").value = "37e-6";
  document.getElementById("CCalcCapacitance").value = "9.5e-8";
  document.getElementById("LCalcLoss").value = 40e-3;
  document.getElementById("CCalcLoss").value = 10e-3;
  document.getElementById("capLossTypeCalc").value = 1;
  document.getElementById("indLossTypeCalc").value = 1;
}

//This function is called when the populate primary button is pressed. The purpose of this function is to copy the f0 and Q outputs of the ancillary calculator and paste these values into Q1 and f01 textboxes of the main calculator.
function populatePrimaryCalc() {
  console.log("hi");
  let f0 = document.getElementById("resFreqCalc").value; //Get resonant frequency
  let Q = document.getElementById("qCalc").value; //Get Q
  let L = document.getElementById("LCalcInductance").value; //Get inductance

  document.getElementById("L1").value = L;
  document.getElementById("Q1").value = Q;
  document.getElementById("f01").value = f0;

  updateHash();
}

//This function is called when the populate secondary button is pressed. The purpose of this function is to copy the f02 and Q2 outputs of the ancillary calculator and paste these values into Q and f0 textboxes of the main calculator.
function populateSecondaryCalc() {
  let f0 = document.getElementById("resFreqCalc").value; //Get resonant frequency
  let Q = document.getElementById("qCalc").value; //Get Q
  let L = document.getElementById("LCalcInductance").value; //Get inductance

  document.getElementById("L2").value = L;
  document.getElementById("Q2").value = Q;
  document.getElementById("f02").value = f0;
  buttonFunction();
}
