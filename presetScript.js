function presetFun() {
  let presetChoice = Number(document.getElementById("presetChoice").value);

  if (presetChoice == 1) {
    hashString =
      "#source=1&load=2&inverter=1&rectifier=2&fmin=110e3&fmax=115e3&fnum=250&Vg_Ig=23&RL_VL_IL_PL=12&k=0.42&L1=27.41E-6&L2=27.5e-6&D=0.41&Vfwd=.45&RL1=.193&RL2=.19&RC1=0&RC2=0&C1=.1013E-6&C2=.101E-6&compensation=1&Lf1=5E-6&RLf1=10E-3&Cf1=9.5E-8&RCf1=10E-3&Lf2=5E-6&RLf2=10E-3&Cf2=9.5E-8&RCf2=10E-3&f0=113E3&numHarmonics=20&enableTimeDomainChoice=1";
    http: document.getElementById("presetDescription").innerHTML = "";
  }

  if (presetChoice == 2) {
    hashString =
      "#source=1&load=2&inverter=1&rectifier=2&fmin=110e3&fmax=115e3&fnum=250&Vg_Ig=23&RL_VL_IL_PL=12&k=0.42&L1=27.41E-6&L2=27.5e-6&D=0.41&Vfwd=.45&RL1=.193&RL2=.19&RC1=0&RC2=0&C1=.1013E-6&C2=.101E-6&compensation=1&Lf1=5E-6&RLf1=10E-3&Cf1=9.5E-8&RCf1=10E-3&Lf2=5E-6&RLf2=10E-3&Cf2=9.5E-8&RCf2=10E-3&f0=113E3&numHarmonics=20&enableTimeDomainChoice=1";
    document.getElementById("presetDescription").innerHTML = "";
    //"<b>Selected preset configuration parameters from following reference (note that component losses were not given in paper):</b> V. P. Galigekere, O. Onar, J. Pries, S. Zou, Z. Wang and M. Chinthavali, 'Sensitivity Analysis of Primary-Side LCC and Secondary-Side Series Compensated Wireless Charging System,' 2018 IEEE Transportation Electrification Conference and Expo (ITEC), Long Beach, CA, USA, 2018, pp. 885-891, doi: 10.1109/ITEC.2018.8450163.";
  }

  if (presetChoice == 3) {
    hashString =
      "#source=1&load=1&inverter=2&rectifier=2&fmin=10e3&fmax=40e3&fnum=250&Vg_Ig=354.9&RL_VL_IL_PL=13&k=0.265&L1=105.6E-6&L2=106.4E-6&D=0.5&Vfwd=0.3&RL1=30e-3&RL2=30e-3&RC1=10e-3&RC2=10e-3&C1=0.71E-6&C2=0.71E-6&compensation=3&Lf1=26.98E-6&RLf1=10E-3&Cf1=2.24E-6&RCf1=10E-3&Lf2=5E-6&RLf2=10E-3&Cf2=9.5E-8&RCf2=10E-3&f0=22E3&numHarmonics=50&enableTimeDomainChoice=1";
    document.getElementById("presetDescription").innerHTML =
      "<b>Selected preset configuration parameters from following reference (note that component losses were not given in paper):</b> V. P. Galigekere, O. Onar, J. Pries, S. Zou, Z. Wang and M. Chinthavali, 'Sensitivity Analysis of Primary-Side LCC and Secondary-Side Series Compensated Wireless Charging System,' 2018 IEEE Transportation Electrification Conference and Expo (ITEC), Long Beach, CA, USA, 2018, pp. 885-891, doi: 10.1109/ITEC.2018.8450163.";
  }

  if (presetChoice == 4) {
    hashString =
      "#source=1&load=1&inverter=1&rectifier=2&fmin=70e3&fmax=90e3&fnum=250&Vg_Ig=20&RL_VL_IL_PL=2.5&k=0.6&L1=20.22E-6&L2=20.59E-6&D=0.5&Vfwd=0.315&RL1=0.1&RL2=0.1&RC1=0.1&RC2=0.1&C1=141.78E-9&C2=139.23E-9&compensation=1&Lf1=26.98E-6&RLf1=10E-3&Cf1=2.24E-6&RCf1=10E-3&Lf2=5E-6&RLf2=10E-3&Cf2=9.5E-8&RCf2=10E-3&f0=80E3&numHarmonics=50&enableTimeDomainChoice=1";

    document.getElementById("presetDescription").innerHTML =
      "<b>Selected preset configuration parameters from following reference:</b> Y. Fang, B. M. H. Pong and R. S. Y. Hui, 'An Enhanced Multiple Harmonics Analysis Method for Wireless Power Transfer Systems,' in IEEE Transactions on Power Electronics, vol. 35, no. 2, pp. 1205-1216, Feb. 2020, doi: 10.1109/TPEL.2019.2925050.";
  }

  if (presetChoice == 5) {
    hashString =
      "#source=1&load=4&inverter=1&rectifier=1&fmin=150e3&fmax=185e3&fnum=250&Vg_Ig=12&RL_VL_IL_PL=5&k=0.206&L1=25.88e-6&L2=26.07e-6&D=0.5&Vfwd=0.45&RL1=137e-3&RL2=142e-3&RC1=1e-3&RC2=1e-3&C1=36.13E-9&C2=35.99E-9&compensation=1&Lf1=5E-6&RLf1=10E-3&Cf1=9.5E-8&RCf1=10E-3&Lf2=5E-6&RLf2=10E-3&Cf2=9.5E-8&RCf2=10E-3&f0=75E3&numHarmonics=10&enableTimeDomainChoice=1";

    document.getElementById("presetDescription").innerHTML =
      "A.D.Scher, M.Kos̆ík, P.Pham, D.Costinett and E.Hossain, 'Stability Analysis and Efficiency Optimization of an Inductive Power Transfer System With a Constant Power Load,' in IEEE Access, vol. 8, pp. 209762 - 209775, 2020.";
  }
  location.hash = hashString;
}
