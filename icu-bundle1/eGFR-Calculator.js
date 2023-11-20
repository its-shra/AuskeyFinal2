  function calculate() {
      const age = document.getElementById("age").value;
      const creatinine = document.getElementById("creatinine").value;
      const gender = document.getElementById("gender").value;
      const race = document.getElementById("race").value;
      const weight = document.getElementById("weight").value;
      var result = document.getElementById("result");
      var nfkCriteria = document.getElementById("result2");

      const data = {
        age: age,
        creatinine: creatinine,
        gender: gender,
        race: race,
        weight: weight
      }

      fetch('http://navrakshak.in/api/calculate-egfr/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data =>{
        console.log(data);
        result.innerHTML = `<p>Your estimated GFR is  ${data['result']} mL/min/1.73 m<sup>2</sup>.</p>`;
        nfkCriteria.innerHTML = `${data['nfkCriteria']}`;
      })
      .catch(error=>{
        console.error('Error:', error);
      });
  }

  document.querySelector("form").addEventListener("submit", function(event) {
      event.preventDefault();
      calculate();
  });
