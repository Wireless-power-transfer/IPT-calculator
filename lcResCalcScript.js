//All functions in this file are concerned with the simple ancillary calculator for finding the Q-factor and resonant frequency of an LC resonator.

//these global variables designate the state of the radio buttons.
var Astate = 1;
var Bstate = 1;
var Cstate = 0;

//The purpose of this function is to change the text when the user selects an inductor loss specification
let indLossTypeCalcFunction = () => {
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
};

//The purpose of this function is to change the text when the user selects a capacitor loss specification
let capLossTypeCalcFunction = () => {
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
};

//This function is called when the user presses the calculate button. The purpose of this function is to calcululate the resonant frequency (or L if C and f0 given or C if L and f0 given), Q factor, ESR RL, and ESR RC and update the results in the output textboxes.
let calculateLCResonatorCalc = () => {
  let L = Number(document.getElementById("LCalcInductance").value); //Get inductance
  let C = Number(document.getElementById("CCalcCapacitance").value); //Get capacitance
  let f0 = Number(document.getElementById("resFreqCalc").value); //Get capacitance

  //user has selected L and C... Find f0;
  if (Astate == 1 && Bstate == 1) {
    f0 = 1 / math.sqrt(L * C) / 2 / Math.PI; //Calculate resonant frequency
    let numSigFig = 5; // specify precision (makes output look nicer)
    f0 = Number.parseFloat(f0).toPrecision(numSigFig);
    document.getElementById("resFreqCalc").value = f0;
  }

  //user has selected L and f0... Find C;
  if (Astate == 1 && Cstate == 1) {
    C = 1 / L / (2 * math.pi * f0) ** 2;

    let numSigFig = 5; // specify precision (makes output look nicer)
    C = Number.parseFloat(C).toPrecision(numSigFig);
    document.getElementById("CCalcCapacitance").value = C;
  }
  //user has selected C and f0... Find L;
  if (Bstate == 1 && Cstate == 1) {
    L = 1 / C / (2 * math.pi * f0) ** 2;

    let numSigFig = 5; // specify precision (makes output look nicer)
    L = Number.parseFloat(L).toPrecision(numSigFig);
    document.getElementById("LCalcInductance").value = L;
  }

  let LCalcLoss = document.getElementById("LCalcLoss").value; //Get L loss value
  let Lval = Number(document.getElementById("indLossTypeCalc").value); //get L loss type value of pull down menu (1 = series resistance, 2 = Q factor, or 3 = dissipation factor)

  let QL = 0;
  let RL = 0;
  //Get Q factor of inductor:
  switch (Lval) {
    case 1: //LCalcLoss = RL (series resistance of L)
      if (LCalcLoss !== 0) {
        //To avoid dividing by zerto
        RL = LCalcLoss;
        QL = (2 * math.pi * L * f0) / LCalcLoss;
      } else {
        QL = 1e200; //instead of an infinite Q... Just make it really, reaally large.
      }
      break;
    case 2: //LCalcLoss = QL
      QL = LCalcLoss;
      RL = (2 * math.pi * f0 * L) / QL;
      break;
    case 3: //LCalcLoss = dissipation factor = 1/QL
      QL = 1 / LCalcLoss;
      RL = (2 * math.pi * f0 * L) / QL;
      break;
  }

  let CCalcLoss = document.getElementById("CCalcLoss").value; //Get C loss value
  let Cval = Number(document.getElementById("capLossTypeCalc").value); //get L loss type value of pull down menu (1 = series resistance, 2 = Q factor, or 3 = dissipation factor)
  let QC = 0;
  let RC = 0;
  //Get Q factor of inductor:
  switch (Cval) {
    case 1: //CCalcLoss = RC (series resistance of C)
      if (Number(CCalcLoss) !== 0) {
        //To avoid dividing by zerto
        RC = CCalcLoss;
        QC = 1 / (2 * math.pi * C * f0) / CCalcLoss;
      } else {
        QC = 1e200; //instead of an infinite Q... Just make it really, reaally large.
      }
      break;
    case 2: //CCalcLoss = QC
      QC = CCalcLoss;
      RC = 1 / QC / (2 * math.pi * f0 * C);
      break;
    case 3: //CCalcLoss = dissipation factor = 1/QC
      QC = 1 / CCalcLoss;
      RC = 1 / QC / (2 * math.pi * f0 * C);
      break;
  }
  console.log("QL = " + QL);
  console.log("QC = " + QC);
  let Q = Number((Number(QC) * Number(QL)) / (Number(QC) + Number(QL)));
  console.log(Q);
  /*  let RL = (2 * math.pi * f0 * L) / QL; */

  //Update RL and RC textbox values
  document.getElementById("RLCalc").value = RL;
  document.getElementById("RCCalc").value = RC;

  let numSigFig = 5; // specify precision (makes output look nicer)

  //Update Q-factor message:
  document.getElementById("QfactorMessage").innerHTML =
    "<br> Unloaded resonator Q-factor = " + Q.toPrecision(numSigFig) + "<br>";
};

//this function is called when the reset button is presed. it resets all the values in the textboxes to their default values
document.getElementById("resetButton2").addEventListener("click", () => {
  document.getElementById("resFreqCalc").value = "";
  /* document.getElementById("qCalc").value = ""; */
  document.getElementById("LCalcInductance").value = "37e-6";
  document.getElementById("CCalcCapacitance").value = "9.5e-8";
  document.getElementById("LCalcLoss").value = "45e-3";
  document.getElementById("CCalcLoss").value = "1e-3";
  document.getElementById("capLossTypeCalc").value = 1;
  document.getElementById("indLossTypeCalc").value = 1;
  document.getElementById("QfactorMessage").innerHTML = "";
  document.getElementById("RLCalc").value = "";

  document.getElementById("RCCalc").value = "";
});

//This function is called when the populate primary button is pressed. The purpose of this function is to copy the f0 and Q outputs of the ancillary calculator and paste these values into Q1 and f01 textboxes of the main calculator.
function populatePrimaryCalc() {
  let RL = document.getElementById("RLCalc").value; //Get resonant frequency
  let RC = document.getElementById("RCCalc").value; //Get Q
  let L = document.getElementById("LCalcInductance").value; //Get inductance
  document.getElementById("L1").value = L;
  document.getElementById("RL1").value = RL;
  document.getElementById("RC1").value = RC;
  updateHash();
}

//This function is called when the populate secondary button is pressed. The purpose of this function is to copy the f02 and Q2 outputs of the ancillary calculator and paste these values into Q and f0 textboxes of the main calculator.
function populateSecondaryCalc() {
  let RL = document.getElementById("RLCalc").value; //Get resonant frequency
  let RC = document.getElementById("RCCalc").value; //Get Q
  let L = document.getElementById("LCalcInductance").value; //Get inductance
  document.getElementById("L2").value = L;
  document.getElementById("RL2").value = RL;
  document.getElementById("RC2").value = RC;
  updateHash();
}

//All this code below just ensures that only two of the three radio buttons are pressed.

function clickA() {
  if (Astate == 0) {
    Astate = 1;
    document.getElementById("B").checked = false;
    Bstate = 0;
    document.getElementById("A").checked = true;
    Cstate = 1;
    return;
  }

  if (Astate == 1) {
    document.getElementById("A").checked = false;
    Astate = 0;
    document.getElementById("B").checked = true;
    Bstate = 1;
    document.getElementById("C").checked = true;
    Cstate = 1;
    return;
  }
}
function clickB() {
  if (Bstate == 0) {
    document.getElementById("B").checked = true;
    Bstate = 1;
    document.getElementById("C").checked = false;
    Cstate = 0;
    return;
  }

  if (Bstate == 1) {
    document.getElementById("A").checked = true;
    Astate = 1;
    document.getElementById("B").checked = false;
    Bstate = 0;
    document.getElementById("C").checked = true;
    Cstate = 1;
    return;
  }
}
function clickC() {
  if (Cstate == 0) {
    document.getElementById("A").checked = false;
    Astate = 0;
    document.getElementById("C").checked = true;
    Cstate = 1;
    return;
  }

  if (Cstate == 1) {
    document.getElementById("A").checked = true;
    Astate = 1;
    document.getElementById("B").checked = true;
    Bstate = 1;
    document.getElementById("C").checked = false;
    Cstate = 0;
    return;
  }
}
