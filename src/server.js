
//Importa a biblioteca express
import express from "express"

//Importa as rotas
import autorRoutes from "./routes/autor.js"
import categoriaRoutes from "./routes/categoria.js"
import livroRoutes from "./routes/livro.js"

//Instância da aplicação do express
const app = express()

// Configura o express para receber requisições JSON
app.use(express.json())

//Configura as rotas dentro da aplicação
app.use("/autor", autorRoutes)
app.use("/livro", livroRoutes)
app.use("/categoria", categoriaRoutes)

// Página inicial quando é feita uma requisição GET na raiz
app.get("/", (req, res) => {
    res.json({ title: "API de uma biblioteca" })
})

// Porta que o servidor vai escutar
app.listen(8000, () => {
    console.log("Server is running at port 8000")
})
