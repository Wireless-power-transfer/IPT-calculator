//This function is called when the download output as CSV button is pressed.
function downloadCSV(
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
  magVC1,
  magVC2,
  PlossC1,
  PlossC2,
  PlossL1,
  PlossL2,
  magIC1,
  magIC2,
  magIL1,
  magIL2,
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
  let test = [0];
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
  csvTextRow[17] = "PlossC1," + PlossC1.join(",") + "\n";
  csvTextRow[18] = "PlossC2," + PlossC2.join(",") + "\n";
  csvTextRow[19] = "PlossL1," + PlossL1.join(",") + "\n";
  csvTextRow[20] = "PlossL2," + PlossL2.join(",") + "\n";
  csvTextRow[21] = "magIC1," + magIC1.join(",") + "\n";
  csvTextRow[22] = "magIC2," + magIC2.join(",") + "\n";
  csvTextRow[23] = "magIL1," + magIL1.join(",") + "\n";
  csvTextRow[24] = "magIL2," + magIL2.join(",") + "\n";
  csvTextRow[25] = "PlossRectifier," + PlossRectifier.join(",") + "\n";
  csvTextRow[26] = "PlossInverter," + PlossInverter.join(",") + "\n";
  csvTextRow[27] = "PL," + PL.join(",") + "\n";
  csvTextRow[28] = "magICf1," + magICf1.join(",") + "\n";
  csvTextRow[29] = "magICf2," + magICf2.join(",") + "\n";
  csvTextRow[30] = "magILf1," + magILf1.join(",") + "\n";
  csvTextRow[31] = "magILf2," + magILf2.join(",") + "\n";
  csvTextRow[32] = "PlossLf1," + PlossLf1.join(",") + "\n";
  csvTextRow[33] = "PlossLf2," + PlossLf2.join(",") + "\n";
  csvTextRow[34] = "PlossCf1," + PlossCf1.join(",") + "\n";
  csvTextRow[35] = "PlossCf2," + PlossCf2.join(",");

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

function downloadCSVwithTimeDomain(
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
  magVC1,
  magVC2,
  PlossC1,
  PlossC2,
  PlossL1,
  PlossL2,
  magIC1,
  magIC2,
  magIL1,
  magIL2,
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
  switching,
  tvec
) {
  let test = [0];
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
  csvTextRow[17] = "PlossC1," + PlossC1.join(",") + "\n";
  csvTextRow[18] = "PlossC2," + PlossC2.join(",") + "\n";
  csvTextRow[19] = "PlossL1," + PlossL1.join(",") + "\n";
  csvTextRow[20] = "PlossL2," + PlossL2.join(",") + "\n";
  csvTextRow[21] = "magIC1," + magIC1.join(",") + "\n";
  csvTextRow[22] = "magIC2," + magIC2.join(",") + "\n";
  csvTextRow[23] = "magIL1," + magIL1.join(",") + "\n";
  csvTextRow[24] = "magIL2," + magIL2.join(",") + "\n";
  csvTextRow[25] = "PlossRectifier," + PlossRectifier.join(",") + "\n";
  csvTextRow[26] = "PlossInverter," + PlossInverter.join(",") + "\n";
  csvTextRow[27] = "PL," + PL.join(",") + "\n";
  csvTextRow[28] = "magICf1," + magICf1.join(",") + "\n";
  csvTextRow[29] = "magICf2," + magICf2.join(",") + "\n";
  csvTextRow[30] = "magILf1," + magILf1.join(",") + "\n";
  csvTextRow[31] = "magILf2," + magILf2.join(",") + "\n";
  csvTextRow[32] = "PlossLf1," + PlossLf1.join(",") + "\n";
  csvTextRow[33] = "PlossLf2," + PlossLf2.join(",") + "\n";
  csvTextRow[34] = "PlossCf1," + PlossCf1.join(",") + "\n";
  csvTextRow[35] = "PlossCf2," + PlossCf2.join(",") + "\n";
  csvTextRow[36] = "TimeDomain_i1," + i1.join(",") + "\n";
  csvTextRow[37] = "TimeDomain_i2," + i2.join(",") + "\n";
  csvTextRow[38] = "TimeDomain_switching," + switching.join(",") + "\n";
  csvTextRow[39] = "TimeDomain_tvec" + tvec.join(",");

  let text = [];
  for (let i = 0; i < csvTextRow.length; i++) {
    text += csvTextRow[i];
  }
  download("OutputSSIPT.csv", text);
}
