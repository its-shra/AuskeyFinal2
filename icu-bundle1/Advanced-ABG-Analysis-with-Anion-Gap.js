document.getElementById("calculateAdvABC").addEventListener('click', function(){
    var na = parseFloat(document.getElementById("na").value);
    var k = parseFloat(document.getElementById("k").value);
    var cl = parseFloat(document.getElementById("cl").value);
    var hco3 = parseFloat(document.getElementById("hco3").value);
    var paco2 = parseFloat(document.getElementById("paco2").value);

    const data={
        na: na,
        k : k,
        cl: cl,
        hco3:hco3,
        paco2: paco2
    }

    fetch('http://navrakshak.in/api/calculate-adv-abg', {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
    .then(data =>{
        document.getElementById('anionGap').innerHTML=`${data['anionGap']}`;
        document.getElementById('interpretation').innerHTML=`${data['interpretation']}`;
        document.getElementById('abnormality').innerHTML=`${data['abnormality']}`;
        document.getElementById('baseExcess').innerHTML=`${data['be']}`; 
    })
    .catch(error => {
        console.error('Error:', error);
    });
})

