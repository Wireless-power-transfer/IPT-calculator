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
  compensation,
  dutyCycle
) {
  //console.log("Time domain function called!");
  let correctDelay = [];
  let correctOutputDutyCycle = [];
  let maxIndicesValue;
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
  let numDelayPoints = 175; //hard code it in
  let delayStart = -T0 / 2;
  let delayEnd = T0 / 2;
  let delayDelta = -(delayStart - delayEnd) / (numDelayPoints - 1);
  let delayVec = [];
  let delay = [];
  let objFunc = [];
  let V2_n_nD = [];

  for (i = 0; i < numDelayPoints; i++) {
    delayVec[i] = delayStart + i * delayDelta;
  }

  let outputDutyCycleVec = new Array();

  let outputDutyCycle = [];
  let numOutputDutyCyclePoints = [];
  let outputDutyCycleStart = [];
  let dutyDutyCycleEnd = [];
  let outputDutyCycleDelta = [];

  if (invConst == 2 || dutyCycle == 0.5) {
    outputDutyCycleVec[0] = 0.5;
    numOutputDutyCyclePoints = 1;
  } else {
    numOutputDutyCyclePoints = 125; //hard code it in
    if (dutyCycle < 0.5) {
      outputDutyCycleStart = dutyCycle * 0.7;
      dutyDutyCycleEnd = 0.5 * (0.5 / dutyCycle) * 1.1;
    }
    if (dutyCycle > 0.5) {
      outputDutyCycleStart = 0.48;
      dutyDutyCycleEnd = dutyCycle * 1.2;
    }
    outputDutyCycleDelta =
      -(outputDutyCycleStart - dutyDutyCycleEnd) /
      (numOutputDutyCyclePoints - 1);

    for (i = 0; i < numOutputDutyCyclePoints; i++) {
      outputDutyCycleVec[i] = outputDutyCycleStart + i * outputDutyCycleDelta;
    }
  }

  //
  let PL = []; //POWER DELIVERED TO LOAD (WILL WORK ON THIS LATER)
  let RL = []; //EQUIVALENT LOAD RESISTNECE (WILL WORK ON THIS LATER)
  let efficiency = []; //POWER TRANSFER EFFICIENCY (WILL WORK ON THIS LATER)

  let MaxIndexValue = [];

  for (n = 1; n < numHarmonics + 1; n++) {
    f_n[n] = f0 * n;
    freq = f_n[n];
    if (invConst == 1) {
      V1_n[n] = ((Vg * 2) / math.pi / n) * math.sin(n * math.pi * dutyCycle);
    }

    if (invConst == 2) {
      V1_n[n] =
        ((Vg * 2) / math.pi / n) *
        math.sin(n * math.pi * dutyCycle) *
        (1 - math.cos((2 * math.pi * n) / 2));
    }

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
  //let objFuncVec = new Array();
  let objFuncVec = new Array();
  for (m = 0; m < numOutputDutyCyclePoints; m++) {
    objFuncVec[m] = new Array();
    for (n = 0; n < numDelayPoints; n++) {
      outputDutyCycle = outputDutyCycleVec[m];

      delay = delayVec[n];
      //(delay);
      objFunc = calcI2AtZeroCrossingObjFunc(
        coefA,
        coefB,
        numHarmonics,
        f_n,
        f0,
        VL,
        V1_n,
        Vfwd,
        rectConst,
        delay,
        outputDutyCycle
      );
      objFuncVec[m][n] = objFunc;
    }
  }
  maxIndicesValue = indicesOfMax2D(objFuncVec);
  correctOutputDutyCycle = outputDutyCycleVec[maxIndicesValue.maxIndex1];
  correctDelay = delayVec[maxIndicesValue.maxIndex2];
  //console.log(correctOutputDutyCycle);

  currentPhasors = calcCurrentPhasorsI1_n_I2_n(
    coefA,
    coefB,
    coefC,
    coefD,
    numHarmonics,
    f_n,
    f0,
    VL,
    timeVec,
    V1_n,
    Vfwd,
    rectConst,
    correctDelay,
    correctOutputDutyCycle
  );

  V2_n = currentPhasors.V2_n;
  V2_n_nD = currentPhasors.V2_n_nD;
  I1_n = currentPhasors.I1_n;
  I2_n = currentPhasors.I2_n;

  currentTimeDomainWaveforms = calcCurrentTimeDomainGivenPhasorsI1_n_I2_n(
    I1_n,
    I2_n,
    numHarmonics,
    f_n,
    f0,
    timeVec
  );
  //console.log(I2_n);
  i1 = currentTimeDomainWaveforms.i1;
  i2 = currentTimeDomainWaveforms.i2;

  v1 = getTimeDomainV1(f0, invConst, dutyCycle, Vg, timeVec);

  P1 = getPowerFromPhasors(V1_n, I1_n, numHarmonics);
  P2 = getPowerFromPhasors(V2_n, I2_n, numHarmonics);
  P2 = (P2 * VL) / (VL + Vfwd * rectConst);

  efficiency = P2 / P1;

  RL = VL ** 2 / P2;

  return {
    i2: i2,
    v2: v2,
    i1: i1,
    v1: v1,
    PL: P2,
    RL: RL,
    timeVec: timeVec,
    efficiency: efficiency,
  };
}
//
//
//
//
//
//

function getPowerFromPhasors(V_n, I_n, numHarmonics) {
  let P = 0;
  for (i = 1; i < numHarmonics + 1; i++) {
    P = math.add(P, math.re(math.multiply(I_n[i], math.conj(V_n[i]))));
  }
  return P / 2;
}

function getTimeDomainV1(f0, invConst, dutyCycle, Vg, timeVec) {
  let T0 = 1 / f0;
  let onDuration = dutyCycle * T0;
  let numberOfTimePoints = timeVec.length;
  let v1 = Array(numberOfTimePoints).fill(0);
  if (invConst == 1) {
    for (m = 0; m < 6; m++) {
      for (n = 0; n < numberOfTimePoints - 1; n++) {
        if (
          ((-dutyCycle * T0) / 2 + m * T0 < timeVec[n]) &
          (timeVec[n] < (dutyCycle * T0) / 2 + m * T0)
        ) {
          v1[n] = Vg;
        }
      }
    }
  }

  if (invConst == 2) {
    for (m = 0; m < 3; m++) {
      for (n = 0; n < numberOfTimePoints - 1; n++) {
        if (
          (-onDuration / 2 + m * T0 + T0 / 2 < timeVec[n]) &
          (timeVec[n] < onDuration / 2 + m * T0 + T0 / 2)
        ) {
          v1[n] = -Vg;
        }
        if (
          (-onDuration / 2 + m * T0 < timeVec[n]) &
          (timeVec[n] < onDuration / 2 + m * T0)
        ) {
          v1[n] = Vg;
        }
      }
    }
  }
  return v1;
}

function calcCurrentPhasorsI1_n_I2_n(
  coefA,
  coefB,
  coefC,
  coefD,
  numHarmonics,
  f_n,
  f0,
  VL,
  timeVec,
  V1_n,
  Vfwd,
  rectConst,
  correctDelay,
  correctOutputDutyCycle
) {
  let i2 = 0;
  let i1 = 0;
  let V2_n = [];
  let I2_n = [];
  let I1_n = [];
  let V2_n_nD = [];

  for (i = 1; i < numHarmonics + 1; i++) {
    V2_n[i] = math.complex({
      abs:
        ((VL + rectConst * Vfwd) *
          (2 * rectConst * math.sin(i * math.pi * correctOutputDutyCycle))) /
        i /
        math.pi,
      arg: -2 * math.pi * f_n[i] * correctDelay,
    });

    V2_n_nD[i] = math.complex({
      abs:
        (VL *
          (2 * rectConst * math.sin(i * math.pi * correctOutputDutyCycle))) /
        i /
        math.pi,
      arg: -2 * math.pi * f_n[i] * correctDelay,
    });

    I2_n[i] = math.divide(
      math.subtract(V1_n[i], math.multiply(coefA[i], V2_n[i])),
      coefB[i]
    );

    I1_n[i] = math.add(
      math.multiply(coefC[i], V2_n[i]),
      math.multiply(coefD[i], I2_n[i])
    );
  }
  //console.log("V2_n");
  //console.log(V2_n);
  return {
    I1_n: I1_n,
    I2_n: I2_n,
    V2_n: V2_n,
    V2_n_nD: V2_n_nD,
  };
}

function calcI2AtZeroCrossingObjFunc(
  coefA,
  coefB,
  numHarmonics,
  f_n,
  f0,
  VL,
  V1_n,
  Vfwd,
  rectConst,
  delay,
  outputDutyCycle
) {
  let i2AtZeroCrossing1 = 0;
  let i2AtZeroCrossing2 = 0;
  let T0 = 1 / f0;
  let special = 0;
  let V2_n = [];
  let I2_n = [];
  i2AtZeroCrossing1 = 0;
  i2AtZeroCrossing2 = 0;
  let i = 0;
  for (i = 1; i < numHarmonics + 1; i++) {
    V2_n[i] = math.complex({
      abs:
        ((VL + rectConst * Vfwd) *
          (2 * rectConst * math.sin(i * math.pi * outputDutyCycle))) /
        i /
        math.pi,
      arg: -2 * math.pi * f_n[i] * delay,
    });

    I2_n[i] = math.divide(
      math.subtract(V1_n[i], math.multiply(coefA[i], V2_n[i])),
      coefB[i]
    );

    special =
      special +
      math.abs(I2_n[i]) *
        math.cos(2 * math.pi * f_n[i] * delay + I2_n[i].toPolar().phi);

    i2AtZeroCrossing1 =
      i2AtZeroCrossing1 +
      math.abs(I2_n[i]) *
        math.cos(
          2 * math.pi * f_n[i] * ((outputDutyCycle * T0) / 2 + delay) +
            I2_n[i].toPolar().phi
        );

    i2AtZeroCrossing2 =
      i2AtZeroCrossing2 +
      math.abs(I2_n[i]) *
        math.cos(
          2 * math.pi * f_n[i] * ((-outputDutyCycle * T0) / 2 + delay) +
            I2_n[i].toPolar().phi
        );
  }
  special = (1 - math.sign(special)) * 100;
  return (
    1 / (math.abs(i2AtZeroCrossing1) + math.abs(i2AtZeroCrossing2) + special)
  );
}

function calcCurrentTimeDomainGivenPhasorsI1_n_I2_n(
  I1_n,
  I2_n,
  numHarmonics,
  f_n,
  f0,
  timeVec
) {
  let numberOfTimePoints = timeVec.length;
  let i1 = Array(numberOfTimePoints).fill(0);
  let i2 = Array(numberOfTimePoints).fill(0);
  for (let m = 0; m < numberOfTimePoints; m++) {
    for (n = 1; n < numHarmonics + 1; n++) {
      i2[m] =
        i2[m] +
        math.abs(I2_n[n]) *
          math.cos(2 * math.pi * f_n[n] * timeVec[m] + I2_n[n].toPolar().phi);

      i1[m] =
        i1[m] +
        math.abs(I1_n[n]) *
          math.cos(2 * math.pi * f_n[n] * timeVec[m] + I1_n[n].toPolar().phi);
    }
  }
  return {
    i1: i1,
    i2: i2,
  };
}

function indicesOfMax2D(arr) {
  var max = arr[0][0];
  var lengthIndex1 = arr.length;
  var lengthIndex2 = arr[0].length;
  let maxIndex1 = 0;
  let maxIndex2 = 0;

  for (var n1 = 0; n1 < lengthIndex1; n1++) {
    for (var n2 = 0; n2 < lengthIndex2; n2++) {
      if (arr[n1][n2] > max) {
        maxIndex1 = n1;
        maxIndex2 = n2;
        max = arr[n1][n2];
      }
    }
  }
  return {
    maxIndex1: maxIndex1,
    maxIndex2: maxIndex2,
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
