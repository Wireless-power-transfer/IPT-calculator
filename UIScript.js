var open = 0; //1 means the sidebar is open. This is used by the sticky button that asks to close sidebar or not.

//The purpose of this code is to expand the time-domain simulation options (allowing more input choices) when a user enables the time-domain simulation by selecting the relevant check box.
document
  .getElementById("enableTimeDomainChoice")
  .addEventListener("change", () => {
    // Get value
    let sourceType = sourceSelectFunction(); //Indicates source type. Will return 1 for Vg or 2 for Ig
    let loadType = loadSelectFunction(); //Indicates load type. Will return RL,VL, IL, or PL
    let compensationType = document.getElementById("compensation").value;

    let choice = Number(
      document.getElementById("enableTimeDomainChoice").value
    );
    // If the checkbox is checked, display the output text
    switch (choice) {
      case 1: //time domain option selected
        //Default:
        document.getElementById("TimeDomainInputtext1").style.display = "none";

        document.getElementById("time-domain-area").style.display = "none";
        document.getElementById("time-domain-enable-message").innerHTML =
          "Time domain option only available for voltage sources with voltage loads. Time domain option is also not available for series-parallel compensation.";

        if (sourceType == 1 && loadType == 2 && compensationType != 2) {
          document.getElementById("TimeDomainInputtext1").style.display =
            "inline";
          //document.getElementById("TimeDomainInputtext2").style.display =
          //  "inline";
          document.getElementById("time-domain-area").style.display = "inline";
          document.getElementById("time-domain-enable-message").innerHTML = "";
        }

        break;
      case 2: //time domain option not selected
        document.getElementById("TimeDomainInputtext1").style.display = "none";
        document.getElementById("time-domain-area").style.display = "none";
        document.getElementById("time-domain-enable-message").innerHTML =
          "Time domain option not enabled.";

        //"Time domain option not selected.";
        break;
    }
  });

//The purpose of this code is to expand the proper window (allowing more input choices) when a user selects an adanced compensation scheme (i.e., LCC-series or LCC-LCC)
document.getElementById("compensation").addEventListener("change", () => {
  let compensation = Number(document.getElementById("compensation").value);
  switch (compensation) {
    case 1: //series-series compensation
      document.getElementById("lccSeriesButtonDisplayArea").style.display =
        "none";
      document.getElementById("lccLCCButtonDisplayArea").style.display = "none";
      break;
    case 2: //series-parallel compensation
      document.getElementById("lccSeriesButtonDisplayArea").style.display =
        "none";
      document.getElementById("lccLCCButtonDisplayArea").style.display = "none";
      break;
    case 3: //LCC-series compensation
      document.getElementById("lccSeriesButtonDisplayArea").style.display =
        "inline";
      document.getElementById("lccLCCButtonDisplayArea").style.display = "none";
      break;
    case 4: //LCC-LCC compensation
      document.getElementById("lccSeriesButtonDisplayArea").style.display =
        "inline";
      document.getElementById("lccLCCButtonDisplayArea").style.display =
        "inline";
      break;
  }
});

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
      "&nbsp;&nbsp;Load resistance, <span style='font-family:Times New Roman'><i> R<sub>L</sub> </i></span> (<span style='font-family:Times New Roman'>&#8486;</span>): ";
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
  //THe purpose of this code snippet below is to only show the enable time domain box when source type = 1 and load type =2
  if (loadType == 2) {
    let sourceType = sourceSelectFunction(); //Indicates source type. Will return 1 for Vg or 2 for Ig
    if (sourceType == 1) {
      document.getElementById("TimeDomainEnableButton").style.display =
        "inline";
    }
  } else {
    document.getElementById("TimeDomainEnableButton").style.display = "none";
  }

  return loadType;
}
