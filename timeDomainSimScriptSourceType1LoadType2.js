function timeSimSourceType1LoadType2(
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
  sourceType,
  loadType,
  sourceValue_Vg_Ig,
  loadValue_RL_VL_IL_PL,
  RonACeq,
  rectDrivenType,
  compensation
) {
  //console.log("Time domain function called!");

  let timeWindow = 2 / f0;
  let freq = f0;
  let T0 = 1 / f0;
  let VL = loadValue_RL_VL_IL_PL;
  let Vg = sourceValue_Vg_Ig;
  let f_n = [];
  let I2_n = [];
  let V2_n = [];
  let V1_n = [];
  let I1_n = [];
  let v1 = 0;
  let v2 = 0;
  let i1 = 0;
  let i2 = 0;
  let calcV1AndI1 = [];
  let fs = math.max(2 * f0 * 120, 2 * numHarmonics * f0 * 10); //Sampling frequency
  let Ts = 1 / fs;
  let numberOfTimePoints = math.floor(timeWindow / Ts);
  let timeVec = [];
  for (i = 0; i < numberOfTimePoints; i++) {
    timeVec[i] = i * Ts;
  }
  let correlationVec = [];
  let coefA = [];
  let coefB = [];
  let coefC = [];
  let coefD = [];
  let ABCD = [];
  let numDelayPoints = 200; //hard code it in
  let delayStart = -T0 / 2;
  let delayEnd = T0 / 2;
  let delayDelta = -(delayStart - delayEnd) / (numDelayPoints - 1);
  let delayVec = [];
  let delay = [];
  let PL = []; //POWER DELIVERED TO LOAD (WILL WORK ON THIS LATER)
  let RL = []; //EQUIVALENT LOAD RESISTNECE (WILL WORK ON THIS LATER)
  let efficiency = []; //POWER TRANSFER EFFICIENCY (WILL WORK ON THIS LATER)
  for (i = 0; i < numDelayPoints; i++) {
    delayVec[i] = delayStart + i * delayDelta;
  }
  let MaxIndexValue = [];

  for (n = 0; n < numHarmonics; n++) {
    nodd = (n + 1) * 2 - 1;
    f_n[n] = f0 * nodd;
    freq = f_n[n];
    V1_n[n] =
      ((Vg * 2 * invConst) / math.pi / nodd) * math.sin((nodd * math.pi) / 2);

    if (compensation == 1) {
      ABCD = ABCD_matrix_SS(
        //Note that ABCD_matrix_SS is a function defined in the javascrip file timeDomainSimScripotSourceType1LoadType1.js.
        freq,
        L1,
        L2,
        C1,
        C2,
        RL1,
        RL2,
        RC1,
        RC2,
        k,
        RonACeq
      );
    }

    if (compensation == 3) {
      ABCD = ABCD_matrix_LCC_series(
        //this function defined in javascript file timeDomainSimScripotSourceType1LoadType1.js.
        freq,
        L1,
        L2,
        C1,
        C2,
        RL1,
        RL2,
        RC1,
        RC2,
        Lf1,
        Cf1,
        RLf1,
        RCf1,
        k,
        RonACeq
      );
    }

    if (compensation == 4) {
      ABCD = ABCD_matrix_LCC_LCC(
        //this function defined in javascript file timeDomainSimScripotSourceType1LoadType1.js.
        freq,
        L1,
        L2,
        C1,
        C2,
        RL1,
        RL2,
        RC1,
        RC2,
        Lf1,
        Lf2,
        Cf1,
        Cf2,
        RLf1,
        RCf1,
        RLf2,
        RCf2,
        k,
        RonACeq
      );
    }

    coefA[n] = ABCD.subset(math.index(0, 0));
    coefB[n] = ABCD.subset(math.index(0, 1));
    coefC[n] = ABCD.subset(math.index(1, 0));
    coefD[n] = ABCD.subset(math.index(1, 1));
  }
  calcV1AndI1 = false; //don't calculate v1 and i1 yet. We are just looking at v2 and i2 for now.
  for (i = 0; i < numDelayPoints; i++) {
    delay = delayVec[i];
    results = calcEverythingAndCorrelation(
      calcV1AndI1,
      Vg,
      coefA,
      coefB,
      coefC,
      coefD,
      f_n,
      numHarmonics,
      f0,
      VL,
      timeVec,
      V1_n,
      Vfwd,
      rectConst,
      invConst,
      fs,
      delay
    );
    correlationVec[i] = results.correlation;
  }
  MaxIndexValue = indexOfMax(correlationVec);

  delay = delayVec[MaxIndexValue]; //specify the correct delay.
  //delay = 2 * 10 ** -6;
  //delay = 1 * 10 ** -6;
  //delay = 3.9887 * 10 ** -6;
  calcV1AndI1 = true; //time to calculate everything
  results = calcEverythingAndCorrelation(
    calcV1AndI1,
    Vg,
    coefA,
    coefB,
    coefC,
    coefD,
    f_n,
    numHarmonics,
    f0,
    VL,
    timeVec,
    V1_n,
    Vfwd,
    rectConst,
    invConst,
    fs,
    delay
  );
  //
  //
  //
  //console.log(results.v1); ///I AM HERE!!! I THINK I GOT IT WORKING :) GOT MAX INDEX VALUE!
  //FINAL OUTPUTS OF THIS FUNCTION

  results2 = calcPLAndRLAndEfficiency(
    Vg,
    VL,
    timeVec,
    rectConst,
    invConst,
    results.i2,
    results.v2,
    results.i1,
    results.v1
  );
  return {
    i2: results.i2,
    v2: results.v2,
    i1: results.i1,
    v1: results.v1,
    PL: results2.PL,
    RL: results2.RL,
    timeVec: timeVec,
    efficiency: results2.efficiency,
  };
}
//
//
//
//
//
//

function calcEverythingAndCorrelation(
  calcV1AndI1,
  Vg,
  coefA,
  coefB,
  coefC,
  coefD,
  f_n,
  numHarmonics,
  f0,
  VL,
  timeVec,
  V1_n,
  Vfwd,
  rectConst,
  invConst,
  fs,
  delay
) {
  let V2_n = [];
  let I2_n = [];
  let I1_n = [];
  for (n = 0; n < numHarmonics; n++) {
    nodd = (n + 1) * 2 - 1;
    V2_n[n] = math.complex({
      abs:
        ((VL + 2 * Vfwd) * (2 * rectConst * math.sin((nodd * math.pi) / 2))) /
        nodd /
        math.pi,
      arg: 2 * math.pi * f_n[n] * delay,
    });
    I2_n[n] = math.divide(
      math.subtract(V1_n[n], math.multiply(coefA[n], V2_n[n])),
      coefB[n]
    );

    //I1_n[n] = 1;
    if (calcV1AndI1 === true) {
      I1_n[n] = math.add(
        math.multiply(coefC[n], V2_n[n]),
        math.multiply(coefD[n], I2_n[n])
      );
    }
  }
  let timeDomainResults =
    getV2AndI2AndI1AndV1TimeDomainWaveformsAndCorrelationGivenPhasors(
      calcV1AndI1,
      invConst,
      Vg,
      V1_n,
      V2_n,
      I2_n,
      I1_n,
      timeVec,
      fs,
      numHarmonics,
      f_n
    );
  return {
    i2: timeDomainResults.i2,
    v2: timeDomainResults.v2,
    i1: timeDomainResults.i1,
    v1: timeDomainResults.v1,
    correlation: timeDomainResults.correlation,
  };
}
//
//

function getV2AndI2AndI1AndV1TimeDomainWaveformsAndCorrelationGivenPhasors(
  calcV1AndI1,
  invConst,
  Vg,
  V1_n,
  V2_n,
  I2_n,
  I1_n,
  timeVec,
  fs,
  numHarmonics,
  f_n
) {
  //let sinusoid = [];
  let numberOfTimePoints = timeVec.length;
  let i2 = Array(numberOfTimePoints).fill(0);
  let v2 = Array(numberOfTimePoints).fill(0);
  let i1 = Array(numberOfTimePoints).fill(0);
  let v1 = Array(numberOfTimePoints).fill(0);
  let correlationArray = Array(numberOfTimePoints).fill(0);
  let correlation = [];
  //let rectified = Array(numberOfTimePoints).fill(0);
  //let half_rectified = Array(numberOfTimePoints).fill(0);
  //let sign = Array(numberOfTimePoints).fill(1);
  //let half_sign = Array(numberOfTimePoints).fill(1);

  for (let m = 0; m < numberOfTimePoints; m++) {
    for (n = 0; n < numHarmonics; n++) {
      i2[m] =
        i2[m] +
        math.abs(I2_n[n]) *
          math.cos(2 * math.pi * f_n[n] * timeVec[m] + I2_n[n].toPolar().phi);

      v2[m] =
        v2[m] +
        math.abs(V2_n[n]) *
          math.cos(2 * math.pi * f_n[n] * timeVec[m] + V2_n[n].toPolar().phi);
      if (calcV1AndI1 === true) {
        i1[m] =
          i1[m] +
          math.abs(I1_n[n]) *
            math.cos(2 * math.pi * f_n[n] * timeVec[m] + I1_n[n].toPolar().phi);

        v1[m] = v1[m] + V1_n[n] * math.cos(2 * math.pi * f_n[n] * timeVec[m]);
      }
    }
    if (calcV1AndI1 === true) {
      v1[m] = (Vg * math.sign(v1[m]) + (2 - invConst) * Vg) / (3 - invConst);
    }
    correlationArray[m] = math.multiply(math.sign(i2[m]), math.sign(v2[m]));
  }

  correlation = math.sum(correlationArray);

  //rectified[m] = sinusoid[m];
  //half_rectified[m] = sinusoid[m];
  //if (rectified[m] < 0) {
  //  rectified[m] = math.abs(sinusoid[m]);
  //  half_rectified[m] = 0;
  //  sign[m] = -1;
  //  half_sign[m] = 0;
  // }
  //}
  return {
    i2: i2,
    v2: v2,
    i1: i1,
    v1: v1,
    correlation: correlation,
  };
}

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}
function calcPLAndRLAndEfficiency(
  Vg,
  VL,
  timeVec,
  rectConst,
  invConst,
  i2,
  v2,
  i1,
  v1
) {
  let PL = [];
  let RL = 0;
  let I2RMS = 0;
  let efficiency = 0;
  let rectifiedI2 = [];
  let Pin = 0;
  let numberOfTimePoints = timeVec.length;

  if (rectConst === 1) {
    //half wave rectifier
    for (let m = 0; m < numberOfTimePoints; m++) {
      Pin = Pin + v1[m] * i1[m];
      if (i2[m] > 0) {
        rectifiedI2[m] = math.abs(i2[m]);
      }
      if (i2[m] < 0) {
        rectifiedI2[m] = 0;
      }
      I2RMS = I2RMS + rectifiedI2[m];
    }
  }

  if (rectConst === 2) {
    //full wave rectifier
    for (let m = 0; m < numberOfTimePoints; m++) {
      Pin = Pin + v1[m] * i1[m];
      rectifiedI2[m] = math.abs(i2[m]);
      I2RMS = I2RMS + rectifiedI2[m];
    }
  }
  I2RMS = I2RMS / numberOfTimePoints;
  Pin = Pin / numberOfTimePoints;
  PL = I2RMS * VL;
  RL = VL ** 2 / PL;
  efficiency = PL / Pin;

  return {
    PL: PL,
    RL: RL,
    efficiency: efficiency,
  };
}
