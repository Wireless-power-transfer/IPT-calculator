function plotAndDisplayTimeSimResults2(i1, i2, sw1, tvec, PL, RL, efficiency) {
  //Let's first find S1 switch off current
  //let PL = VDC ** 2 / loadValue_RL_VL_IL_PL; //ASSUMES RESISTIVE LOAD.
  let fallingEdge = 0.125 * (tvec.length - 1);
  let i1FallingEdge = i1[math.floor(fallingEdge)];
  //
  let convergenceMessage = [];
  let efficiencyMessage = [];
  let outputVoltageMessage = [];
  let IS1offMessage = [];
  let VDC = 0;

  efficiencyMessage = "Efficiency = " + efficiency.toFixed(5);
  outputVoltageMessage = "Effective load resistance = " + RL.toFixed(5) + "Ohm";
  outputPowerMessage = "Output Power = " + PL.toFixed(5) + " W";
  IS1offMessage =
    "Switch off current (IS1off) = " + i1FallingEdge.toFixed(5) + " A";

  //Update time-domain analysis message:
  document.getElementById("timeDomainMessage").innerHTML =
    efficiencyMessage +
    "<br>" +
    outputVoltageMessage +
    "<br>" +
    outputPowerMessage +
    "<br>" +
    IS1offMessage;

  let numSigFig = 5; //number of significant digits for plot.
  let plotId = "timeDomainPlot";

  //tvec = tvec.map((a) => a.toFixed(numSigFig));
  i1 = i1.map((a) => a.toFixed(numSigFig));
  i2 = i2.map((a) => a.toFixed(numSigFig));
  sw1 = sw1.map((a) => a.toFixed(numSigFig));

  let trace1 = {
    x: tvec,
    y: i1,
    name: "i1",
  };

  let trace2 = {
    x: tvec,
    y: i2,
    name: "i2",
  };

  let trace3 = {
    x: tvec,
    y: sw1,
    name: "V1",
    yaxis: "y2",
  };

  data = [trace1, trace2, trace3];

  var layout = {
    title: "Time-domain waveforms",
    showlegend: true,
    legend: {
      x: 1.05,
      y: 1,
    },
    yaxis: { title: "Current (A)" },
    xaxis: { title: "Time (s)" },
    yaxis2: {
      title: "V1",
      titlefont: { color: "rgb(25, 127, 0)" },
      tickfont: { color: "rgb(25, 127, 0)" },
      overlaying: "y",
      side: "right",
    },
  };

  //Plotly.newPlot(plotId, data, layout);
  Plotly.newPlot(plotId, data, layout);
}
