//Author: Aaron Scher
//This function is called from index.html as soon as the page is done loading. The purpose of this function is to initialize the URL hash tag routine (i.e., anchor part of the URL) and call the button function to generate the plots.
function initFunction() {
  buttonFunction();
}

//This is the main function that analyzes the circuit. it's called "buttonFunction" because originally, there was a big button that the user pressed to analyze. Then I went with the hash system which automatically calls this function when a change is implement (and so I got rid of the button.)

function buttonFunction(genCSV) {
  initValuesFromHash();
  document.getElementById("errorMessage").innerHTML = ""; //clear the error messages

  //Get source and load types:
  let sourceType = sourceSelectFunction(); //Indicates source type. Will return 1 for Vg or 2 for Ig

  let loadType = loadSelectFunction(); //Indicates load type. Will return RL,VL, IL, or PL

  let sourceValue_Vg_Ig = Number(document.getElementById("Vg_Ig").value); //new
  let loadValue_RL_VL_IL_PL = Number(
    document.getElementById("RL_VL_IL_PL").value
  ); //new
  let compensation = Number(document.getElementById("compensation").value); //get compensation type. 1 = SS, 2 = SP, 3 = LCC-S, 5 = LCC-LCC
  let k = Number(document.getElementById("k").value); //coupling coefficient
  let L1 = Number(document.getElementById("L1").value); //primary inductance
  let L2 = Number(document.getElementById("L2").value); //secondary inductance
  let fmin = Number(document.getElementById("fmin").value); //minimum frequency to plot
  let fmax = Number(document.getElementById("fmax").value); //maximun frequency to plot
  let fnum = Number(document.getElementById("fnum").value); //number of frequency points in plot
  let invConst = Number(document.getElementById("inverter").value); //invConst = 1 (half bridge) and =2 (full bridge)
  let rectConst = Number(document.getElementById("rectifier").value); //rectConst = 1 (half bridge) and =2 (full bridge)
  let Ron = Number(document.getElementById("Ron").value); //MOSFET on resistance
  let Vfwd = Number(document.getElementById("Vfwd").value); //diode forward voltage
  let RL1 = Number(document.getElementById("RL1").value); //ESR of L1
  let RL2 = Number(document.getElementById("RL2").value); //ESR of L2
  let C1 = Number(document.getElementById("C1").value); //C1
  let C2 = Number(document.getElementById("C2").value); //C2
  let RC1 = Number(document.getElementById("RC1").value); //ESR of L1
  let RC2 = Number(document.getElementById("RC2").value); //ESR of L2
  let Lf1 = Number(document.getElementById("Lf1").value); //LCC primary Lf1 inductance
  let Lf2 = Number(document.getElementById("Lf2").value); //LCC secondary Lf2 inductance
  let RLf1 = Number(document.getElementById("RLf1").value); //ESR of LCC primary Lfl1
  let RLf2 = Number(document.getElementById("RLf2").value); //ESR of LCC secondary Lf2
  let Cf1 = Number(document.getElementById("Cf1").value); //LCC primary Cf1 capactiance
  let Cf2 = Number(document.getElementById("Cf2").value); //LCC seconary Cf2 capactiance
  let RCf1 = Number(document.getElementById("RCf1").value); //ESR of LCC primary Cf1
  let RCf2 = Number(document.getElementById("RCf2").value); //ESR of LCC primary Cf2
  let f0 = Number(document.getElementById("f0").value); //operationg frequency for time domain simulation
  let numHarmonics = Number(document.getElementById("numHarmonics").value); //number of harmonics for time domain simulation
  let numIterations = Number(document.getElementById("numIterations").value); //number of iterations for time domain simulation
  //let samplingFactor = Number(document.getElementById("samplingFactor").value); //number of iterations for time domain simulation
  //let dampingFactor = Number(document.getElementById("dampingFactor").value); //damping factor for LM algorithm
  //let relativeTolerance = Number(
  //  document.getElementById("relativeTolerance").value
  //); //relative tolerance for LM algorithm
  let rampUpChoice = Number(document.getElementById("rampUpChoice").value); //relative tolerance for LM algorithm
  let enableTimeDomainChoice = Number(
    document.getElementById("enableTimeDomainChoice").value
  ); //relative tolerance for LM algorithm

  //Calculate and define other parameters and variables:
  let f01 = 1 / math.sqrt(L1 * C1) / 2 / math.pi; //resonant frequenc of primary
  let f02 = 1 / math.sqrt(L2 * C2) / 2 / math.pi; //resonant frequency of secondary
  let QL1 = (2 * math.pi * f01 * L1) / RL1; //Unloaded Q of L1
  let QL2 = (2 * math.pi * f02 * L2) / RL2; //Unloaded Q of L2
  let QC1 = 1 / (2 * math.pi * f01 * C1) / RC1; //Unloaded Q of C1
  let QC2 = 1 / (2 * math.pi * f02 * C2) / RC2; //Unloaded Q of C2

  //To avoid Infinities due to dividing by zero:
  if (RL1 == 0) {
    QL1 = 1e200;
  }
  if (RL2 == 0) {
    QL2 = 1e200;
  }
  if (RC1 == 0) {
    QC1 = 1e200;
  }
  if (RC2 == 0) {
    QC2 = 1e200;
  }

  let Q1 = (QL1 * QC1) / (QL1 + QC1); //Q of primary
  let Q2 = (QL2 * QC2) / (QL2 + QC2); //Q of secondary

  //calculate AC equivalent value of MOSFET Ron
  let RonACeq = Ron * invConst;
  let delta_f = (fmax - fmin) / (fnum - 1); //frequency step size
  let freq = []; //define frequency variable as an array
  let M = k * math.sqrt(L1 * L2); //calculate mutual inductance
  let systemABCDmatrix = []; //initialize array to hold the system ABCD matrices
  let A = []; //initialize A of system's ABCD matrix
  let B = []; //initialize B of system's ABCD matrix
  let C = []; //initialize C of system's ABCD matrix
  let D = []; //initialize D of system's ABCD matrix
  let V1 = [];
  let I2 = []; //initialize secondary current
  let V2 = []; //initialize secondary voltage
  let I1 = []; //initialize primary current
  let P1 = []; //initialize input power
  let P2 = []; //initialize output power
  let efficiency = []; //initialize power transfer efficiency
  let K = []; //initialize K value
  let magI2 = []; //magntidue of I2
  let magI1 = []; //magntidue of I1
  let magV1 = []; //magntidue of V1
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

  let ZLf1 = [];
  let VCf1 = [];
  let ZCf1 = [];
  let ICf1 = [];
  let IL1 = [];
  let ZLf2 = [];
  let VCf2 = [];
  let ZCf2 = [];
  let ICf2 = [];
  let IL2 = [];
  let ZC2 = [];
  let IC2 = [];

  //Initialize the following arrays to [0]. These are the results of calculations and depend on the specific compensation scheme that the user choses.
  let PlossRectifier = [0]; //power loss in rectifier
  let PlossInverter = [0]; //power loss in inverter
  let PlossC1 = [0]; //power loss in primary capacitor
  let PlossC2 = [0]; //power loss in secondary capacitor
  let PlossL1 = [0]; //power loss in primary inductor
  let PlossL2 = [0]; //power loss in secondary inductor
  let magIC1 = [0]; //current in primary capacitor
  let magIC2 = [0]; //current in secondary capacitor
  let magIL1 = [0]; //current in primary inductor
  let magIL2 = [0]; //current in secondary inductor
  let magVC1 = [0]; //voltage across primary capacitor
  let magVC2 = [0]; //voltage across secondary capacitor
  let PlossCf1 = [0]; //power loss in primary-side LCC capacitor Cf1
  let PlossCf2 = [0]; //power loss in secondary-side LCC capacitor Cf2
  let PlossLf1 = [0]; //power loss in primary-side LCC inductor Lf1
  let PlossLf2 = [0]; //power loss in secondary-side LCC inductor Lf2
  let magICf1 = [0]; //current in primary-side LCC capacitor Cf1
  let magICf2 = [0]; //current in secondary-side LCC capacitor Cf2
  let magILf1 = [0]; //current in primary-siide inductor Lf1
  let magILf2 = [0]; //current in secondary-side inductor Lf2
  let magVCf1 = [0]; //voltage across primary-side capacitor Cf1
  let magVCf2 = [0]; //voltage across secondary-siude capacitor Cf2

  let specialOutputMessage = []; //special output message that appears after the calculate and plot button is pressed
  var rectDrivenType = []; //This variable denotes if we are working with a current driven rectifier ( =1) or a voltage driven rectifier (=2) rectifier.
  //Create ABCD matrix objects for the user-selected compensation type
  switch (compensation) {
    case 1: //series-series compensation
      rectDrivenType = 1; //current driven rectifier
      var R1 = RL1 + RC1;
      var R2 = RL2 + RC2;
      var seriesPrimary = new SeriesLCR(L1, C1, R1, []); //create series primary object
      var Kinverter = new KinverterElement([]); //create K inverter object
      var seriesSecondary = new SeriesLCR(L2, C2, R2, []); //create series secondary object
      break;
    case 2: //series-parallel compensation
      rectDrivenType = 2; //voltage driven rectifier
      var R1 = RL1 + RC1;
      var seriesPrimary = new SeriesLCR(L1, C1, R1, []); //create series primary object
      var Kinverter = new KinverterElement([]); //create K inverter object
      var LSecondary = new SeriesL(L2, RL2, []); //create series secondary object
      var CSecondary = new ParallelC(C2, RC2, []); //create series secondary object
      break;
    case 3: //LCC-series compensation
      rectDrivenType = 1; //current driven rectifier
      var R1 = RL1 + RC1;
      var R2 = RL2 + RC2;
      var LprimaryLCC = new SeriesL(Lf1, RLf1, []); //create series secondary object
      var CprimaryLCC = new ParallelC(Cf1, RCf1, []); //create parallel secondary object
      var seriesPrimary = new SeriesLCR(L1, C1, R1, []); //create series primary object
      var Kinverter = new KinverterElement([]); //create K inverter object
      var seriesSecondary = new SeriesLCR(L2, C2, R2, []); //create series secondary object
      break;
    case 4: //LCC-LCC compensation
      rectDrivenType = 1; //current driven rectifier
      var R1 = RL1 + RC1;
      var R2 = RL2 + RC2;
      var LprimaryLCC = new SeriesL(Lf1, RLf1, []); //create series secondary object
      var CprimaryLCC = new ParallelC(Cf1, RCf1, []); //create parallel secondary object
      var seriesPrimary = new SeriesLCR(L1, C1, R1, []); //create series primary object
      var Kinverter = new KinverterElement([]); //create K inverter object
      var seriesSecondary = new SeriesLCR(L2, C2, R2, []); //create series secondary object
      var CsecondaryLCC = new ParallelC(Cf2, RCf2, []); //create parallel secondary object
      var LsecondaryLCC = new SeriesL(Lf2, RLf2, []); //create series secondary object
      break;
  }

  let seriesRon = new SeriesR(RonACeq, []); //create Ron object
  seriesRon.createABCD(); //create ABCD matrix that models series MOSFET on resistance primary object

  let SSIPT_System = new TotalIPTSystem(); //create total IPT system object
  SSIPT_System.SetRectTf(rectDrivenType, rectConst); //Set the rectifier transfer function for the calculations

  //////FREQUENCY SWEEP BEGIN//////
  let mNum = 3; //Number of times to iterate over diode
  // Analyze circuit at each frequency using ABCD matrices

  for (let i = 0; i < fnum; i++) {
    let etaDiode = 1; //Start diode iteration with diode rectifier efficiency = 1.
    SSIPT_System.etaDiode = etaDiode;
    for (let m = 0; m < mNum; m++) {
      freq[i] = fmin + delta_f * i; //evaluate frequency at index i

      //Calculate for the user-specified compensation type.
      switch (compensation) {
        case 1: //series-series compensation
          seriesPrimary.f = freq[i]; //assign current frequency to the series primary object
          seriesSecondary.f = freq[i]; //assign current frequency to the series secondary object
          seriesPrimary.createABCD(); //create ABCD matrix that models series primary object
          seriesSecondary.createABCD(); //create ABCD matrix that models series secondary object
          K = 2 * math.pi * freq[i] * M; //equivalent value of K for K inverter
          Kinverter.K = K; //set value of K
          Kinverter.createABCD(); //crearte ABCD matrix that models K inverter

          systemABCDmatrix = math.multiply(
            seriesRon.ABCD,
            seriesPrimary.ABCD,
            Kinverter.ABCD,
            seriesSecondary.ABCD
          ); //Compute system ABCD matrix:
          break;
        case 2: //series-parallel compensation
          seriesPrimary.f = freq[i]; //assign current frequency to the series primary object
          LSecondary.f = freq[i]; //assign current frequency to the series secondary object
          CSecondary.f = freq[i]; //assign current frequency to the series secondary object

          seriesPrimary.createABCD(); //create ABCD matrix that models series primary object
          LSecondary.createABCD();
          CSecondary.createABCD();
          K = 2 * math.pi * freq[i] * M; //equivalent value of K for K inverter
          Kinverter.K = K; //set value of K
          Kinverter.createABCD(); //crearte ABCD matrix that models K inverter

          systemABCDmatrix = math.multiply(
            seriesRon.ABCD,
            seriesPrimary.ABCD,
            Kinverter.ABCD,
            LSecondary.ABCD,
            CSecondary.ABCD
          ); //Compute system ABCD matrix:
          break;
        case 3: //LCC-series compensation
          LprimaryLCC.f = freq[i]; //assign current frequency to the series primary object
          CprimaryLCC.f = freq[i]; //assign current frequency to the series secondary object
          LprimaryLCC.createABCD(); //create ABCD matrix that models series primary object
          CprimaryLCC.createABCD(); //create ABCD matrix that models series secondary
          seriesPrimary.f = freq[i]; //assign current frequency to the series primary object
          seriesSecondary.f = freq[i]; //assign current frequency to the series secondary object
          seriesPrimary.createABCD(); //create ABCD matrix that models series primary object
          seriesSecondary.createABCD(); //create ABCD matrix that models series secondary object
          K = 2 * math.pi * freq[i] * M; //equivalent value of K for K inverter
          Kinverter.K = K; //set value of K
          Kinverter.createABCD(); //creare ABCD matrix that models K inverter
          systemABCDmatrix = math.multiply(
            seriesRon.ABCD,
            LprimaryLCC.ABCD,
            CprimaryLCC.ABCD,
            seriesPrimary.ABCD,
            Kinverter.ABCD,
            seriesSecondary.ABCD
          );
          break;
        case 4: //LCC-LCC compensation
          LprimaryLCC.f = freq[i]; //assign current frequency to the series primary object
          CprimaryLCC.f = freq[i]; //assign current frequency to the series secondary object
          LsecondaryLCC.f = freq[i]; //assign current frequency to the series primary object
          CsecondaryLCC.f = freq[i]; //assign current frequency to the series secondary object
          LprimaryLCC.createABCD(); //create ABCD matrix that models series primary object
          CprimaryLCC.createABCD(); //create ABCD matrix that models series secondary
          LsecondaryLCC.createABCD(); //create ABCD matrix that models series primary object
          CsecondaryLCC.createABCD(); //create ABCD matrix that models series secondary
          seriesPrimary.f = freq[i]; //assign current frequency to the series primary object
          seriesSecondary.f = freq[i]; //assign current frequency to the series secondary object
          seriesPrimary.createABCD(); //create ABCD matrix that models series primary object
          seriesSecondary.createABCD(); //create ABCD matrix that models series secondary object
          K = 2 * math.pi * freq[i] * M; //equivalent value of K for K inverter
          Kinverter.K = K; //set value of K
          Kinverter.createABCD(); //crearte ABCD matrix that models K inverter
          systemABCDmatrix = math.multiply(
            seriesRon.ABCD,
            LprimaryLCC.ABCD,
            CprimaryLCC.ABCD,
            seriesPrimary.ABCD,
            Kinverter.ABCD,
            seriesSecondary.ABCD,
            CsecondaryLCC.ABCD,
            LsecondaryLCC.ABCD
          );
          break;
      }

      SSIPT_System.A = systemABCDmatrix.subset(math.index(0, 0)); //extract individual A of system's ABCD matrix and assign
      SSIPT_System.B = systemABCDmatrix.subset(math.index(0, 1)); //extract individual B of system's ABCD matrix and assign
      SSIPT_System.C = systemABCDmatrix.subset(math.index(1, 0)); //extract individual C of system's ABCD matrix and assign
      SSIPT_System.D = systemABCDmatrix.subset(math.index(1, 1)); //extract individual D of system's ABCD matrix and assign
      SSIPT_System.SolveForI1_I2_V1_V2(
        sourceType,
        loadType,
        sourceValue_Vg_Ig,
        loadValue_RL_VL_IL_PL,
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
      Vg[i] = SSIPT_System.Vg;
      Ig[i] = SSIPT_System.Ig;
      RL[i] = SSIPT_System.RL;
      PL[i] = SSIPT_System.PL;

      PlossRectifier[i] = P2[i] - PL[i]; //power loss in rectifier
      PlossInverter[i] = (magI1[i] ** 2 / 2) * RonACeq; //power loss in inverter

      //Extra calculations (set each value to zero as a default). We will calculate relevant variables next.

      switch (compensation) {
        case 1: //series-series compensation
          //Calculate arrays using equations specific to the SSIPT system:
          magVC1[i] = magI1[i] / freq[i] / math.pi / 2 / C1;
          magVC2[i] = magI2[i] / freq[i] / math.pi / 2 / C2;
          magIC1[i] = magI1[i];
          magIC2[i] = magI2[i];
          magIL1[i] = magI1[i];
          magIL2[i] = magI2[i];
          PlossC1[i] = (magI1[i] * magI1[i] * RC1) / 2;
          PlossC2[i] = (magI2[i] * magI2[i] * RC2) / 2;
          PlossL1[i] = (magI1[i] * magI1[i] * RL1) / 2;
          PlossL2[i] = (magI2[i] * magI2[i] * RL2) / 2;
          break;
        case 2: //series-parallel compensation
          //Calculate arrays using equations specific to the SSIPT system:

          V2[i] = SSIPT_System.V2; //we need
          I2[i] = SSIPT_System.I2;
          magIL1[i] = magI1[i];
          magIL2[i] = magI2[i];
          magVC1[i] = magI1[i] / freq[i] / math.pi / 2 / C1; //magntiude of voltage across primary capacitor
          magVC2[i] = magV2[i]; //magntiude of voltage across secondary capacitor
          magIC1[i] = magI1[i];
          ZC2 = math.complex(RC2, -1 / 2 / math.pi / freq[i] / C2); //Impedance R2-j/(jwC2)
          IC2 = math.divide(V2[i], ZC2);
          magIC2[i] = math.abs(IC2);
          magIL1[i] = magI1[i];
          IL2 = math.add(I2[i], IC2);
          magIL2[i] = math.abs(IL2);
          PlossC1[i] = (magIL1[i] * magIL1[i] * RC1) / 2;
          PlossC2[i] = (magIC2[i] * magIC2[i] * RC2) / 2;
          PlossL1[i] = (magIL1[i] * magIL1[i] * RL1) / 2;
          PlossL2[i] = (magIL2[i] * magIL2[i] * RL2) / 2;
          break;
        case 3: //LCC-series compensation
          V1[i] = SSIPT_System.V1; //we need
          I1[i] = SSIPT_System.I1;

          ZLf1 = math.add(RLf1, 2 * math.pi * freq[i] * Lf1); // impedance of Lf1
          VCf1 = math.subtract(V1[i], math.multiply(I1[i], ZLf1)); //Voltage across Cf1
          ZCf1 = math.complex(RCf1, -1 / 2 / math.pi / freq[i] / Cf1); //impedance of Cf1
          ICf1 = math.divide(VCf1, ZCf1); //current through Cf1
          IL1 = math.subtract(I1[i], ICf1);

          magILf1[i] = math.abs(I1[i]);
          magICf1[i] = math.abs(ICf1);
          magIC1[i] = math.abs(IL1);
          magIL1[i] = math.abs(IL1);
          magIC2[i] = magI2[i];
          magIL2[i] = magI2[i];

          magVC1[i] = magIC1[i] / freq[i] / math.pi / 2 / C1; //magntiude of voltage across primary capacitor
          magVC2[i] = magIC2[i] / freq[i] / math.pi / 2 / C2; //magntiude of voltage across secondary capacitor
          magVCf1[i] = magICf1[i] / freq[i] / math.pi / 2 / Cf1; //magntiude of voltage across secondary capacitor

          PlossC1[i] = (magIC1[i] * magIC1[i] * RC1) / 2;
          PlossC2[i] = (magIC2[i] * magIC2[i] * RC2) / 2;
          PlossCf1[i] = (magICf1[i] * magICf1[i] * RCf1) / 2;
          PlossL1[i] = (magIL1[i] * magIL1[i] * RL1) / 2;
          PlossL2[i] = (magIL2[i] * magIL2[i] * RL2) / 2;
          PlossLf1[i] = (magILf1[i] * magILf1[i] * RL2) / 2;

          break;
        case 4: //LCC-LCC compensation
          V1[i] = SSIPT_System.V1; //we need
          V2[i] = SSIPT_System.V2;
          I1[i] = SSIPT_System.I1;
          I2[i] = SSIPT_System.I2;

          ZLf1 = math.add(RLf1, 2 * math.pi * freq[i] * Lf1); // impedance of Lf1
          VCf1 = math.subtract(V1[i], math.multiply(I1[i], ZLf1)); //Voltage across Cf1
          ZCf1 = math.complex(RCf1, -1 / 2 / math.pi / freq[i] / Cf1); //impedance of Cf1
          ICf1 = math.divide(VCf1, ZCf1); //current through Cf1
          IL1 = math.subtract(I1[i], ICf1);

          magILf1[i] = math.abs(I1[i]);
          magICf1[i] = math.abs(ICf1);
          magIC1[i] = math.abs(IL1);
          magIL1[i] = math.abs(IL1);

          ZLf2 = math.add(RLf2, 2 * math.pi * freq[i] * Lf2); // impedance of Lf1
          VCf2 = math.add(V2[i], math.multiply(I2[i], ZLf2)); //Voltage across Cf1
          ZCf2 = math.complex(RCf2, -1 / 2 / math.pi / freq[i] / Cf2); //impedance of Cf1
          ICf2 = math.divide(VCf2, ZCf2); //current through Cf1
          IL2 = math.add(I2[i], ICf2);

          magILf2[i] = math.abs(I2[i]);
          magICf2[i] = math.abs(ICf2);
          magIC2[i] = math.abs(IL2);
          magIL2[i] = math.abs(IL2);

          magVC1[i] = magIC1[i] / freq[i] / math.pi / 2 / C1;
          magVC2[i] = magIC2[i] / freq[i] / math.pi / 2 / C2;
          magVCf1[i] = magICf1[i] / freq[i] / math.pi / 2 / Cf1;
          magVCf2[i] = magICf2[i] / freq[i] / math.pi / 2 / Cf2;

          PlossC1[i] = (magIC1[i] * magIC1[i] * RC1) / 2;
          PlossC2[i] = (magIC2[i] * magIC2[i] * RC2) / 2;
          PlossCf1[i] = (magICf1[i] * magICf1[i] * RCf1) / 2;
          PlossCf2[i] = (magICf2[i] * magICf2[i] * RCf2) / 2;
          PlossL1[i] = (magIL1[i] * magIL1[i] * RL1) / 2;
          PlossL2[i] = (magIL2[i] * magIL2[i] * RL2) / 2;
          PlossLf1[i] = (magILf1[i] * magILf1[i] * RLf1) / 2;
          PlossLf2[i] = (magILf2[i] * magILf2[i] * RLf2) / 2;
          break;
      }

      //Handle the diode
      switch (rectDrivenType) {
        case 1: //current driven rectifier
          etaDiode = 1 / (1 + (2 * Vfwd) / VL[i]);
          break;

        case 2: //voltage driven rectifier
          etaDiode = 1 / (1 + (rectConst * Vfwd) / VL[i]);
          break;
      }

      if (VL[i] == 0) {
        etaDiode = 0;
      }
      SSIPT_System.etaDiode = etaDiode;
    }
  }

  //////FREQUENCY SWEEP END//////
  if (enableTimeDomainChoice == 1) {
    if (loadType == 1 && sourceType == 1 && compensation != 2) {
      let timeDomainData = timeSimSourceType1LoadType1(
        k,
        M,
        L1,
        L2,
        invConst,
        rectConst,
        RonACeq,
        Vfwd,
        RL1,
        RL2,
        C1,
        C2,
        RC1,
        RC2,
        Lf1,
        Lf2,
        RLf1,
        RLf2,
        Cf1,
        Cf2,
        RCf1,
        RCf2,
        f0,
        numHarmonics,
        numIterations,
        sourceType,
        loadType,
        sourceValue_Vg_Ig,
        loadValue_RL_VL_IL_PL,
        RonACeq,
        rectDrivenType,
        compensation,
        rampUpChoice
      );
      plotAndDisplayTimeSimResults(
        timeDomainData.i1,
        timeDomainData.i2,
        timeDomainData.sw1,
        timeDomainData.VDC,
        timeDomainData.efficiency,
        timeDomainData.tvec,
        timeDomainData.F,
        loadValue_RL_VL_IL_PL
      );
      i1 = timeDomainData.i1;
      i2 = timeDomainData.i2;
      sw = timeDomainData.sw1;
      tvec = timeDomainData.tvec;
    }
    if (genCSV == 1) {
      downloadCSVwithTimeDomain(
        freq,
        efficiency,
        PL,
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
        PlossRectifier,
        PlossInverter,
        PlossC1,
        PlossC2,
        PlossL1,
        PlossL2,
        magIC1,
        magIC2,
        magIL1,
        magIL2,
        magVC1,
        magVC2,
        PlossCf1,
        PlossCf2,
        PlossLf1,
        PlossLf2,
        magICf1,
        magICf2,
        magILf1,
        magILf2,
        magVCf1,
        magVCf2,
        i1,
        i2,
        sw,
        tvec
      );
    }
  }

  if (genCSV == 1) {
    if (enableTimeDomainChoice == 2) {
      downloadCSV(
        freq,
        efficiency,
        PL,
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
        PlossRectifier,
        PlossInverter,
        PlossC1,
        PlossC2,
        PlossL1,
        PlossL2,
        magIC1,
        magIC2,
        magIL1,
        magIL2,
        magVC1,
        magVC2,
        PlossCf1,
        PlossCf2,
        PlossLf1,
        PlossLf2,
        magICf1,
        magICf2,
        magILf1,
        magILf2,
        magVCf1,
        magVCf2
      );
    }
  }

  document.getElementById("resultsMessage").innerHTML =
    "Calculated: <span class = 'equationStyle'><i>f</i><sub>01</sub></span> = " +
    math.format(f01, 3) +
    " Hz, <span class = 'equationStyle'><i>f</i><sub>02</sub></span> = " +
    math.format(f02, 3) +
    " Hz, " +
    "<span class = 'equationStyle'><i>Q</i><sub>1</sub></span> = " +
    math.format(Q1, 3) +
    ", " +
    "<span class = 'equationStyle'><i>Q</i><sub>2</sub></span> = " +
    math.format(Q2, 3) +
    ", " +
    "<span class = 'equationStyle'><i>M</i></span> = " +
    math.format(M, 3) +
    " H. " +
    specialOutputMessage;

  setImage(sourceType, invConst, rectConst, loadType, compensation);

  let precision = 3;
  generateAllPlots(
    compensation,
    freq,
    efficiency,
    PL,
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
    PlossRectifier,
    PlossInverter,
    PlossC1,
    PlossC2,
    PlossL1,
    PlossL2,
    magIC1,
    magIC2,
    magIL1,
    magIL2,
    magVC1,
    magVC2,
    PlossCf1,
    PlossCf2,
    PlossLf1,
    PlossLf2,
    magICf1,
    magICf2,
    magILf1,
    magILf2,
    magVCf1,
    magVCf2
  );
}

//Create the objects

class SeriesR {
  constructor(R, f) {
    this.R = R;
    this.f = f;
    this.ABCD = [];
  }
  createABCD() {
    let w = 2 * math.pi * this.f;
    let A = 1;
    let B = this.R;
    let C = 0;
    let D = 1;
    this.ABCD = math.matrix([
      [A, B],
      [C, D],
    ]);
  }
}

class SeriesLCR {
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

class SeriesL {
  constructor(L, R, f) {
    this.L = L;
    this.R = R;
    this.f = f;
    this.ABCD = [];
  }
  createABCD() {
    let w = 2 * math.pi * this.f;
    let A = 1;
    let B = math.complex(this.R, w * this.L);
    let C = 0;
    let D = 1;
    this.ABCD = math.matrix([
      [A, B],
      [C, D],
    ]);
  }
}

class ParallelC {
  constructor(C, R, f) {
    this.C = C;
    this.R = R;
    this.f = f;
    this.ABCD = [];
  }
  createABCD() {
    let w = 2 * math.pi * this.f;
    let A = 1;
    let B = 0;
    let C = math.divide(1, math.complex(this.R, -1 / this.C / w)); //Admittance (Y)
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
    this.rectI_tf = []; //rectifier current transfer function (depends if voltage or current driven rectifier)... Iin(AC) = IL*rectI_tf
    this.rectV_tf = []; //rectifier voltage transfer function (depends if voltage or current driven rectifier)... Vin(AC) = VL*rectI_tf
    this.rectR_tf = []; //rectifier resistance transfer function (depends if voltage or current driven rectifier)... Rin(AC) = RL*rectI_tf
  }

  SetRectTf(rectDrivenType, rectConst) {
    switch (rectDrivenType) {
      case 1: //current driven
        this.rectI_tf = math.pi / rectConst;
        this.rectV_tf = (2 * rectConst) / math.pi;
        this.rectR_tf = (2 * rectConst ** 2) / math.pi ** 2;
        break;

      case 2: //voltage driven
        this.rectI_tf = (2 * rectConst) / math.pi;
        this.rectV_tf = math.pi / rectConst;
        this.rectR_tf = math.pi ** 2 / 2 / rectConst ** 2;
        break;
    }
  }

  SolveForI1_I2_V1_V2(
    sourceType,
    loadType,
    sourceValue_Vg_Ig,
    loadValue_RL_VL_IL_PL,
    invConst
  ) {
    let errorFlag = 0;

    if (sourceType == 1 && loadType == 1) {
      //Source = Vg and Load = RL
      this.Vg = sourceValue_Vg_Ig; //DC input voltage is defined by user
      this.V1 = (this.Vg * 2 * invConst) / math.pi; //calculate AC input voltage
      this.RL = loadValue_RL_VL_IL_PL; //Load resistance is defined by user
      this.ReL = (this.RL * this.rectR_tf) / this.etaDiode; //calculate effective AC resistance
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
      this.ReL = (this.RL * this.rectR_tf) / this.etaDiode; //calculate effective AC resistance
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
      this.magV2 = (loadValue_RL_VL_IL_PL * this.rectV_tf) / this.etaDiode; //AC voltage defined by user

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
      this.magV2 = (loadValue_RL_VL_IL_PL * rectV_tf) / this.etaDiode; //AC load voltage defined by user's choice of VL

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
      this.magI2 = loadValue_RL_VL_IL_PL * this.rectI_tf; ///AC current defined by user's choice of IL

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
      this.magI2 = loadValue_RL_VL_IL_PL * this.rectI_tf; ///AC current defined by user's choice of IL

      //Solve for ReL by solving quadratic equation: a_*ReL^2+b_*ReL+c_ = 0
      let a_ = math.abs(this.C) ** 2;
      let b_ = math.add(
        math.multiply(this.C, math.conj(this.D)),
        math.multiply(this.D, math.conj(this.C))
      );
      let c_ = math.abs(this.D) ** 2 - (this.I1 / this.magI2) ** 2;
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
        this.RL = this.ReL * this.rectR_tf; //Load resistance

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
        this.RL = this.ReL * this.rectR_tf; //Load resistance

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
        this.RL = this.ReL * this.rectR_tf; //Load resistance
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
        this.RL = this.ReL * this.rectR_tf; //Load resistance
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
      this.VL = (this.magV2 / this.rectV_tf) * this.etaDiode;

      this.IL = this.magI2 / this.rectI_tf;
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
