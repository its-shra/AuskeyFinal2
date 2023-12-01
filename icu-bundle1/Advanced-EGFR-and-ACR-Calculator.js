function calculate() {
    var age = document.getElementById("age").value;
    var creatinine = document.getElementById("creatinine").value;
    var gender = document.getElementById("gender").value;
    var race = document.getElementById("race").value;
    var weight = document.getElementById("weight").value;
    var albumin = document.getElementById("albumin").value;
    var creatinineUrine = document.getElementById("creatinine-urine").value;
    var result = document.getElementById("result");

    data = {
        age: age,
        creatinine: creatinine,
        gender: gender,
        race: race,
        weight: weight,
        albumin: albumin, 
        creatinineUrine: creatinineUrine
    }

    fetch('http://navrakshak.in/api/calculate-adv-egfr/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(response); // Log the response for inspection
        return response.json();
    })
    .then(data => {
    result.innerHTML = "Your estimated eGFR is " + `${data['eGFR']}` + " mL/min/1.73 m<sup>2</sup>. Your ACR is " + `${data['acr']}` + " mg/g. According to the NKF KDOQI guidelines, " + `${data['stage']}` + ".";

    })
    .catch(error => {
        console.error('Error:', error);
    });

}
    
    document.querySelector("form").addEventListener("submit", function(event) {
          event.preventDefault();
          calculate();
      });