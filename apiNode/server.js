const http = require("http");

http.createServer((request, response) =>{
    response.writeHead(200, { "Content-Type": "application/json" });

    if(request.url === '/produtos'){
        response.end(JSON.stringify({
            message: "Rota de Produtos"
        }))
    }
    if(request.url === '/usuarios'){
        response.end(JSON.stringify({
            message: "Rota de Usuarios"
        }))
    }
}).listen(4001, () => console.log('servidor rodando na porta 4001'))