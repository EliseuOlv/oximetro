const express = require("express");
const { randomUUID } = require("crypto");
const fs = require("fs");

const app = express();

app.use(express.json());

let batimentos = [];

fs.readFile("batimentosOx.json", "utf-8", (err, data) =>{
    if(err){
        console.log(err)
    }else{
        batimentos = JSON.parse(data)
    }
})

// app.get('/primeira-rota', (request, response) => {
//     return response.json({
//         message: "Acessou a primeira rota",
//     });
// })

app.post('/batimentos', (request, response) =>{

    const { O2 } = request.body; 

    const oxBat = {
        O2
    };

    batimentos.push(oxBat);

    fs.writeFile("batimentosOx.json", JSON.stringify(batimentos), (err) =>{
        if(err){
            console.log(err)
        }else{
            console.log('produto inserido')
        }
    })

    return response.json(batimentos);
})

app.get('/batimentos', (request, response) =>{
    return response.json(batimentos)
})

app.delete('/batimentos/:name', (request, response) =>{
    const { name } = request.params

    const batIndex = batimentos.findIndex((dado) => dado.name === name);

    batimentos.splice(batIndex, 1);

    return response.json({message: "Batimentos Removidos com sucesso"})
})

app.listen(4002, () => console.log('servidor porta 4002'));