function calculate() {
    var age = document.getElementById("age").value;
    var creatinine = document.getElementById("creatinine").value;
    var gender = document.getElementById("gender").value;
    var race = document.getElementById("race").value;
    var weight = document.getElementById("weight").value;
    var albumin = document.getElementById("albumin").value;
    var creatinineUrine = document.getElementById("creatinine-urine").value;
    var eGFR, acr;
    if (gender == "male") {
    if (race == "african-american") {
    eGFR = 1.212 * (140 - age) * (creatinine / 0.9) ** (-0.411) * 1.18;
    } else {
    eGFR = 1.212 * (140 - age) * (creatinine / 0.9) ** (-0.411);
    }
    } else {
    if (race == "african-american") {
    eGFR = 1.212 * (140 - age) * (creatinine / 0.7) ** (-0.329) * 1.18 * 0.742;
    } else {
    eGFR = 1.212 * (140 - age) * (creatinine / 0.7) ** (-0.329) * 0.742;
    }
    }
    acr = (albumin / creatinineUrine) * (weight / 1.73);
    var stage = getCKDStage(eGFR, acr);
    var result = document.getElementById("result");
    result.innerHTML = "Your estimated eGFR is " + eGFR.toFixed(2) + " mL/min/1.73 m<sup>2</sup>. Your ACR is " + acr.toFixed(2) + " mg/g. According to the NKF KDOQI guidelines, " + stage + ".";
    }
    
      function getCKDStage(eGFR, acr) {
          if (eGFR >= 90 && acr < 30) {
              return "no-ckd";
          } else if (eGFR >= 90 && acr >= 30) {
              return 1;
          } else if (eGFR >= 60 && eGFR < 90 && acr >= 30) {
              return 2;
          } else if (eGFR >= 45 && eGFR < 60) {
              if (acr >= 30 && acr < 300) {
                  return "3a";
              } else if (acr >= 300) {
                  return 4;
              } else {
                  return "3a";
              }
          } else if (eGFR >= 30 && eGFR < 45) {
              if (acr >= 30 && acr < 300) {
                  return "3b";
              } else if (acr >= 300) {                return 4;
              } else {
                  return "3a";
              }
          } else if (eGFR < 30) {
              if (acr < 300) {
                  return 5;
              } else if (acr >= 300) {
                  return 4;
              } else {
                  return "3b";
              }
          }
      }
    
      document.querySelector("form").addEventListener("submit", function(event) {
          event.preventDefault();
          calculate();
      });