const form = document.getElementById("sofa-form");
const result = document.querySelector(".result-score");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const pao2 = parseInt(document.getElementById("pao2").value);
  const platelets = parseInt(document.getElementById("platelets").value);
  const bilirubin = parseFloat(document.getElementById("bilirubin").value);
  const meanbp = parseInt(document.getElementById("meanbp").value);
  const glasgow = parseInt(document.getElementById("glasgow").value);

  const data = {
    pao2:pao2,
    platelets:platelets,
    bilirubin: bilirubin,
    meanbp: meanbp,
    glasgow:glasgow
  }

  fetch('http://navrakshak.in/api/calculate-sofa/', {
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
    result.textContent = `${data['sofaScore']}`;
})
.catch(error => {
    console.error('Error:', error);
});


//   const scores = [0, 0, 0, 0, 0];

//   if (pao2 < 400) {
//     scores[0] = 1;
//   }
//   if (platelets < 150000) {
//     scores[1] = 1;
//   }
//   if (bilirubin > 1.2) {
//     scores[2] = 1;
//   }
//   if (meanbp < 70) {
//     scores[3] = 1;
//   }
//   if (glasgow < 15) {
//     scores[4] = 1;
//   }

//   const sofaScore = scores.reduce((a, b) => a + b, 0);

//   result.textContent = sofaScore;
});
