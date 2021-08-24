function timeSimSourceType1LoadType1(
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
  compensation
) {
  //console.log("Time domain function called!");

  const timeWindow = 2 / f0;
  let RL = loadValue_RL_VL_IL_PL;
  let Vg = sourceValue_Vg_Ig;
  let ReL = (RL * 2 * rectConst ** 2) / math.pi ** 2;
  let ReL_n = [];
  let f_n = [];
  let freq = 0;
  let V1_n = [];
  let initialI2_n = [];
  let initialV2_n = [];
  let v1 = 0;
  let initial_i2 = [];
  let initial_i2_sinusoid = [];
  let initial_i2_rectified = [];
  let initial_v2_norm = [];
  let tvec = [];

  let fs = math.max(2 * f0 * 120, 2 * numHarmonics * f0 * 10); //Sampling frequency
  let numberOfTimePoints = math.floor(fs * timeWindow);
  let coefA = [];
  let coefB = [];
  let coefC = [];
  let coefD = [];
  let optimizedVDC = 0;
  let optimizedTimeDelay = 0;
  let lastIteration = 0;
  let convergenceFlag = true;
  let xRampUp = [];
  let rampUpNumber = 5;
  let RampUpNumOfHarmonics = 0;
  let optimizedVariables = [];
  let numThevIterations = 10;

  //Find initial values to begin optimization
  for (n = 0; n < numHarmonics; n++) {
    nodd = (n + 1) * 2 - 1;
    ReL_n[n] = ReL;
    f_n[n] = f0 * nodd; //frequency of nth odd harmonic
    freq = f_n[n];
    V1_n[n] =
      ((Vg * 2 * invConst) / math.pi / nodd) * math.sin((nodd * math.pi) / 2); //input voltage of the nth odd harmonic
    if (compensation == 1) {
      ABCD = ABCD_matrix_SS(
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
    initialI2_n[n] = math.divide(
      V1_n[n],
      math.add(math.multiply(coefA[n], ReL_n[n]), coefB[n])
    );
  }
  initial_i2 = getSinusoidAndRectify(
    initialI2_n,
    numberOfTimePoints,
    fs,
    numHarmonics,
    f_n
  );
  initial_i2_sinusoid = initial_i2.sinusoid;
  initial_i2_rectified = initial_i2.rectified;
  initial_v2_norm = initial_i2.sign;
  initial_VDC = math.mean(initial_i2_rectified) * RL;
  //If rectifier is a half-wave rectifier, do this:
  if (rectConst == 1) {
    initial_v2_norm = initial_i2.half_sign;
    initial_VDC = math.mean(initial_i2.half_rectified) * RL;
  }
  let pulseProperties = computepulseProp(f0, initial_v2_norm, fs, rectConst); //Initial guess
  let initialTimeDelay = pulseProperties[0];
  let x0 = [initial_VDC, initialTimeDelay];

  if (enableRampUpCheckBox == 2 || enableRampUpCheckBox == 4) {
    //console.log(enableRampUpCheckBox);
    x0 = theveninOptimize(
      numThevIterations,
      Vg,
      numIterations,
      numHarmonics,
      numberOfTimePoints,
      RL,
      f0,
      Vfwd,
      rectConst,
      fs,
      tvec,
      coefA,
      coefB,
      coefC,
      coefD,
      V1_n,
      f_n,
      x0
    );
  }

  if (enableRampUpCheckBox == 1 || enableRampUpCheckBox == 2) {
    optimizedVariables = newtonSolver2D(
      Vg,
      numIterations,
      numHarmonics,
      numberOfTimePoints,
      RL,
      f0,
      Vfwd,
      rectConst,
      fs,
      tvec,
      coefA,
      coefB,
      coefC,
      coefD,
      V1_n,
      f_n,
      x0
    );
  }
  if (enableRampUpCheckBox == 3 || enableRampUpCheckBox == 4) {
    RampUpNumOfHarmonics = 1; //start with only one harmonics and we will ramp up from there
    let y = newtonSolver2D(
      Vg,
      numIterations,
      RampUpNumOfHarmonics,
      numberOfTimePoints,
      RL,
      f0,
      Vfwd,
      rectConst,
      fs,
      tvec,
      coefA,
      coefB,
      coefC,
      coefD,
      V1_n,
      f_n,
      x0
    );
    optimizedVDC = y[0][0];
    optimizedTimeDelay = y[0][1];
    xRampUp = [optimizedVDC, optimizedTimeDelay];
    //for (m = 0; m < rampUpNumber; n++) {
    rampUpNumber = math.min(rampUpNumber, numHarmonics);

    for (m = 1; m < rampUpNumber; m++) {
      RampUpNumOfHarmonics = m + 1;
      y = newtonSolver2D(
        Vg,
        numIterations,
        RampUpNumOfHarmonics,
        numberOfTimePoints,
        RL,
        f0,
        Vfwd,
        rectConst,
        fs,
        tvec,
        coefA,
        coefB,
        coefC,
        coefD,
        V1_n,
        f_n,
        xRampUp
      );
      optimizedVDC = y[0][0];
      optimizedTimeDelay = y[0][1];
      xRampUp = [optimizedVDC, optimizedTimeDelay];
    }
    optimizedVariables = newtonSolver2D(
      Vg,
      numIterations,
      numHarmonics,
      numberOfTimePoints,
      RL,
      f0,
      Vfwd,
      rectConst,
      fs,
      tvec,
      coefA,
      coefB,
      coefC,
      coefD,
      V1_n,
      f_n,
      xRampUp
    );
  }
  optimizedVDC = optimizedVariables[0][0];
  optimizedTimeDelay = optimizedVariables[0][1];
  lastIteration = optimizedVariables[1];
  F = optimizedVariables[2];

  timeDomainResults = getTimeDomainResults(
    numHarmonics,
    numberOfTimePoints,
    RL,
    f0,
    Vfwd,
    invConst,
    rectConst,
    tvec,
    coefA,
    coefB,
    coefC,
    coefD,
    V1_n,
    f_n,
    fs,
    optimizedVDC,
    optimizedTimeDelay,
    Vg
  );
  let i1 = timeDomainResults.i1;
  let i2 = timeDomainResults.i2;
  let sw1 = timeDomainResults.sw1;
  let efficiency = timeDomainResults.efficiency;
  tvec = timeDomainResults.tvec;
  return {
    i1: i1,
    i2: i2,
    sw1: sw1,
    VDC: optimizedVDC,
    efficiency: efficiency,
    tvec: tvec,
    F: F,
  };
}
function getTimeDomainResults(
  numHarmonics,
  numberOfTimePoints,
  RL,
  f0,
  Vfwd,
  invConst,
  rectConst,
  tvec,
  coefA,
  coefB,
  coefC,
  coefD,
  V1_n,
  f_n,
  fs,
  VDC,
  timeDelay,
  Vg
) {
  dutyCycle = 0.5;
  let V2_n_mag = [];
  let V2_n_argument = [];
  let V2_n = [];
  let I2_n = [];
  let I1_n = [];
  let P1 = 0;
  let P1_n = 0;
  let Pout = VDC ** 2 / RL;
  for (n = 0; n < numHarmonics; n++) {
    nodd = (n + 1) * 2 - 1;
    V2_n_mag[n] =
      (((VDC + 2 * Vfwd) * 2 * rectConst) / math.pi / nodd) *
      math.sin(nodd * math.pi * dutyCycle);
    V2_n_argument[n] = -2 * math.pi * nodd * f0 * timeDelay;
    V2_n[n] = math.complex({
      abs: V2_n_mag[n],
      arg: V2_n_argument[n],
    });
    I2_n[n] = math.divide(
      math.subtract(V1_n[n], math.multiply(coefA[n], V2_n[n])),
      coefB[n]
    );
    I1_n[n] = math.add(
      math.multiply(coefC[n], V2_n[n]),
      math.multiply(coefD[n], I2_n[n])
    );
    P1_n = math.multiply(V1_n[n], I1_n[n]);
    P1 = math.add(P1, 0.5 * P1_n.re);
  }
  let i2 = getSinusoidAndRectify(
    I2_n,
    numberOfTimePoints,
    fs,
    numHarmonics,
    f_n
  );
  let i1 = getSinusoidAndRectify(
    I1_n,
    numberOfTimePoints,
    fs,
    numHarmonics,
    f_n
  );
  let SW_n = [];
  SW_n[0] = math.complex({
    abs: 1,
    arg: 0,
  });
  let sw1 = getSinusoidAndRectify(SW_n, numberOfTimePoints, fs, 1, f_n);

  let V1 = math.multiply(sw1.sign, Vg);
  if (invConst == 1) {
    V1 = math.multiply(sw1.half_sign, Vg);
  }

  let efficiency = Pout / P1;
  return {
    i1: i1.sinusoid,
    i2: i2.sinusoid,
    sw1: V1,
    efficiency: efficiency,
    tvec: i1.tvec,
  };
}

//My best implementation of a damped Newton type solver (2D)
function newtonSolver2D(
  Vg,
  numIterations,
  numHarmonics,
  numberOfTimePoints,
  RL,
  f0,
  Vfwd,
  rectConst,
  fs,
  tvec,
  coefA,
  coefB,
  coefC,
  coefD,
  V1_n,
  f_n,
  x
) {
  let xvec = math.transpose(x);
  let VDCConvergence = [];
  let timeDelayConvergence = [];
  let countedIterations = 0;
  let F = [];
  let convergenceFlag = false;
  let xOpt = x;
  //let numberofIterations = 30;
  let lastIteration = numIterations;
  let eps1 = 1e-7; //related to derivative error
  let eps2 = 1e-11; //related to estimation error
  let eps3 = 1e-6; //related to magntidue of F
  let fMag = [];
  let iFlag = 0;
  let f = [];
  let F_Old = [];
  let xOpt_Old = [];
  let hlm = [];
  let hlm0 = [];
  //NEWTONS METHOD
  for (let m = 0; m < numIterations; m++) {
    f = objFun2D(
      numHarmonics,
      numberOfTimePoints,
      RL,
      f0,
      Vfwd,
      rectConst,
      fs,
      tvec,
      coefA,
      coefB,
      coefC,
      coefD,
      V1_n,
      f_n,
      xOpt
    );
    fMag = math.multiply(math.transpose(f), f);

    J = computeJacobian(
      Vg,
      numHarmonics,
      numberOfTimePoints,
      RL,
      f0,
      Vfwd,
      rectConst,
      fs,
      tvec,
      coefA,
      coefB,
      coefC,
      coefD,
      V1_n,
      f_n,
      xOpt
    );

    if (m == 0) {
      if (math.abs(math.det(J)) > 1 / eps1 || math.abs(math.det(J)) < eps1) {
        lastIteration = m;
        break;
      }

      hlm = math.multiply(-0.5, math.inv(J), f);

      xOpt = math.add(xOpt, hlm);
      f = objFun2D(
        numHarmonics,
        numberOfTimePoints,
        RL,
        f0,
        Vfwd,
        rectConst,
        fs,
        tvec,
        coefA,
        coefB,
        coefC,
        coefD,
        V1_n,
        f_n,
        xOpt
      );
      F = math.multiply(f, math.transpose(f));
    }
    if (m > 0) {
      F_Old = F;
      xOpt_Old = xOpt;
      J = computeJacobian(
        Vg,
        numHarmonics,
        numberOfTimePoints,
        RL,
        f0,
        Vfwd,
        rectConst,
        fs,
        tvec,
        coefA,
        coefB,
        coefC,
        coefD,
        V1_n,
        f_n,
        xOpt
      );
      if (math.abs(math.det(J)) > 1 / eps1 || math.abs(math.det(J)) < eps1) {
        lastIteration = m;
        break;
      }
      hlm0 = math.multiply(-0.5, math.inv(J), f);
      for (let i = 0; i < 11; i++) {
        hlm = math.multiply((1 / 4) ^ i, hlm0);
        xOpt = math.add(xOpt, hlm);
        f = objFun2D(
          numHarmonics,
          numberOfTimePoints,
          RL,
          f0,
          Vfwd,
          rectConst,
          fs,
          tvec,
          coefA,
          coefB,
          coefC,
          coefD,
          V1_n,
          f_n,
          xOpt
        );
        F = math.multiply(f, math.transpose(f));
        if (i == 10) {
          iFlag = 1;
          xOpt = xOpt_Old;
          F = F_Old;
          break;
        }
        if (F < F_Old) {
          break;
        }
      }
    }

    if (math.abs(math.det(J)) > 1 / eps1 || math.abs(math.det(J)) < eps1) {
      lastIteration = m;
      break;
    }

    if (math.sqrt(F) < eps3) {
      lastIteration = m;
      break;
    }

    if (iFlag == 1) {
      lastIteration = m;
      break;
    }
  }

  let xOpt0 = math.subset(xOpt, math.index(0));
  let xOpt1 = math.subset(xOpt, math.index(1));
  xOpt = [xOpt0, xOpt1];

  //console.log(F);
  return [xOpt, lastIteration, F];
}
//Compute Jacobian.
function computeJacobian(
  Vg,
  numHarmonics,
  numberOfTimePoints,
  RL,
  f0,
  Vfwd,
  rectConst,
  fs,
  tvec,
  coefA,
  coefB,
  coefC,
  coefD,
  V1_n,
  f_n,
  x
) {
  let deltaVDC = Vg * 1e-4;
  let deltaDelay = (2 / f0) * 1e-4;
  deltaArray = [deltaVDC, deltaDelay];
  //let xPlusDelta = []; //initialize
  //let xMinusDelta = []; //initialize
  let J = [
    [0, 0],
    [0, 0],
  ];
  let xPlusDelta = x;
  let xMinusDelta = x;
  for (let n = 0; n < 2; n++) {
    for (let m = 0; m < 2; m++) {
      let posNudge = x[m] + deltaArray[m];
      let negNudge = x[m] - deltaArray[m];
      let backToNormal = x[m];
      xPlusDelta[m] = posNudge;
      F_plus = objFun2D(
        numHarmonics,
        numberOfTimePoints,
        RL,
        f0,
        Vfwd,
        rectConst,
        fs,
        tvec,
        coefA,
        coefB,
        coefC,
        coefD,
        V1_n,
        f_n,
        xPlusDelta
      );
      xMinusDelta[m] = negNudge;
      F_minus = objFun2D(
        numHarmonics,
        numberOfTimePoints,
        RL,
        f0,
        Vfwd,
        rectConst,
        fs,
        tvec,
        coefA,
        coefB,
        coefC,
        coefD,
        V1_n,
        f_n,
        xMinusDelta
      );
      xPlusDelta[m] = backToNormal;
      xMinusDelta[m] = backToNormal;
      let Jvalue = (F_plus[n] - F_minus[n]) / deltaArray[m] / 2;
      J[n][m] = Jvalue;
    }
  }
  return J;
}

//Main objective function for optimization:
function objFun2D(
  numHarmonics,
  numberOfTimePoints,
  RL,
  f0,
  Vfwd,
  rectConst,
  fs,
  tvec,
  coefA,
  coefB,
  coefC,
  coefD,
  V1_n,
  f_n,
  x
) {
  let VDC = x[0];
  let timeDelay = x[1];
  let dutyCycle = 0.5;
  let V2_n_mag = [];
  let V2_n_ang = [];
  let V2_n = [];
  let I2_n = [];
  let V2_n_argument = [];
  let complexPhase = math.complex({
    abs: 1,
    arg: -2 * math.pi * f0 * timeDelay,
  });
  //update V2_n and I2_n
  for (n = 0; n < numHarmonics; n++) {
    nodd = (n + 1) * 2 - 1;
    V2_n_mag[n] =
      (((VDC + 2 * Vfwd) * 2 * rectConst) / math.pi / nodd) *
      math.sin(nodd * math.pi * dutyCycle);
    V2_n_argument[n] = -2 * math.pi * nodd * f0 * timeDelay;
    V2_n[n] = math.complex({
      abs: V2_n_mag[n],
      arg: V2_n_argument[n],
    });
    I2_n[n] = math.divide(
      math.subtract(V1_n[n], math.multiply(coefA[n], V2_n[n])),
      coefB[n]
    );
  }
  //Get updated VDC and v2norm
  let i2 = getSinusoidAndRectify(
    I2_n,
    numberOfTimePoints,
    fs,
    numHarmonics,
    f_n
  );
  let i2_sinusoid = i2.sinusoid;
  let i2_rectified = i2.rectified;
  let v2_norm = i2.sign;
  let updatedVDC = math.mean(i2_rectified) * RL;
  //If rectifier is a half-wave rectifier, do this:
  if (rectConst == 1) {
    v2_norm = i2.half_sign;
    updatedVDC = math.mean(i2.half_rectified) * RL;
  }

  let updatedPulseProperties = computepulseProp(f0, v2_norm, fs, rectConst); //Initial guess
  let updatedTimeDelay = updatedPulseProperties[0];

  let updatedComplexPhase = math.complex({
    abs: 1,
    arg: -2 * math.pi * f0 * updatedTimeDelay,
  });

  let complexPhaseDiff = math.abs(
    math.subtract(complexPhase, updatedComplexPhase)
  );
  let VDCDiff = math.abs(updatedVDC - VDC) / VDC;
  return [complexPhaseDiff, VDCDiff];
}

function ABCD_matrix_LCC_series(
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
) {
  let ABCD_series_Lf = ABCD_matrix_series_L(freq, Lf1, RLf1 + RonACeq);
  let ABCD_parallel_Cf = ABCD_matrix_parallel_C(freq, Cf1, RCf1);
  let ABCD_SS = ABCD_matrix_SS(freq, L1, L2, C1, C2, RL1, RL2, RC1, RC2, k, 0);
  let ABCD = math.multiply(ABCD_series_Lf, ABCD_parallel_Cf, ABCD_SS);
  return ABCD;
}

function ABCD_matrix_LCC_LCC(
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
) {
  let ABCD_series_Lf1 = ABCD_matrix_series_L(freq, Lf1, RLf1 + RonACeq);
  let ABCD_series_Lf2 = ABCD_matrix_series_L(freq, Lf2, RLf2);
  let ABCD_parallel_Cf1 = ABCD_matrix_parallel_C(freq, Cf1, RCf1);
  let ABCD_parallel_Cf2 = ABCD_matrix_parallel_C(freq, Cf2, RCf2);
  /* let ABCD_resonator1 = ABCD_matrix_series_LCR(freq, L1, C1, RL1, RC1);
  let ABCD_resonator2 = ABCD_matrix_series_LCR(freq, L2, C2, RL2, RC2);
  let ABCD_K = ABCD_matrix_series_K(freq, L1, L2, k); */
  let ABCD_SS = ABCD_matrix_SS(freq, L1, L2, C1, C2, RL1, RL2, RC1, RC2, k, 0);
  let ABCD = math.multiply(
    ABCD_series_Lf1,
    ABCD_parallel_Cf1,
    ABCD_SS,
    ABCD_parallel_Cf2,
    ABCD_series_Lf2
  );

  return ABCD;
}

function ABCD_matrix_SS(freq, L1, L2, C1, C2, RL1, RL2, RC1, RC2, k, RonACeq) {
  let M = k * math.sqrt(L1 * L2);
  let Z1 = math.complex(
    RonACeq + RL1 + RC1,
    2 * math.pi * freq * (L1 - M) - 1 / 2 / math.pi / freq / C1
  );

  let Z3 = math.complex(0, 2 * math.pi * freq * M);

  let Z2 = math.complex(
    RL2 + RC2,
    2 * math.pi * freq * (L2 - M) - 1 / 2 / math.pi / freq / C2
  );

  let coefA = math.add(1, math.divide(Z1, Z3));
  let coefB = math.add(Z1, Z2, math.divide(math.multiply(Z1, Z2), Z3));
  let coefC = math.divide(1, Z3);
  let coefD = math.add(1, math.divide(Z2, Z3));
  let ABCD = math.matrix([
    [coefA, coefB],
    [coefC, coefD],
  ]);
  return ABCD;
}
function ABCD_matrix_series_LCR(freq, L, C, RL, RC) {
  let coefA = 1;
  let coefB = math.complex(
    RL + RC,
    2 * math.pi * freq * L - 1 / 2 / math.pi / freq / C
  );
  let coefC = 0;
  let coefD = 1;
  let ABCD = math.matrix([
    [coefA, coefB],
    [coefC, coefD],
  ]);
  return ABCD;
}
function ABCD_matrix_series_L(freq, L, RL) {
  let coefA = 1;
  let coefB = math.complex(RL, 2 * math.pi * freq * L);
  let coefC = 0;
  let coefD = 1;
  let ABCD = math.matrix([
    [coefA, coefB],
    [coefC, coefD],
  ]);
  return ABCD;
}

function ABCD_matrix_parallel_C(freq, C, RC) {
  let coefA = 1;
  let coefB = 0;
  let coefC = math.divide(1, math.complex(RC, -1 / (2 * math.pi * freq * C)));
  let coefD = 1;
  let ABCD = math.matrix([
    [coefA, coefB],
    [coefC, coefD],
  ]);
  return ABCD;
}

function ABCD_matrix_series_K(freq, L1, L2, k) {
  K = 2 * math.pi * freq * k * (L1 * L2) ** (1 / 2);
  let coefA = 0;
  let coefB = math.complex(0, -K);
  let coefC = math.complex(0, -1 / K);
  let coefD = 0;
  let ABCD = math.matrix([
    [coefA, coefB],
    [coefC, coefD],
  ]);
  return ABCD;
}
function getSinusoidAndRectify(
  Phasors,
  numberOfTimePoints,
  fs,
  numHarmonics,
  f_n
) {
  //let sinusoid = [];

  let sinusoid = Array(numberOfTimePoints).fill(0);
  let rectified = Array(numberOfTimePoints).fill(0);
  let half_rectified = Array(numberOfTimePoints).fill(0);
  let sign = Array(numberOfTimePoints).fill(1);
  let half_sign = Array(numberOfTimePoints).fill(1);
  let tvec = [];
  for (let m = 0; m < numberOfTimePoints; m++) {
    tvec[m] = m / fs;
    for (n = 0; n < numHarmonics; n++) {
      sinusoid[m] =
        sinusoid[m] +
        math.abs(Phasors[n]) *
          math.cos(2 * math.pi * f_n[n] * tvec[m] + Phasors[n].toPolar().phi);
    }
    rectified[m] = sinusoid[m];
    half_rectified[m] = sinusoid[m];
    if (rectified[m] < 0) {
      rectified[m] = math.abs(sinusoid[m]);
      half_rectified[m] = 0;
      sign[m] = -1;
      half_sign[m] = 0;
    }
  }
  return {
    sinusoid: sinusoid,
    rectified: rectified,
    half_rectified: half_rectified,
    sign: sign,
    half_sign: half_sign,
    tvec: tvec,
  };
}

function computepulseProp(f0, squareWave, fs, rectConst) {
  let risingEdges = findRisingEdge(squareWave, rectConst);
  let fallingEdges = findFallingEdge(squareWave, rectConst);
  let pulseWidth = [];
  let timeDelay = [];
  let dutyCycle = [];
  if (fallingEdges[0] > risingEdges[0]) {
    pulseWidth = fallingEdges[0] - risingEdges[0];
    timeDelay = pulseWidth / 2 / fs + (risingEdges[0] + 0.5) / fs;
    dutyCycle = (pulseWidth / fs) * f0;
  }

  if (fallingEdges[0] < risingEdges[0]) {
    pulseWidth = fallingEdges[1] - risingEdges[0];
    timeDelay = pulseWidth / 2 / fs + (risingEdges[0] + 0.5) / fs;
    dutyCycle = (pulseWidth / fs) * f0;
  }
  return [timeDelay, dutyCycle];
}

function findFallingEdge(array, rectConst) {
  //finds indices of first two falling edges.
  let negativeValue = 0;
  let fallingEdges = [];
  switch (Number(rectConst)) {
    case 1: //half-bridge rectifier
      negativeValue = 0;
      break;
    case 2: //full-bridge rectifier
      negativeValue = -1;
      break;
  }
  firstValue = array[0]; //sample the first value in the array
  if (firstValue == 1) {
    //if the first value is high then find when the signal goes low
    fallingEdges[0] = array.indexOf(negativeValue);
    firstRisingEdge = array.indexOf(1, fallingEdges[0]);
    fallingEdges[1] = array.indexOf(negativeValue, firstRisingEdge);
  }
  if (firstValue == negativeValue) {
    //if first value is low then find when the signal goes high
    firstRisingEdge = array.indexOf(1);
    fallingEdges[0] = array.indexOf(negativeValue, firstRisingEdge);
    let secondRisingEdge = array.indexOf(1, fallingEdges[0]);
    fallingEdges[1] = array.indexOf(negativeValue, secondRisingEdge);
  }

  return fallingEdges;
}

function findRisingEdge(array, rectConst) {
  //finds indices of first two rising edges.
  let negativeValue = 0;
  let risingEdges = [];
  switch (Number(rectConst)) {
    case 1: //half-bridge rectifier
      negativeValue = 0;
      break;
    case 2: //full-bridge rectifier
      negativeValue = -1;
      break;
  }
  firstValue = array[0]; //sample the first value in the array
  if (firstValue == 1) {
    //if the first value is high then find when the signal goes low
    let firstNegative = array.indexOf(negativeValue);
    risingEdges[0] = array.indexOf(1, firstNegative);
    let secondNegative = array.indexOf(negativeValue, risingEdges[0]);
    risingEdges[1] = array.indexOf(1, secondNegative);
  }
  if (firstValue == negativeValue) {
    //if first value is low then find when the signal goes high
    risingEdges[0] = array.indexOf(1);
    let firstNegative = array.indexOf(negativeValue, risingEdges[0]);
    risingEdges[1] = array.indexOf(1, firstNegative);
  }

  return risingEdges;
}

function objFun1D(
  numHarmonics,
  numberOfTimePoints,
  RL,
  f0,
  Vfwd,
  rectConst,
  fs,
  tvec,
  coefA,
  coefB,
  coefC,
  coefD,
  V1_n,
  f_n,
  VDC,
  solveForIL,
  x
) {
  let timeDelay = x;
  let dutyCycle = 0.5;
  let V2_n_mag = [];
  let V2_n_ang = [];
  let V2_n = [];
  let I2_n = [];
  let V2_n_argument = [];
  let complexPhase = math.complex({
    abs: 1,
    arg: -2 * math.pi * f0 * timeDelay,
  });
  //update V2_n and I2_n
  for (n = 0; n < numHarmonics; n++) {
    nodd = (n + 1) * 2 - 1;
    V2_n_mag[n] =
      (((VDC + 2 * Vfwd) * 2 * rectConst) / math.pi / nodd) *
      math.sin(nodd * math.pi * dutyCycle);
    V2_n_argument[n] = -2 * math.pi * nodd * f0 * timeDelay;
    V2_n[n] = math.complex({
      abs: V2_n_mag[n],
      arg: V2_n_argument[n],
    });
    I2_n[n] = math.divide(
      math.subtract(V1_n[n], math.multiply(coefA[n], V2_n[n])),
      coefB[n]
    );
  }
  //Get updated VDC and v2norm
  let i2 = getSinusoidAndRectify(
    I2_n,
    numberOfTimePoints,
    fs,
    numHarmonics,
    f_n
  );
  let i2_sinusoid = i2.sinusoid;
  let i2_rectified = i2.rectified;
  let v2_norm = i2.sign;
  let IL = math.mean(i2_rectified);
  //If rectifier is a half-wave rectifier, do this:
  if (rectConst == 1) {
    v2_norm = i2.half_sign;
    IL = math.mean(i2.half_rectified);
  }

  let updatedPulseProperties = computepulseProp(f0, v2_norm, fs, rectConst); //Initial guess
  let updatedTimeDelay = updatedPulseProperties[0];

  let updatedComplexPhase = math.complex({
    abs: 1,
    arg: -2 * math.pi * f0 * updatedTimeDelay,
  });

  let complexPhaseDiff = math.abs(
    math.subtract(complexPhase, updatedComplexPhase)
  );
  if (solveForIL == 0) {
    return complexPhaseDiff;
  }
  if (solveForIL == 1) {
    return IL;
  }
}

//Compute derivative. Used by newtonSolver1D function.
function computeDerivativeTimeDelay(
  Vg,
  numHarmonics,
  numberOfTimePoints,
  RL,
  f0,
  Vfwd,
  rectConst,
  fs,
  tvec,
  coefA,
  coefB,
  coefC,
  coefD,
  V1_n,
  f_n,
  VDC,
  x
) {
  let solveForIL = 0;
  let deltaTimeDelay = (2 / f0) * 1e-4;
  let xPlusDelta = x + deltaTimeDelay;
  let xMinusDelta = x - deltaTimeDelay;

  let F_plus = objFun1D(
    numHarmonics,
    numberOfTimePoints,
    RL,
    f0,
    Vfwd,
    rectConst,
    fs,
    tvec,
    coefA,
    coefB,
    coefC,
    coefD,
    V1_n,
    f_n,
    VDC,
    solveForIL,
    xPlusDelta
  );

  let F_minus = objFun1D(
    numHarmonics,
    numberOfTimePoints,
    RL,
    f0,
    Vfwd,
    rectConst,
    fs,
    tvec,
    coefA,
    coefB,
    coefC,
    coefD,
    V1_n,
    f_n,
    VDC,
    solveForIL,
    xMinusDelta
  );

  let derivativeTimeDelay = (F_plus - F_minus) / deltaTimeDelay / 2;
  return derivativeTimeDelay;
}

//My best implementation of a damped Newton type solver (1D)
function newtonSolver1D(
  Vg,
  numIterations,
  numHarmonics,
  numberOfTimePoints,
  RL,
  f0,
  Vfwd,
  rectConst,
  fs,
  tvec,
  coefA,
  coefB,
  coefC,
  coefD,
  V1_n,
  f_n,
  VDC,
  x
) {
  let timeDelayConvergence = [];
  let countedIterations = 0;
  let F = [];
  let convergenceFlag = false;
  let xOpt = x;
  //let numberofIterations = 30;
  let lastIteration = numIterations;
  let eps1 = 1e-7; //related to derivative error
  let eps2 = 1e-11; //related to estimation error
  let eps3 = 1e-6; //related to magntidue of F
  let fMag = [];
  let iFlag = 0;
  let f = [];
  let F_Old = [];
  let xOpt_Old = [];
  let hlm = [];
  let hlm0 = [];
  //NEWTONS METHOD
  for (let m = 0; m < numIterations; m++) {
    f = objFun1D(
      numHarmonics,
      numberOfTimePoints,
      RL,
      f0,
      Vfwd,
      rectConst,
      fs,
      tvec,
      coefA,
      coefB,
      coefC,
      coefD,
      V1_n,
      f_n,
      VDC,
      0,
      xOpt
    );

    J = computeDerivativeTimeDelay(
      Vg,
      numHarmonics,
      numberOfTimePoints,
      RL,
      f0,
      Vfwd,
      rectConst,
      fs,
      tvec,
      coefA,
      coefB,
      coefC,
      coefD,
      V1_n,
      f_n,
      VDC,
      xOpt
    );

    if (m == 0) {
      hlm = (-0.5 * f) / J;
      xOpt = xOpt + hlm;
      f = objFun1D(
        numHarmonics,
        numberOfTimePoints,
        RL,
        f0,
        Vfwd,
        rectConst,
        fs,
        tvec,
        coefA,
        coefB,
        coefC,
        coefD,
        V1_n,
        f_n,
        VDC,
        0,
        xOpt
      );

      F = f ** 2;
    }
    if (m > 0) {
      F_Old = F;
      xOpt_Old = xOpt;
      J = computeDerivativeTimeDelay(
        Vg,
        numHarmonics,
        numberOfTimePoints,
        RL,
        f0,
        Vfwd,
        rectConst,
        fs,
        tvec,
        coefA,
        coefB,
        coefC,
        coefD,
        V1_n,
        f_n,
        VDC,
        xOpt
      );
      hlm0 = hlm = (-0.5 * f) / J;
      for (let i = 0; i < 11; i++) {
        hlm = math.multiply((1 / 4) ^ i, hlm0);
        xOpt = xOpt + hlm;
        f = objFun1D(
          numHarmonics,
          numberOfTimePoints,
          RL,
          f0,
          Vfwd,
          rectConst,
          fs,
          tvec,
          coefA,
          coefB,
          coefC,
          coefD,
          V1_n,
          f_n,
          VDC,
          0,
          xOpt
        );
        F = f ** 2;
        if (i == 10) {
          iFlag = 1;
          xOpt = xOpt_Old;
          F = F_Old;
          break;
        }
        if (F < F_Old) {
          break;
        }
      }
    }

    if (math.abs(J) > 1 / eps1 || math.abs(J) < eps1) {
      lastIteration = m;
      break;
    }

    if (math.sqrt(F) < eps3) {
      lastIteration = m;
      break;
    }

    if (iFlag == 1) {
      lastIteration = m;
      break;
    }
  }
  return xOpt;
}
function theveninOptimize(
  numThevIterations,
  Vg,
  numIterations,
  numHarmonics,
  numberOfTimePoints,
  RL,
  f0,
  Vfwd,
  rectConst,
  fs,
  tvec,
  coefA,
  coefB,
  coefC,
  coefD,
  V1_n,
  f_n,
  x0
) {
  let solveForIL = 0;
  let timeDelayPoint = [];
  let VDCPoint = [];
  let ILPoint = [];
  let RLPoint = [];
  let eps = 0;
  let a0 = 0;
  let Rth = 0;
  let Vth = 0;
  let x = [];
  for (m = 0; m < numThevIterations; m++) {
    let initialVDC = x0[0];
    let initialTimeDelay = x0[1];
    if (m == 0) {
      VDCPoint[m] = initialVDC;
      solveForIL = 0;
      timeDelayPoint[m] = newtonSolver1D(
        Vg,
        numIterations,
        numHarmonics,
        numberOfTimePoints,
        RL,
        f0,
        Vfwd,
        rectConst,
        fs,
        tvec,
        coefA,
        coefB,
        coefC,
        coefD,
        V1_n,
        f_n,
        VDCPoint[m],
        initialTimeDelay
      );
      solveForIL = 1;
      ILPoint[m] = objFun1D(
        numHarmonics,
        numberOfTimePoints,
        RL,
        f0,
        Vfwd,
        rectConst,
        fs,
        tvec,
        coefA,
        coefB,
        coefC,
        coefD,
        V1_n,
        f_n,
        VDCPoint[m],
        solveForIL,
        timeDelayPoint[m]
      );
      RLPoint[m] = VDCPoint[m] / ILPoint[m];

      if (RLPoint[m] >= RL) {
        eps = -0.1;
      } else {
        eps = 0.1;
      }
      VDCPoint[m + 1] = VDCPoint[m] * (1 + eps);
    }

    if (m > 0) {
      timeDelayPoint[m] = newtonSolver1D(
        Vg,
        numIterations,
        numHarmonics,
        numberOfTimePoints,
        RL,
        f0,
        Vfwd,
        rectConst,
        fs,
        tvec,
        coefA,
        coefB,
        coefC,
        coefD,
        V1_n,
        f_n,
        VDCPoint[m],
        timeDelayPoint[m - 1]
      );

      solveForIL = 1;
      ILPoint[m] = objFun1D(
        numHarmonics,
        numberOfTimePoints,
        RL,
        f0,
        Vfwd,
        rectConst,
        fs,
        tvec,
        coefA,
        coefB,
        coefC,
        coefD,
        V1_n,
        f_n,
        VDCPoint[m],
        solveForIL,
        timeDelayPoint[m]
      );
      RLPoint[m] = VDCPoint[m] / ILPoint[m];
      a0 = ((VDCPoint[m - 1] / VDCPoint[m]) * RLPoint[m]) / RLPoint[m - 1];
      Rth = (RLPoint[m] - a0 * RLPoint[m - 1]) / (a0 - 1);
      Vth = (VDCPoint[m] * (RLPoint[m] + Rth)) / RLPoint[m];

      if (m < numThevIterations) {
        VDCPoint[m + 1] = (Vth * RL) / (RL + Rth);
      }
      let VDCPointReturn = VDCPoint[VDCPoint.length - 1];
      let timeDelayPointReturn = timeDelayPoint[timeDelayPoint.length - 1];
      x = [VDCPointReturn, timeDelayPointReturn];
      return x;
    }
  }
}
