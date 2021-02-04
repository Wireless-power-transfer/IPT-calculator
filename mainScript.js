//Author: Aaron Scher
//This function is called from index.html as soon as the page is done loading. The purpose of this function is to initialize the URL hash tag routine (i.e., anchor part of the URL) and call the button function to generate the plots.
function initFunction() {
  //initValuesFromHash()
  buttonFunction();
}

var open = 0; //1 means the sidebar is open

function openNav() {
  if (open == 1) {
    document.getElementById("mySideBar").style.width = "320px";
    document.getElementById("main").style.marginLeft = "340px";
    document.getElementById("openbtn").innerHTML = "&#9776; Close Sidebar";
    open = 0;
    return;
  }

  if (open == 0) {
    document.getElementById("mySideBar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("openbtn").innerHTML = "&#9776; Open Sidebar";
    open = 1;
    return;
  }
}

//This function is called immediately after the user changes the source type (choice between constant voltage and constant current). The purpose of this function is to change the text label to reflect the user's selection.
function sourceSelectFunction() {
  updateHash();
  let sourceType = Number(document.getElementById("source").value);
  if (sourceType == 1) {
    document.getElementById("sourceTypeLabel").innerHTML =
      "&nbsp;&nbsp;Input DC voltage, <span style='font-family:Times New Roman'><i> V<sub>g</sub> </i></span> (V): ";
  }
  if (sourceType == 2) {
    document.getElementById("sourceTypeLabel").innerHTML =
      "&nbsp;&nbsp;Input DC current, <span style='font-family:Times New Roman'><i> I<sub>g</sub> </i></span> (A): ";
  }
  return sourceType;
}

//This funciton is called immediately after the user changes the load type (choice between RL, VL, IL, and PL). The purpose of this function is to change the text label to reflect the user's selection.
function loadSelectFunction() {
  updateHash();
  let loadType = Number(document.getElementById("load").value);
  if (loadType == 1) {
    //RL
    document.getElementById("loadTypeLabel").innerHTML =
      "&nbsp;&nbsp;Load resistance, <span style='font-family:Times New Roman'><i> R<sub>L</sub> </i></span> (Ohm): ";
  }
  if (loadType == 2) {
    //VL
    document.getElementById("loadTypeLabel").innerHTML =
      "&nbsp;&nbsp;Load voltage, <span style='font-family:Times New Roman'><i> V<sub>L</sub> </i></span> (V): ";
  }
  if (loadType == 3) {
    //IL
    document.getElementById("loadTypeLabel").innerHTML =
      "&nbsp;&nbsp;Load current, <span style='font-family:Times New Roman'><i> I<sub>L</sub> </i></span> (A): ";
  }
  if (loadType == 4) {
    //PLV
    document.getElementById("loadTypeLabel").innerHTML =
      "&nbsp;&nbsp;Load power, <span style='font-family:Times New Roman'><i> P<sub>L</sub> </i></span> (W): ";
  }
  if (loadType == 5) {
    //PLI
    document.getElementById("loadTypeLabel").innerHTML =
      "&nbsp;&nbsp;Load power, <span style='font-family:Times New Roman'><i> P<sub>L</sub> </i></span> (W): ";
  }
  return loadType;
}

//This function is called when the download output as CSV button is pressed.
function downloadCSV(
  freq,
  efficiency,
  P1,
  P2,
  magV1,
  magI1,
  magV2,
  magI2,
  angZin,
  magZin,
  VL,
  IL,
  Vg,
  Ig,
  RL,
  magVC1,
  magVC2,
  Pl1,
  Pl2
) {
  let csvTextRow = [];
  csvTextRow[0] = "Input parameters: " + getHashValue() + "\n";
  csvTextRow[1] = "efficiency," + efficiency.join(",") + "\n";
  csvTextRow[2] = "P1," + P1.join(",") + "\n";
  csvTextRow[3] = "P2," + P2.join(",") + "\n";
  csvTextRow[4] = "magV1," + magV1.join(",") + "\n";
  csvTextRow[5] = "magI1," + magI1.join(",") + "\n";
  csvTextRow[6] = "magV2," + magV2.join(",") + "\n";
  csvTextRow[7] = "magI2," + magI2.join(",") + "\n";
  csvTextRow[8] = "angZin," + angZin.join(",") + "\n";
  csvTextRow[9] = "magZin," + magZin.join(",") + "\n";
  csvTextRow[10] = "VL," + VL.join(",") + "\n";
  csvTextRow[11] = "IL," + IL.join(",") + "\n";
  csvTextRow[12] = "Vg," + Vg.join(",") + "\n";
  csvTextRow[13] = "Ig," + Ig.join(",") + "\n";
  csvTextRow[14] = "RL," + RL.join(",") + "\n";
  csvTextRow[15] = "magVC1," + magVC1.join(",") + "\n";
  csvTextRow[16] = "magVC2," + magVC2.join(",") + "\n";
  csvTextRow[17] = "Pl1," + Pl1.join(",") + "\n";
  csvTextRow[18] = "Pl2," + Pl2.join(",");

  let text = [];

  for (let i = 0; i < csvTextRow.length; i++) {
    text += csvTextRow[i];
  }

  download("OutputSSIPT.csv", text);
}

//This function is used by the downloadCSV() function (see above)
function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

//This is the main function that analyzes the circuit. it's called "buttonFunction" because originally, there was a big button that the user pressed to analyze. Then I went with the hash system which automatically calls this function when a change is implement (and so I got rid of the button.)

function buttonFunction(genCSV) {
  initValuesFromHash();
  document.getElementById("errorMessage").innerHTML = ""; //clear the error messages

  //Get source and load types:
  let sourceType = sourceSelectFunction(); //Indicates source type. Will return 1 for Vg or 2 for Ig

  let loadType = loadSelectFunction(); //Indicates load type. Will return RL,VL, IL, or PL

  //Get values out of text boxes and convert to numbers:
  //let Vg = Number(document.getElementById("Vg_Ig").value);
  //let RL = Number(document.getElementById("RL_VL_IL_PL").value);

  let sourceValue_Vg_Ig = Number(document.getElementById("Vg_Ig").value); //new
  let loadValue_RL_VL_IL_PL = Number(
    document.getElementById("RL_VL_IL_PL").value
  ); //new

  let k = Number(document.getElementById("k").value); //coupling coefficient
  let L1 = Number(document.getElementById("L1").value); //primary inductance
  let L2 = Number(document.getElementById("L2").value); //secondary inductance
  let Q1 = Number(document.getElementById("Q1").value); //quality factor Q1 (primary)
  let Q2 = Number(document.getElementById("Q2").value); //quality factor Q2 (secondary)
  let f01 = Number(document.getElementById("f01").value); //primary resonant frequency
  let f02 = Number(document.getElementById("f02").value); //secondary resonant frequency
  let fmin = Number(document.getElementById("fmin").value); //minimum frequency to plot
  let fmax = Number(document.getElementById("fmax").value); //maximun frequency to plot
  let fnum = Number(document.getElementById("fnum").value); //number of frequency points in plot
  let invConst = Number(document.getElementById("inverter").value); //invConst = 1 (half bridge) and =2 (full bridge)
  let rectConst = Number(document.getElementById("rectifier").value); //rectConst = 1 (half bridge) and =2 (full bridge)
  let Ron = Number(document.getElementById("Ron").value); //MOSFET on resistance
  let Vfwd = Number(document.getElementById("Vfwd").value); //diode forward voltage

  //Calculate and define other parameters and variables:
  let R1 = (2 * math.pi * f01 * L1) / Q1 + Ron * invConst; //compute R1 (ESR of primary)
  let R2 = (2 * math.pi * f02 * L2) / Q2; //compute R2 (ESR of secndary)
  let C1 = 1 / (2 * math.pi * f01) ** 2 / L1; //compute C1 (primary)
  let C2 = 1 / (2 * math.pi * f02) ** 2 / L2; //compute C2 (secondary)
  let delta_f = (fmax - fmin) / (fnum - 1); //frequency step size
  let freq = []; //define frequency variable as an array
  let M = k * math.sqrt(L1 * L2); //calculate mutual inductance
  let systemABCDmatrix = []; //initialize array to hold the system ABCD matrices
  let A = []; //initialize A of system's ABCD matrix
  let B = []; //initialize B of system's ABCD matrix
  let C = []; //initialize C of system's ABCD matrix
  let D = []; //initialize D of system's ABCD matrix
  let I2 = []; //initialize secondary current
  let V2 = []; //initialize secondary voltage
  let I1 = []; //initialize primary current
  let P1 = []; //initialize input power
  let P2 = []; //initialize output power
  let efficiency = []; //initialize power transfer efficiency
  let seriesPrimary = new SeriesElement(L1, C1, R1, []); //create series primary object
  let seriesSecondary = new SeriesElement(L2, C2, R2, []); //create series secondary object
  let SSIPT_System = new TotalIPTSystem(); //create total IPT system object
  let Kinverter = new KinverterElement([]); //create K inverter object
  let K = []; //initialize K value
  let Pl1 = []; //power loss in primary resonator
  let Pl2 = []; //power loss in secondary resonator
  let magI2 = []; //magntidue of I2
  let magI1 = []; //magntidue of I1
  let magV1 = []; //magntidue of V1
  let magVC1 = []; //magntidue of voltage across primary capacitor
  let magVC2 = []; //magntidue of voltage across secondary capacitor
  let magV2 = []; //magntiude of output voltage (AC)
  let Zin = []; //Input impedance
  let angZin = []; //Angle of input impedance
  let magZin = []; //Magntiude of input impedance
  let VL = []; //output DC voltage across load
  let IL = []; //output DC current through load
  let Vg = [];
  let Ig = [];
  let RL = [];
  let PL = []; //power delivered to DC load
  let = specialOutputMessage = []; //special output message that appears after the calculate and plot button is pressed

  let mNum = 3; //Number of times to iterate over diode
  // Analyze circuit at each frequency using ABCD matrices
  for (let i = 0; i < fnum; i++) {
    let etaDiode = 1; //Start diode iteration with diode rectifier efficiency = 1.
    SSIPT_System.etaDiode = etaDiode;
    for (let m = 0; m < mNum; m++) {
      freq[i] = fmin + delta_f * i; //evaluate frequency at index i
      seriesPrimary.f = freq[i]; //assign current frequency to the series primary object
      seriesPrimary.createABCD(); //create ABCD matrix that models series primary object
      seriesSecondary.f = freq[i]; //assign current frequency to the series secondary object
      seriesSecondary.createABCD(); //create ABCD matrix that models series secondary object
      K = 2 * math.pi * freq[i] * M; //equivalent value of K for K inverter
      Kinverter.K = K; //set value of K
      Kinverter.createABCD(); //crearte ABCD matrix that models K inverter

      systemABCDmatrix = math.multiply(
        seriesPrimary.ABCD,
        Kinverter.ABCD,
        seriesSecondary.ABCD
      ); //Compute system ABCD matrix:

      SSIPT_System.A = systemABCDmatrix.subset(math.index(0, 0)); //extract individual A of system's ABCD matrix and assign
      SSIPT_System.B = systemABCDmatrix.subset(math.index(0, 1)); //extract individual B of system's ABCD matrix and assign
      SSIPT_System.C = systemABCDmatrix.subset(math.index(1, 0)); //extract individual C of system's ABCD matrix and assign
      SSIPT_System.D = systemABCDmatrix.subset(math.index(1, 1)); //extract individual D of system's ABCD matrix and assign
      SSIPT_System.SolveForI1_I2_V1_V2(
        sourceType,
        loadType,
        sourceValue_Vg_Ig,
        loadValue_RL_VL_IL_PL,
        rectConst,
        invConst
      ); //find I1, I2, V1, and V2

      //////Define arrays for plotting. These arrays below are general, in that they hold for any SISO two-port IPT system (not just series-series):
      magV1[i] = SSIPT_System.magV1; //magntiude of AC input voltage
      magV2[i] = SSIPT_System.magV2; //magnitude of AC output voltage
      magI1[i] = SSIPT_System.magI1; //magntitude of AC input current
      magI2[i] = SSIPT_System.magI2; //magntidue of AC output current
      P1[i] = SSIPT_System.P1;
      P2[i] = SSIPT_System.P2;
      Zin[i] = SSIPT_System.Zin;
      angZin[i] = SSIPT_System.angZin;
      magZin[i] = SSIPT_System.magZin;
      VL[i] = SSIPT_System.VL;
      IL[i] = SSIPT_System.IL;
      efficiency[i] = SSIPT_System.efficiency;
      Vg[i] = SSIPT_System.Vg; //ADD ON
      Ig[i] = SSIPT_System.Ig; //ADD ON
      RL[i] = SSIPT_System.RL; //ADD ON
      PL[i] = SSIPT_System.PL; //ADD ON

      //Calculate arrays using equations specific to the SSIPT system:
      magVC1[i] = magI1[i] / freq[i] / math.pi / 2 / C1; //magntiude of voltage across primary capacitor
      magVC2[i] = magI2[i] / freq[i] / math.pi / 2 / C2; //magntiude of voltage across secondary capacitor
      Pl1[i] = (magI1[i] * magI1[i] * R1) / 2;
      Pl2[i] = (magI2[i] * magI2[i] * R2) / 2;

      //Handle the diode

      etaDiode = 1 / (1 + (2 * Vfwd) / VL[i]);
      if (VL[i] == 0) {
        etaDiode = 0;
      }
      SSIPT_System.etaDiode = etaDiode;
    }
  }

  if (genCSV == 1) {
    downloadCSV(
      freq,
      efficiency,
      P1,
      P2,
      magV1,
      magI1,
      magV2,
      magI2,
      angZin,
      magZin,
      VL,
      IL,
      Vg,
      Ig,
      RL,
      magVC1,
      magVC2,
      Pl1,
      Pl2
    );
  }

  document.getElementById("resultsMessage").innerHTML =
    "Calculated: <span class = 'equationStyle'><i>C</i><sub>1</sub></span> = " +
    math.format(C1, 3) +
    " F, <span class = 'equationStyle'><i>C</i><sub>2</sub></span> = " +
    math.format(C2, 3) +
    " F, " +
    "<span class = 'equationStyle'><i>R</i><sub>1</sub></span> = " +
    math.format(R1, 3) +
    " Ohm, " +
    "<span class = 'equationStyle'><i>R</i><sub>2</sub></span> = " +
    math.format(R2, 3) +
    " Ohm, " +
    "<span class = 'equationStyle'><i>M</i></span> = " +
    math.format(M, 3) +
    " H. " +
    specialOutputMessage;

  setImage(sourceType, invConst, rectConst, loadType);

  let precision = 3;
  plotGenFunction(
    freq,
    efficiency,
    P1,
    PL,
    magV1,
    magI1,
    magV2,
    magI2,
    angZin,
    magZin,
    VL,
    IL,
    Vg,
    Ig,
    RL,
    magVC1,
    magVC2,
    Pl1,
    Pl2
  );
}

//Create the objects
class SeriesElement {
  constructor(L, C, R, f) {
    this.L = L;
    this.C = C;
    this.R = R;
    this.f = f;
    this.ABCD = [];
  }
  createABCD() {
    let w = 2 * math.pi * this.f;
    let A = 1;
    let B = math.complex(this.R, w * this.L - 1 / this.C / w);
    let C = 0;
    let D = 1;
    this.ABCD = math.matrix([
      [A, B],
      [C, D],
    ]);
  }
}

class KinverterElement {
  constructor(K) {
    this.K = [];
  }
  createABCD() {
    let A = 0;
    let B = math.complex(0, -this.K);
    let C = math.complex(0, -1 / this.K);
    let D = 0;
    this.ABCD = math.matrix([
      [A, B],
      [C, D],
    ]);
  }
}

class TotalIPTSystem {
  constructor() {
    this.A = [];
    this.B = [];
    this.C = [];
    this.D = [];
    this.I1 = [];
    this.I2 = [];
    this.V1 = [];
    this.V2 = [];
    this.magI1 = [];
    this.magI2 = [];
    this.magV1 = [];
    this.magV2 = [];
    this.P1 = [];
    this.P2 = [];
    this.Zin = [];
    this.angZin = [];
    this.magZin = [];
    this.VL = [];
    this.IL = [];
    this.Vg = [];
    this.Ig = [];
    this.RL = [];
    this.ReL = [];
    this.efficiency = [];
    this.etaDiode = [];
    this.PL = [];
  }
  SolveForI1_I2_V1_V2(
    sourceType,
    loadType,
    sourceValue_Vg_Ig,
    loadValue_RL_VL_IL_PL,
    rectConst,
    invConst
  ) {
    let errorFlag = 0;

    if (sourceType == 1 && loadType == 1) {
      //Source = Vg and Load = RL
      this.Vg = sourceValue_Vg_Ig; //DC input voltage is defined by user
      this.V1 = (this.Vg * 2 * invConst) / math.pi; //calculate AC input voltage
      this.RL = loadValue_RL_VL_IL_PL; //Load resistance is defined by user
      this.ReL =
        (this.RL * 2 * rectConst * rectConst) /
        math.pi /
        math.pi /
        this.etaDiode; //calculate effective AC resistance
      this.I2 = math.divide(
        this.V1,
        math.add(math.multiply(this.A, this.ReL), this.B)
      ); //Find I2
      this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
      this.I1 = math.add(
        math.multiply(this.C, this.V2),
        math.multiply(this.D, this.I2)
      ); //Solve for I1
    }

    if (sourceType == 2 && loadType == 1) {
      //Ig and RL
      this.Ig = sourceValue_Vg_Ig; //DC input current is defined by user
      this.I1 = (this.Ig * math.pi) / invConst; //AC current I1 calculated using Ig defined by user
      this.RL = loadValue_RL_VL_IL_PL; //Load resistance is defined by user
      this.ReL =
        (this.RL * 2 * rectConst * rectConst) /
        math.pi /
        math.pi /
        this.etaDiode; //calculate effective AC resistance
      this.I2 = math.divide(
        this.I1,
        math.add(math.multiply(this.C, this.ReL), this.D)
      );
      this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
      this.V1 = math.add(
        math.multiply(this.A, this.V2),
        math.multiply(this.B, this.I2)
      );
    }

    if (sourceType == 1 && loadType == 2) {
      //Source = Vg and Load = VL
      this.Vg = sourceValue_Vg_Ig; //DC input voltage is defined by user
      this.V1 = (this.Vg * 2 * invConst) / math.pi; //calculate AC input voltage
      this.magV2 =
        (loadValue_RL_VL_IL_PL * 2 * rectConst) / math.pi / this.etaDiode; //AC voltage defined by user

      //Solve for ReL by solving quadratic equation: a_*ReL^2+b_*ReL+c_ = 0
      let a_ = math.abs(this.A) ** 2 - (this.V1 / this.magV2) ** 2;
      let b_ = math.add(
        math.multiply(this.A, math.conj(this.B)),
        math.multiply(this.B, math.conj(this.A))
      );
      let c_ = math.abs(this.B) ** 2;
      //First solution to try for ReL:
      this.ReL = math.divide(
        math.subtract(-b_, math.sqrt(b_ ** 2 - 4 * a_ * c_)),
        2 * a_
      );
      this.I2 = math.divide(
        this.V1,
        math.add(math.multiply(this.A, this.ReL), this.B)
      ); //Find I2
      this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
      this.I1 = math.add(
        math.multiply(this.C, this.V2),
        math.multiply(this.D, this.I2)
      ); //Solve for I1
      //Second solution to try for ReL:
      if (math.re(this.ReL) <= 0 || math.im(this.ReL) !== 0) {
        this.ReL = math.divide(
          math.add(-b_, math.sqrt(b_ ** 2 - 4 * a_ * c_)),
          2 * a_
        );
        this.I2 = math.divide(
          this.V1,
          math.add(math.multiply(this.A, this.ReL), this.B)
        ); //Find I2
        this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
        this.I1 = math.add(
          math.multiply(this.C, this.V2),
          math.multiply(this.D, this.I2)
        ); //Solve for I1
      }
      //If both solutions for ReL are not physical then flag the error
      if (math.re(this.ReL) <= 0 || math.im(this.ReL) !== 0) {
        errorFlag = 1;
        document.getElementById("errorMessage").innerHTML =
          "<span style='color:red'>Error detected. Unable to achieve specified output voltage for at least one frequency value in the span. All parameter values are set to zero in plots below at frequencies in which the desired output voltage is unable to be achieved.</span>";
      }
    }

    if (sourceType == 2 && loadType == 2) {
      //Ig and VL
      this.Ig = sourceValue_Vg_Ig; //DC input current is defined by user
      this.I1 = (this.Ig * math.pi) / invConst; //AC current I1 calculated using Ig defined by user
      this.magV2 =
        (loadValue_RL_VL_IL_PL * 2 * rectConst) / math.pi / this.etaDiode; //AC load voltage defined by user's choice of VL
      //Solve for ReL by solving quadratic equation: a_*ReL^2+b_*ReL+c_ = 0
      let a_ = math.abs(this.C) ** 2 - (this.I1 / this.magV2) ** 2;
      let b_ = math.add(
        math.multiply(this.C, math.conj(this.D)),
        math.multiply(this.D, math.conj(this.C))
      );
      let c_ = math.abs(this.D) ** 2;
      //First solution to try for ReL:
      this.ReL = math.divide(
        math.subtract(-b_, math.sqrt(b_ ** 2 - 4 * a_ * c_)),
        2 * a_
      );
      this.I2 = math.divide(
        this.I1,
        math.add(math.multiply(this.C, this.ReL), this.D)
      );
      this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
      this.V1 = math.add(
        math.multiply(this.A, this.V2),
        math.multiply(this.B, this.I2)
      );
      //Second solution to try for ReL:
      if (math.re(this.ReL) <= 0 || math.im(this.ReL) !== 0) {
        this.ReL = math.divide(
          math.add(-b_, math.sqrt(b_ ** 2 - 4 * a_ * c_)),
          2 * a_
        );
        this.I2 = math.divide(
          this.I1,
          math.add(math.multiply(this.C, this.ReL), this.D)
        );
        this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
        this.V1 = math.add(
          math.multiply(this.A, this.V2),
          math.multiply(this.B, this.I2)
        );
      }
      //If both solutions for ReL are not physical then flag the error
      if (math.re(this.ReL) <= 0 || math.im(this.ReL) !== 0) {
        errorFlag = 1;
        document.getElementById("errorMessage").innerHTML =
          "<span style='color:red'>Error detected. Unable to achieve specified output voltage for at least one frequency value in the span. All parameter values are set to zero in plots below at frequencies in which the desired output voltage is unable to be achieved.</span>";
      }
    }

    if (sourceType == 1 && loadType == 3) {
      //Vg and IL

      this.Vg = sourceValue_Vg_Ig; //DC input voltage is defined by user
      this.V1 = (this.Vg * 2 * invConst) / math.pi; //calculate AC input voltage
      this.magI2 = (loadValue_RL_VL_IL_PL * math.pi) / rectConst; ///AC current defined by user's choice of IL
      let a_ = math.abs(this.A) ** 2;
      let b_ = math.add(
        math.multiply(this.A, math.conj(this.B)),
        math.multiply(this.B, math.conj(this.A))
      );
      let c_ = math.abs(this.B) ** 2 - (this.V1 / this.magI2) ** 2;
      //First solution to try for ReL:
      this.ReL = math.divide(
        math.subtract(-b_, math.sqrt(b_ ** 2 - 4 * a_ * c_)),
        2 * a_
      );
      this.I2 = math.divide(
        this.V1,
        math.add(math.multiply(this.A, this.ReL), this.B)
      ); //Find I2

      this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
      this.I1 = math.add(
        math.multiply(this.C, this.V2),
        math.multiply(this.D, this.I2)
      ); //Solve for I1
      //Second solution to try for ReL:

      if (math.re(this.ReL) <= 0 || math.im(this.ReL) !== 0) {
        this.ReL = math.divide(
          math.add(-b_, math.sqrt(b_ ** 2 - 4 * a_ * c_)),
          2 * a_
        );
        this.I2 = math.divide(
          this.V1,
          math.add(math.multiply(this.A, this.ReL), this.B)
        ); //Find I2
        this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
        this.I1 = math.add(
          math.multiply(this.C, this.V2),
          math.multiply(this.D, this.I2)
        ); //Solve for I1
      }
      //If both solutions for ReL are not physical then flag the error
      if (math.re(this.ReL) <= 0 || math.im(this.ReL) !== 0) {
        errorFlag = 1;
        document.getElementById("errorMessage").innerHTML =
          "<span style='color:red'>Error detected. Unable to achieve specified output current for at least one frequency value in the span. All parameter values are set to zero in plots below at frequencies in which the desired output current is unable to be achieved.</span>";
      }
    }

    if (sourceType == 2 && loadType == 3) {
      //Ig and IL
      this.Ig = sourceValue_Vg_Ig; //DC input current is defined by user
      this.I1 = (this.Ig * math.pi) / invConst; //AC current I1 calculated using Ig defined by user
      this.magI2 = (loadValue_RL_VL_IL_PL * math.pi) / rectConst; ///AC current defined by user's choice of IL
      //Solve for ReL by solving quadratic equation: a_*ReL^2+b_*ReL+c_ = 0
      let a_ = math.abs(this.C) ** 2 - (this.I1 / this.magI2) ** 2;
      let b_ = math.add(
        math.multiply(this.C, math.conj(this.D)),
        math.multiply(this.D, math.conj(this.C))
      );
      let c_ = math.abs(this.D) ** 2;
      //First solution to try for ReL:
      this.ReL = math.divide(
        math.subtract(-b_, math.sqrt(b_ ** 2 - 4 * a_ * c_)),
        2 * a_
      );
      this.I2 = math.divide(
        this.I1,
        math.add(math.multiply(this.C, this.ReL), this.D)
      );
      this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
      this.V1 = math.add(
        math.multiply(this.A, this.V2),
        math.multiply(this.B, this.I2)
      );
      //Second solution to try for ReL:
      if (math.re(this.ReL) <= 0 || math.im(this.ReL) !== 0) {
        this.ReL = math.divide(
          math.add(-b_, math.sqrt(b_ ** 2 - 4 * a_ * c_)),
          2 * a_
        );
        this.I2 = math.divide(
          this.I1,
          math.add(math.multiply(this.C, this.ReL), this.D)
        );
        this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
        this.V1 = math.add(
          math.multiply(this.A, this.V2),
          math.multiply(this.B, this.I2)
        );
      }
      //If both solutions for ReL are not physical then flag the error
      if (math.re(this.ReL) <= 0 || math.im(this.ReL) !== 0) {
        errorFlag = 1;
        document.getElementById("errorMessage").innerHTML =
          "<span style='color:red'>Error detected. Unable to achieve specified output current for at least one frequency value in the span. All parameter values are set to zero in plots below at frequencies in which the desired output current is unable to be achieved.</span>";
      }
    }

    if (sourceType == 1 && loadType == 4) {
      //Vg and PLV
      this.Vg = sourceValue_Vg_Ig; //DC input voltage is defined by user
      this.V1 = (this.Vg * 2 * invConst) / math.pi; //calculate AC input voltage
      this.P2 = loadValue_RL_VL_IL_PL / this.etaDiode; ///Load power
      let Zth = math.divide(this.B, this.A); //Equivalent thevenin impedance in terms of ABCD parameters
      let Vth = math.divide(this.V1, this.A); // equivalent thevenin voltage in terms of ABCD parameters
      //let P2Available = (math.abs(Vth) ** 2) / 8 / math.re(Zth) //Available power from source

      let P2Available =
        (math.abs(Zth) * math.abs(Vth) ** 2) /
        2 /
        math.abs(math.add(Zth, math.abs(Zth))) ** 2; //Available power from source
      if (P2Available >= this.P2) {
        let ReL_firstPart = math.abs(Vth) ** 2 / 4 / this.P2 - math.re(Zth);
        let ReL_secondPart = math.sqrt(ReL_firstPart ** 2 - math.abs(Zth) ** 2);
        this.ReL = ReL_firstPart + ReL_secondPart;
        this.RL = (this.ReL / 2 / rectConst ** 2) * math.pi ** 2; //Load resistance
        this.I2 = math.divide(Vth, math.add(Zth, this.ReL));
        this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
        this.I1 = math.add(
          math.multiply(this.C, this.V2),
          math.multiply(this.D, this.I2)
        ); //Solve for I1
      } else {
        errorFlag = 1;
        document.getElementById("errorMessage").innerHTML =
          "<span style='color:red'>Error detected. Unable to achieve specified output power for at least one frequency value in the span. All parameter values are set to zero in plots below at frequencies in which the desired output power is unable to be achieved.</span>";
      }
    }

    if (sourceType == 1 && loadType == 5) {
      //Vg and PLI
      this.Vg = sourceValue_Vg_Ig; //DC input voltage is defined by user
      this.V1 = (this.Vg * 2 * invConst) / math.pi; //calculate AC input voltage
      this.P2 = loadValue_RL_VL_IL_PL / this.etaDiode; ///Load power
      let Zth = math.divide(this.B, this.A); //Equivalent thevenin impedance in terms of ABCD parameters
      let Vth = math.divide(this.V1, this.A); // equivalent thevenin voltage in terms of ABCD parameters
      //let P2Available = (math.abs(Vth) ** 2) / 8 / math.re(Zth) //Available power from source

      let P2Available =
        (math.abs(Zth) * math.abs(Vth) ** 2) /
        2 /
        math.abs(math.add(Zth, math.abs(Zth))) ** 2; //Available power from source
      if (P2Available >= this.P2) {
        let ReL_firstPart = math.abs(Vth) ** 2 / 4 / this.P2 - math.re(Zth);
        let ReL_secondPart = math.sqrt(ReL_firstPart ** 2 - math.abs(Zth) ** 2);
        this.ReL = ReL_firstPart - ReL_secondPart;
        this.RL = (this.ReL / 2 / rectConst ** 2) * math.pi ** 2; //Load resistance
        this.I2 = math.divide(Vth, math.add(Zth, this.ReL));
        this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
        this.I1 = math.add(
          math.multiply(this.C, this.V2),
          math.multiply(this.D, this.I2)
        ); //Solve for I1
      } else {
        errorFlag = 1;
        document.getElementById("errorMessage").innerHTML =
          "<span style='color:red'>Error detected. Unable to achieve specified output power for at least one frequency value in the span. All parameter values are set to zero in plots below at frequencies in which the desired output power is unable to be achieved.</span>";
      }
    }

    if (sourceType == 2 && loadType == 4) {
      //Ig and PLV
      this.Ig = sourceValue_Vg_Ig; //DC input current is defined by user
      this.I1 = (this.Ig * math.pi) / invConst; //AC current I1 calculated using Ig defined by user
      this.P2 = loadValue_RL_VL_IL_PL / this.etaDiode; ///Load power
      let Zth = math.divide(this.D, this.C); //Equivalent thevenin impedance in terms of ABCD parameters
      let Vth = math.divide(this.I1, this.C); // equivalent thevenin voltage in terms of ABCD parameters
      //let P2Available = (math.abs(Vth) ** 2) / 8 / math.re(Zth) //Available power from source

      let P2Available =
        (math.abs(Zth) * math.abs(Vth) ** 2) /
        2 /
        math.abs(math.add(Zth, math.abs(Zth))) ** 2; //Available power from source
      if (P2Available >= this.P2) {
        let ReL_firstPart = math.abs(Vth) ** 2 / 4 / this.P2 - math.re(Zth);
        let ReL_secondPart = math.sqrt(ReL_firstPart ** 2 - math.abs(Zth) ** 2);
        this.ReL = ReL_firstPart + ReL_secondPart;
        this.RL = (this.ReL / 2 / rectConst ** 2) * math.pi ** 2; //Load resistance
        this.I2 = math.divide(Vth, math.add(Zth, this.ReL));
        this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
        this.V1 = math.add(
          math.multiply(this.A, this.V2),
          math.multiply(this.B, this.I2)
        );
      } else {
        errorFlag = 1;
        document.getElementById("errorMessage").innerHTML =
          "<span style='color:red'>Error detected. Unable to achieve specified output power for at least one frequency value in the span. All parameter values are set to zero in plots below at frequencies in which the desired output power is unable to be achieved.</span>";
      }
    }

    if (sourceType == 2 && loadType == 5) {
      //Ig and PLI
      this.Ig = sourceValue_Vg_Ig; //DC input current is defined by user
      this.I1 = (this.Ig * math.pi) / invConst; //AC current I1 calculated using Ig defined by user
      this.P2 = loadValue_RL_VL_IL_PL / this.etaDiode; ///Load power
      let Zth = math.divide(this.D, this.C); //Equivalent thevenin impedance in terms of ABCD parameters
      let Vth = math.divide(this.I1, this.C); // equivalent thevenin voltage in terms of ABCD parameters
      //let P2Available = (math.abs(Vth) ** 2) / 8 / math.re(Zth) //Available power from source

      let P2Available =
        (math.abs(Zth) * math.abs(Vth) ** 2) /
        2 /
        math.abs(math.add(Zth, math.abs(Zth))) ** 2; //Available power from source
      if (P2Available >= this.P2) {
        let ReL_firstPart = math.abs(Vth) ** 2 / 4 / this.P2 - math.re(Zth);
        let ReL_secondPart = math.sqrt(ReL_firstPart ** 2 - math.abs(Zth) ** 2);
        this.ReL = ReL_firstPart - ReL_secondPart;
        this.RL = (this.ReL / 2 / rectConst ** 2) * math.pi ** 2; //Load resistance
        this.I2 = math.divide(Vth, math.add(Zth, this.ReL));
        this.V2 = math.multiply(this.I2, this.ReL); //Solve for V2
        this.V1 = math.add(
          math.multiply(this.A, this.V2),
          math.multiply(this.B, this.I2)
        );
      } else {
        errorFlag = 1;
        document.getElementById("errorMessage").innerHTML =
          "<span style='color:red'>Error detected. Unable to achieve specified output power for at least one frequency value in the span. All parameter values are set to zero in plots below at frequencies in which the desired output power is unable to be achieved.</span>";
      }
    }

    if (errorFlag == 1) {
      this.P2 = 0; //Solve for output power
      this.P1 = 0; //Solve for input power
      this.efficiency = 0; //calculate power transfer efficiency
      this.magI2 = 0; //magntiude of secondary current
      this.magI1 = 0; //magntidue of primary current
      this.magV2 = 0; //magnitude of output AC voltage
      this.magV1 = 0; //magnitude of input AC voltage
      this.Zin = 0; //Input impedance Zin
      this.angZin = 0; //Angle of input impedance
      this.magZin = 0; //Magnitude of input impedance
      this.ReL = 0;
      this.VL = 0;
      this.IL = 0;
      this.RL = 0;
      this.magV2 = 0;
      this.Ig = 0;
      this.PL = 0;
      this.Vg = 0;
    } else {
      this.P2 = math.re(
        math.divide(math.multiply(math.conj(this.I2), this.V2), 2)
      ); //Solve for output power
      this.PL = this.P2 * this.etaDiode;
      this.P1 = math.re(
        math.divide(math.multiply(math.conj(this.I1), this.V1), 2)
      ); //Solve for input power
      this.efficiency =
        math.multiply(math.divide(this.P2, this.P1), 100) * this.etaDiode; //calculate power transfer efficiency
      this.magI2 = math.abs(this.I2); //magntiude of secondary current
      this.magI1 = math.abs(this.I1); //magntidue of primary current
      this.magV2 = math.abs(this.V2); //magnitude of output AC voltage
      this.magV1 = math.abs(this.V1); //magnitude of input AC voltage
      this.Zin = math.divide(this.V1, this.I1); //Input impedance Zin
      this.angZin = (this.Zin.toPolar().phi * 180) / math.pi; //Angle of input impedance
      this.magZin = math.abs(this.Zin); //Magnitude of input impedance
      this.ReL = this.magV2 / this.magI2;
      this.VL = (this.magV2 / 2 / rectConst) * math.pi * this.etaDiode;
      this.IL = (this.magI2 * rectConst) / math.pi;
      this.RL = this.VL / this.IL;
      this.Vg = (this.magV1 * math.pi) / 2 / invConst;
      if (this.Vg != 0) {
        this.Ig = this.P1 / this.Vg;
      } else {
        this.Ig = 0;
      }
    }
  }
}
