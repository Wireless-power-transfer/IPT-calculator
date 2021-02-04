//Author: Aaron Scher
//This  function is called at the very end of the main buttonFunction(). The purpose of this function is to generate the plots using the Plotly.js library.

function plotGenFunction(
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
) {
  let numSigFig = 5; //number of signficant digits for all incoming arrays

  freq = freq.map((a) => a.toFixed(numSigFig));
  efficiency = efficiency.map((a) => a.toFixed(numSigFig));
  PL = PL.map((a) => a.toFixed(numSigFig));
  Pl1 = Pl1.map((a) => a.toFixed(numSigFig));
  Pl2 = Pl2.map((a) => a.toFixed(numSigFig));
  magV2 = magV2.map((a) => a.toFixed(numSigFig));
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
  /*   Ig = Ig.map((a) => a.toFixed(numSigFig)); */

  //Plot margin parameters:
  let lvalue = 70;
  let rvalue = 15;
  let bvalue = 60;
  let tvalue = 70;
  let pvalue = 0;

  //Plot power transfer efficiency
  var trace = {
    x: freq,
    y: efficiency,
    name: "<i>&#951;</i>",
  };
  var data = [trace];
  var layout = {
    showlegend: true,
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
      title: "Efficiency (%)",
      ticks: "outside",
      mirror: true,
      showline: true,
    },
    legend: {
      orientation: "h",
      x: 0.2,
      xanchor: "right",
      //yanchor: "auto",
      y: 1.18,
      font: {
        family: "Times new roman",
        size: 14,
      },
    },
    title: { text: "DC-to-DC power transfer efficiency" },
    margin: {
      l: lvalue,
      r: rvalue,
      b: bvalue,
      t: tvalue,
      pad: pvalue,
    },
  };
  Plotly.newPlot("efficiencyPlot", data, layout);

  //Plot power delivered to the load
  var tracea = {
    x: freq,
    y: P1,
    name: "<i>P<sub>in</sub></i>",
  };

  var traceb = {
    x: freq,
    y: PL,
    name: "<i>P<sub>L</sub></i>",
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
      title: "Power (W)",
      ticks: "outside",
      mirror: true,
      showline: true,
      size: 16,
    },
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "right",
      //yanchor: "auto",
      y: 1.18,
      font: {
        family: "Times new roman",
        size: 14,
      },
    },
    title: { text: "Source and load powers (DC)" },
    margin: {
      l: lvalue,
      r: rvalue,
      b: bvalue,
      t: tvalue,
      pad: pvalue,
    },
  };
  Plotly.newPlot("inputOutputPowerPlot", data, layout);

  //Plot power loss in resonators
  var tracea = {
    x: freq,
    y: Pl1,
    name: "<i>P<sub>loss,1</sub></i>",
  };

  var traceb = {
    x: freq,
    y: Pl2,
    name: "<i>P<sub>loss,2</sub></i>",
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
      title: "Power (W)",
      ticks: "outside",
      mirror: true,
      showline: true,
    },
    legend: {
      orientation: "h",
      x: 0.6,
      xanchor: "right",
      //yanchor: "auto",
      y: 1.18,
      font: {
        family: "Times new roman",
        size: 14,
      },
    },
    title: { text: "Power loss in resonators" },
    margin: {
      l: lvalue,
      r: rvalue,
      b: bvalue,
      t: tvalue,
      pad: pvalue,
    },
  };
  Plotly.newPlot("powerLossPlot", data, layout);

  //Plot magnitude of magI1 and magI2
  var tracea = {
    x: freq,
    y: magI1,
    name: "|<b>I</b><sub>1</sub>|",
  };
  var traceb = {
    x: freq,
    y: magI2,
    name: "|<b>I</b><sub>2</sub>|",
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
      title: "Current  (A)",
      ticks: "outside",
      mirror: true,
      showline: true,
    },
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "right",
      //yanchor: "auto",
      y: 1.18,
      font: {
        family: "Times new roman",
        size: 14,
      },
    },
    title: { text: "AC currents (magnitude)" },
    margin: {
      l: lvalue,
      r: rvalue,
      b: bvalue,
      t: tvalue,
      pad: pvalue,
    },
  };
  Plotly.newPlot("acCurrentPlot", data, layout);

  //Plot RL
  var trace = {
    x: freq,
    y: RL,
    name: "<i>R<sub>L</sub></i> (&#937;)",
  };
  var data = [trace];
  var layout = {
    showlegend: true,
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
      title: "Resistance (&#937;)",
      ticks: "outside",
      mirror: true,
      showline: true,
    },
    legend: {
      orientation: "h",
      x: 0.3,
      xanchor: "right",
      //yanchor: "auto",
      y: 1.18,
      font: {
        family: "Times new roman",
        size: 14,
      },
    },
    title: { text: "DC load resistance" },
    margin: {
      l: lvalue,
      r: rvalue,
      b: bvalue,
      t: tvalue,
      pad: pvalue,
    },
  };
  Plotly.newPlot("loadResistancePlot", data, layout);

  //Plot magnitude of VC1 and VC2
  var tracea = {
    x: freq,
    y: magVC1,
    name: "|<b>V</b><sub>C1</sub>|",
  };

  var traceb = {
    x: freq,
    y: magVC2,
    name: "|<b>V</b><sub>C2</sub>|",
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
      x: 1,
      xanchor: "right",
      y: 1,
    },
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "right",
      //yanchor: "auto",
      y: 1.18,
      font: {
        family: "Times new roman",
        size: 14,
      },
    },
    title: { text: "Capacitor voltage (magnitude)" },
    margin: {
      l: lvalue,
      r: rvalue,
      b: bvalue,
      t: tvalue,
      pad: pvalue,
    },
  };
  Plotly.newPlot("capVoltPlot", data, layout);

  //Plot magnitude of V1 anv V2
  var tracea = {
    x: freq,
    y: magV1,
    name: "|<b>V</b><sub>1</sub>|",
  };
  var traceb = {
    x: freq,
    y: magV2,
    name: "|<b>V</b><sub>2</sub>|",
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
      x: 0.5,
      xanchor: "right",
      //yanchor: "auto",
      y: 1.18,
      font: {
        family: "Times new roman",
        size: 14,
      },
    },
    title: { text: "AC voltages (magnitude)" },
    margin: {
      l: lvalue,
      r: rvalue,
      b: bvalue,
      t: tvalue,
      pad: pvalue,
    },
  };
  Plotly.newPlot("acVoltPlot", data, layout);

  //Plot phase angle Zin
  var trace = {
    x: freq,
    y: angZin,
    name: "&#8736;<b>Z<b><sub>in</sub>",
  };
  var data = [trace];
  var layout = {
    showlegend: true,
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
      title: "Phase angle (degrees)",
      ticks: "outside",
      mirror: true,
      showline: true,
    },
    legend: {
      orientation: "h",
      x: 0.25,
      xanchor: "right",
      //yanchor: "auto",
      y: 1.18,
      font: {
        family: "Times new roman",
        size: 14,
      },
    },
    title: { text: "Input impedance (angle)" },
    margin: {
      l: lvalue,
      r: rvalue,
      b: bvalue,
      t: tvalue,
      pad: pvalue,
    },
  };
  Plotly.newPlot("zinPhasePlot", data, layout);

  //Plot magnitude of Zin
  var trace = {
    x: freq,
    y: magZin,
    name: "|<b>Z<b><sub>in</sub>|",
  };
  var data = [trace];
  var layout = {
    showlegend: true,
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
      title: "Impedance (&#937;)",
      ticks: "outside",
      mirror: true,
      showline: true,
    },
    legend: {
      orientation: "h",
      x: 0.25,
      xanchor: "right",
      //yanchor: "auto",
      y: 1.18,
      font: {
        family: "Times new roman",
        size: 14,
      },
    },
    title: { text: "Input impedance (magnitude)" },
    margin: {
      l: lvalue,
      r: rvalue,
      b: bvalue,
      t: tvalue,
      pad: pvalue,
    },
  };
  Plotly.newPlot("zinMagPlot", data, layout);

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

  //Plot input and output DC currents
  var tracea = {
    x: freq,
    y: Ig,
    name: "<i>I<sub>g</sub><i>",
  };
  var traceb = {
    x: freq,
    y: IL,
    name: "<i>I<sub>L</sub><i>",
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
      title: "Current (A)",
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
    title: { text: "Source and load currents (DC)" },
    margin: {
      l: lvalue,
      r: rvalue,
      b: bvalue,
      t: tvalue,
      pad: pvalue,
    },
  };
  Plotly.newPlot("sourceLoadCurrentPlot", data, layout);
}
