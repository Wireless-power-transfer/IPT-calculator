//Author: Aaron Scher
//This  function is called at the very end of the main buttonFunction(). The purpose of this function is to generate the plots using the Plotly.js library.

function generateAllPlots(
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
) {
  //choose which plots to hide and show depending on the compensation.
  let id1 = document.getElementById("inductorCurrentPlot");
  let id2 = document.getElementById("capacitorCurrentPlot");
  switch (compensation) {
    case 1: //series-series
      id1.style.display = "none";
      id2.style.display = "none";
      break;

    case 2: //series-parallel
      id1.style.display = "none";
      id2.style.display = "none";
      break;
    case 3: //LCC-series
      id1.style.display = "block";
      id2.style.display = "block";
      break;
    case 4: //series-LCC
      id1.style.display = "block";
      id2.style.display = "block";
      break;
  }
  //Margin parameters for the plots:
  const lvalue = 70;
  const rvalue = 15;
  const bvalue = 60;
  const tvalue = 70;
  const pvalue = 0;
  const numSigFig = 5; //number of significant digits for plot.

  generateSinglePlot(
    "efficiencyPlot",
    "DC-to-DC power transfer efficiency",
    "<i>&#951;</i>",
    "Efficiency (%)",
    "<i>f</i> (Hz)",
    freq,
    efficiency,
    "h",
    0.2,
    "right",
    1.18
  );

  generateSinglePlot(
    "inputOutputPowerPlot",
    "Source and load powers (W)",
    ["<i>P<sub>in</sub></i>", "<i>P<sub>L</sub></i>"],
    "Power (W)",
    "<i>f</i> (Hz)",
    freq,
    [P1, PL],
    "h",
    0.5,
    "right",
    1.18
  );

  generateSinglePlot(
    "sourceLoadVoltagePlot",
    "Source and load voltages (V)",
    ["<i>V<sub>g</sub></i>", "<i>V<sub>L</sub></i>"],
    "Voltage (V)",
    "<i>f</i> (Hz)",
    freq,
    [Vg, VL],
    "h",
    0.4,
    "right",
    1.18
  );

  generateSinglePlot(
    "acCurrentPlot",
    "Source and load currents (AC)",
    ["|<b>I</b><sub>1</sub>|", "|<b>I</b><sub>2</sub>|"],
    "Current (V)",
    "<i>f</i> (Hz)",
    freq,
    [magI1, magI2],
    "h",
    0.5,
    "right",
    1.18
  );

  generateSinglePlot(
    "loadResistancePlot",
    "DC load resistance",
    "<i>R<sub>L</sub></i> (&#937;)",
    "Resistance (&#937;)",
    "<i>f</i> (Hz)",
    freq,
    RL,
    "h",
    0.3,
    "right",
    1.18
  );

  ////

  generateSinglePlot(
    "loadResistancePlot",
    "Source and load currents (DC)",
    "<i>R<sub>L</sub></i> (&#937;)",
    "Resistance (&#937;)",
    "<i>f</i> (Hz)",
    freq,
    RL,
    "h",
    0.3,
    "right",
    1.18
  );

  generateSinglePlot(
    "sourceLoadCurrentPlot",
    "Source and load currents (DC)",
    ["<i>I<sub>g</sub><i>", "<i>I<sub>L</sub><i>"],
    "Current (A)",
    "<i>f</i> (Hz)",
    freq,
    [Ig, IL],
    "h",
    0.3,
    "right",
    1.18
  );

  generateSinglePlot(
    "acVoltPlot",
    "AC voltages (magnitude)",
    ["|<b>V</b><sub>1</sub>|", "|<b>V</b><sub>2</sub>|"],
    "Voltage (V)",
    "<i>f</i> (Hz)",
    freq,
    [magV1, magV2],
    "h",
    0.5,
    "right",
    1.18
  );

  generateSinglePlot(
    "zinPhasePlot",
    "Input impedance (angle)",
    "&#8736;<b>Z<b><sub>in</sub>",
    "Phase angle (degrees)",
    "<i>f</i> (Hz)",
    freq,
    angZin,
    "h",
    0.25,
    "right",
    1.18
  );

  generateSinglePlot(
    "zinMagPlot",
    "Input impedance (magnitude)",
    "|<b>Z<b><sub>in</sub>|",
    "Impedance (&#937;)",
    "<i>f</i> (Hz)",
    freq,
    magZin,
    "h",
    0.25,
    "right",
    1.18
  );

  generateSinglePlot(
    "inverterRectifierPowerLossPlot",
    "Power loss in inverter and rectifier",
    ["<i>P<sub>inv</sub></i>", "<i>P<sub>rect</sub></i>"],
    "Power (W)",
    "<i>f</i> (Hz)",
    freq,
    [PlossInverter, PlossRectifier],
    "h",
    0.5,
    "right",
    1.18
  );

  ///

  let magVC = [];
  let magVCname = [];
  switch (compensation) {
    case 1: //series-series compensation
      magVC = [magVC1, magVC2];
      magVCname = ["|<b>V</b><sub>C1</sub>|", "|<b>V</b><sub>C2</sub>|"];
      legendOrientation = "h";
      legend_x = 0.5;
      legend_x_anchor = "right";
      legend_y = 1.18;
      break;
    case 2: //series-parallel
      magVC = [magVC1, magVC2];
      magVCname = ["|<b>V</b><sub>C1</sub>|", "|<b>V</b><sub>C2</sub>|"];
      legendOrientation = "h";
      legend_x = 0.5;
      legend_x_anchor = "right";
      legend_y = 1.18;
      break;
    case 3: //LCC-series
      magVC = [magVC1, magVC2, magVCf1];
      magVCname = [
        "|<b>V</b><sub>C1</sub>|",
        "|<b>V</b><sub>C2</sub>|",
        "|<b>V</b><sub>Cf1</sub>|",
      ];
      legendOrientation = [];
      legend_x = [];
      legend_x_anchor = [];
      legend_y = [];
      break;
    case 4: //LCC-LCC
      magVC = [magVC1, magVC2, magVCf1, magVCf2];
      magVCname = [
        "|<b>V</b><sub>C1</sub>|",
        "|<b>V</b><sub>C2</sub>|",
        "|<b>V</b><sub>Cf1</sub>|",
        "|<b>V</b><sub>Cf2</sub>|",
      ];
      legendOrientation = [];
      legend_x = [];
      legend_x_anchor = [];
      legend_y = [];
      break;
  }

  generateSinglePlot(
    "capacitorVoltPlot",
    "Capacitor voltage (magnitude)",
    magVCname,
    "Voltage (V)",
    "<i>f</i> (Hz)",
    freq,
    magVC,
    legendOrientation,
    legend_x,
    legend_x_anchor,
    legend_y
  );

  ///

  let PlossC = [];
  let PlossCname = [];
  switch (compensation) {
    case 1: //series-series compensation
      PlossC = [PlossC1, PlossC2];
      PlossCname = ["P<sub>C1</sub>", "P<sub>C2</sub>"];
      legendOrientation = "h";
      legend_x = 0.5;
      legend_x_anchor = "right";
      legend_y = 1.18;
      break;
    case 2: //series-parallel
      PlossC = [PlossC1, PlossC2];
      PlossCname = ["P<sub>C1</sub>", "P<sub>C2</sub>"];
      legendOrientation = "h";
      legend_x = 0.5;
      legend_x_anchor = "right";
      legend_y = 1.18;
      break;
    case 3: //LCC-series
      PlossC = [PlossC1, PlossC2, PlossCf1];
      PlossCname = ["P<sub>C1</sub>", "P<sub>C2</sub>", "P<sub>Cf1</sub>"];
      legendOrientation = [];
      legend_x = [];
      legend_x_anchor = [];
      legend_y = [];
      break;
    case 4: //LCC-LCC
      PlossC = [PlossC1, PlossC2, PlossCf1, PlossCf2];
      PlossCname = [
        "P<sub>C1</sub>",
        "P<sub>C2</sub>",
        "P<sub>Cf1</sub>",
        "P<sub>Cf2</sub>",
      ];
      legendOrientation = [];
      legend_x = [];
      legend_x_anchor = [];
      legend_y = [];
      break;
  }

  generateSinglePlot(
    "capacitorPowerLossPlot",
    "Power loss in capacitors",
    PlossCname,
    "Power (W)",
    "<i>f</i> (Hz)",
    freq,
    PlossC,
    legendOrientation,
    legend_x,
    legend_x_anchor,
    legend_y
  );

  ////

  let PlossL = [];
  let PlossLname = [];
  switch (compensation) {
    case 1: //series-series compensation
      PlossL = [PlossL1, PlossL2];
      PlossCname = ["P<sub>L1</sub>", "P<sub>L2</sub>"];
      legendOrientation = "h";
      legend_x = 0.5;
      legend_x_anchor = "right";
      legend_y = 1.18;
      break;
    case 2: //series-parallel
      PlossL = [PlossL1, PlossL2];
      PlossLname = ["P<sub>L1</sub>", "P<sub>L2</sub>"];
      legendOrientation = "h";
      legend_x = 0.5;
      legend_x_anchor = "right";
      legend_y = 1.18;
      break;
    case 3: //LCC-series
      PlossL = [PlossL1, PlossL2, PlossLf1];
      PlossCname = ["P<sub>L1</sub>", "P<sub>L2</sub>", "P<sub>Lf1</sub>"];
      legendOrientation = [];
      legend_x = [];
      legend_x_anchor = [];
      legend_y = [];
      break;
    case 4: //LCC-LCC
      PlossL = [PlossL1, PlossL2, PlossLf1, PlossLf2];
      PlossCname = [
        "P<sub>L1</sub>",
        "P<sub>L2</sub>",
        "P<sub>Lf1</sub>",
        "P<sub>Lf2</sub>",
      ];
      legendOrientation = [];
      legend_x = [];
      legend_x_anchor = [];
      legend_y = [];
      break;
  }

  generateSinglePlot(
    "inductorPowerLossPlot",
    "Power loss in inductors",
    PlossCname,
    "Power (W)",
    "<i>f</i> (Hz)",
    freq,
    PlossL,
    legendOrientation,
    legend_x,
    legend_x_anchor,
    legend_y
  );

  ///

  let inductorCurrents = [];
  let inductorCurrentsName = [];
  switch (compensation) {
    case 3: //LCC-series
      inductorCurrents = [magIL1, magIL2, magILf1];
      inductorCurrentsName = [
        "|<b>I</b><sub>L1</sub>|",
        "|<b>I</b><sub>L2</sub>|",
        "|<b>I</b><sub>Lf1</sub>|",
      ];
      legendOrientation = [];
      legend_x = [];
      legend_x_anchor = [];
      legend_y = [];
      break;
    case 4: //LCC-LCC
      inductorCurrents = [magIL1, magIL2, magILf1, magILf2];
      inductorCurrentsName = [
        "|<b>I</b><sub>L1</sub>|",
        "|<b>I</b><sub>L2</sub>|",
        "|<b>I</b><sub>Lf1</sub>|",
        "|<b>I</b><sub>Lf2</sub>|",
      ];
      legendOrientation = [];
      legend_x = [];
      legend_x_anchor = [];
      legend_y = [];
      break;
  }

  //only plot if compensation =  3 or compensation = 4:
  if ((compensation == 3) | (compensation == 4)) {
    generateSinglePlot(
      "inductorCurrentPlot",
      "Inductor currents (AC)",
      inductorCurrentsName,
      "Current (A)",
      "<i>f</i> (Hz)",
      freq,
      inductorCurrents,
      legendOrientation,
      legend_x,
      legend_x_anchor,
      legend_y
    );
  }

  ////

  let capacitorCurrents = [];
  let capacitorCurrentsName = [];
  switch (compensation) {
    case 3: //LCC-series
      capacitorCurrents = [magIC1, magIC2, magICf1];
      capacitorCurrentsName = [
        "|<b>I</b><sub>C1</sub>|",
        "|<b>I</b><sub>C2</sub>|",
        "|<b>I</b><sub>Cf1</sub>|",
      ];
      legendOrientation = [];
      legend_x = [];
      legend_x_anchor = [];
      legend_y = [];
      break;
    case 4: //LCC-LCC
      capacitorCurrents = [magIC1, magIC2, magICf1, magICf2];
      capacitorCurrentsName = [
        "|<b>I</b><sub>C1</sub>|",
        "|<b>I</b><sub>C2</sub>|",
        "|<b>I</b><sub>Cf1</sub>|",
        "|<b>I</b><sub>Cf2</sub>|",
      ];
      legendOrientation = [];
      legend_x = [];
      legend_x_anchor = [];
      legend_y = [];
      break;
  }

  //only plot if compensation =  3 or compensation = 4:
  if ((compensation == 3) | (compensation == 4)) {
    generateSinglePlot(
      "capacitorCurrentPlot",
      "Capacitor currents (AC)",
      capacitorCurrentsName,
      "Current (A)",
      "<i>f</i> (Hz)",
      freq,
      capacitorCurrents,
      legendOrientation,
      legend_x,
      legend_x_anchor,
      legend_y
    );
  }

  function generateSinglePlot(
    plotId,
    plotTitle,
    traceName,
    ytitle,
    xtitle,
    freqArray,
    dataToPlotArray,
    legendOrientation,
    legend_x,
    legend_x_anchor,
    legend_y
  ) {
    //number of signficant digits for all incoming arrays
    freqArray = freqArray.map((a) => a.toFixed(numSigFig));

    if (Array.isArray(traceName) == false) {
      dataToPlotArray = dataToPlotArray.map((a) => a.toFixed(numSigFig));
    } else {
      for (let i = 0; i < traceName.length; i++) {
        dataToPlotArray[i] = dataToPlotArray[i].map((a) =>
          a.toFixed(numSigFig)
        );
      }
    }

    if (Array.isArray(traceName) == false) {
      let trace = {
        x: freq,
        y: dataToPlotArray,
        name: traceName,
      };
      var data = [trace];
    } else {
      var trace = [];
      for (let i = 0; i < traceName.length; i++) {
        trace[i] = {
          x: freq,
          y: dataToPlotArray[i],
          name: traceName[i],
        };
      }
      var data = trace;
    }

    let layout = {
      showlegend: true,
      xaxis: {
        title: xtitle,
        titlefont: {
          family: "Times New Roman",
          size: 16,
        },
        ticks: "outside",
        mirror: true,
        showline: true,
      },
      yaxis: {
        title: ytitle,
        ticks: "outside",
        mirror: true,
        showline: true,
      },
      legend: {
        orientation: legendOrientation,
        x: legend_x,
        xanchor: legend_x_anchor,
        //yanchor: "auto",
        y: legend_y,
        font: {
          family: "Times new roman",
          size: 14,
        },
      },
      title: { text: plotTitle },
      margin: {
        l: lvalue,
        r: rvalue,
        b: bvalue,
        t: tvalue,
        pad: pvalue,
      },
    };
    Plotly.newPlot(plotId, data, layout);
  }
}

/*  
  number of signficant digits for all incoming arrays
  freq = freq.map((a) => a.toFixed(numSigFig));
  efficiency = efficiency.map((a) => a.toFixed(numSigFig)); 
  PL = PL.map((a) => a.toFixed(numSigFig));
  magI2 = magI2.map((a) => a.toFixed(numSigFig));
  magI1 = magI1.map((a) => a.toFixed(numSigFig));
  magVC1 = magVC1.map((a) => a.toFixed(numSigFig));
  magVC2 = magVC2.map((a) => a.toFixed(numSigFig));
  angZin = angZin.map((a) => a.toFixed(numSigFig));
  magZin = magZin.map((a) => a.toFixed(numSigFig));
  VL = VL.map((a) => a.toFixed(numSigFig));
  IL = IL.map((a) => a.toFixed(numSigFig));
  RL = RL.map((a) => a.toFixed(numSigFig));
  Vg = Vg.map((a) => a.toFixed(numSigFig));


   


   


 


 
    

  //Plot input and output DC voltages
  var tracea = {
    x: freq,
    y: Vg,
    name: "<i>V<sub>g</sub><i>",
  };
  var traceb = {
    x: freq,
    y: VL,
    name: "<i>V<sub>L</sub><i>",
  };
  var data = [tracea, traceb];
  var layout = {
    xaxis: {
      title: "<i>f</i> (Hz)",
      titlefont: {
        family: "Times New Roman",
        size: 16,
      },
      ticks: "outside",
      mirror: true,
      showline: true,
    },
    yaxis: {
      title: "Voltage (V)",
      ticks: "outside",
      mirror: true,
      showline: true,
    },
    legend: {
      orientation: "h",
      x: 0.4,
      xanchor: "right",
      //yanchor: "auto",
      y: 1.18,
      font: {
        family: "Times new roman",
        size: 14,
      },
    },
    title: { text: "Source and load voltages (DC)" },
    margin: {
      l: lvalue,
      r: rvalue,
      b: bvalue,
      t: tvalue,
      pad: pvalue,
    },
  };
  Plotly.newPlot("sourceLoadVoltagePlot", data, layout); 


   
 */
