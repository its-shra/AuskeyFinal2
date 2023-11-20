document.getElementById('calculateButton').addEventListener('click', function(){
    const ph = parseFloat(document.querySelector('input[name="ph"]').value);
    const pao2 = parseFloat(document.querySelector('input[name="pao2"]').value);
    const paco2 = parseFloat(document.querySelector('input[name="paco2"]').value);
    const hco3 = parseFloat(document.querySelector('input[name="hco3"]').value);
    const na = parseFloat(document.querySelector('input[name="na"]').value);
    const k = parseFloat(document.querySelector('input[name="k"]').value);
    const cl = parseFloat(document.querySelector('input[name="cl"]').value);
    const alb = parseFloat(document.querySelector('input[name="albumin"]').value);

    const data={
        ph: ph,
        pao2: pao2,
        paco2: paco2,
        hco3: hco3,
        na: na,
        k: k,
        cl: cl,
        alb: alb
    }

    fetch('http://navrakshak.in/api/calculate-abg', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('abg-results').innerHTML = `
            <p>pH Status: ${data['pH Status']}</p>
            <p>Primary Respiratory Disturbance: ${data['Primary Respiratory Disturbance']}</p>
            <p>Primary Metabolic Disturbance: ${data['Primary Metabolic Disturbance']}</p>
            <p>Expected Respiratory Compensation: ${data['Expected Respiratory Compensation']}</p>
            <p>Expected Metabolic Compensation: ${data['Expected Metabolic Compensation']}</p>
            <p>Degree of Compensation: ${data['Degree of Compensation']}</p>
            <p>Anion Gap: ${data['Anion Gap']}</p>
            <p>Gap Metabolic Acidosis: ${data['Gap Metabolic Acidosis']}</p>
            <p>Delta Na: ${data['Delta Na']}</p>
            <p>Corrected Anion Gap: ${data['Corrected Anion Gap']}</p>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
