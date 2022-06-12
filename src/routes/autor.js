// Importa a classe Router do express
import { Router } from "express"

//Importa a classe de cliente do Prisma
import { PrismaClient } from "@prisma/client"

const autorRoutes = Router() // Instancia o objeto Router do express

const prisma = new PrismaClient() // Instancia o objeto de cliente do Prisma

// GET /autor - Lista todas os autores
// Retorna um array de registros de autores, caso não existam, retorna um array vazio
autorRoutes.get("/", async (req, res) => {
    const autores = await prisma.autor.findMany()
    res.json(autores)
})

// GET /autor/:id - Busca um autor pelo ID
// Retorna um registro pelo ID caso nao encontrado retorna um objeto vazio
autorRoutes.get("/:id", async (req, res) => {
    try {
        const autor =
            (await prisma.autor.findUnique({
                where: { id: Number(req.params.id) },
            })) || {} // Retorna um registro pelo ID caso nao encontrado retorna um objeto vazio
        res.json(autor)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// POST /autor - Cria um novo autor
// Cria um autor com os dados passado no corpo da requisição e retorna o registro criado
autorRoutes.post("/", async (req, res) => {
    try {
        const { nome, dataNasc } = req.body
        const autor = await prisma.autor.create({
            data: {
                nome,
                dataNasc: new Date(dataNasc),
            },
        })
        res.json(autor)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// PUT /autor/:id - Atualiza um autor
// Atualiza uma autor com o ID passado na URL e com dados passados no corpo da requisição e retorna o registro atualizado
autorRoutes.put("/update/:id", async (req, res) => {
    try {
        const { nome, dataNasc } = req.body
        const autor = await prisma.autor.update({
            where: { id: Number(req.params.id) },
            data: {
                nome,
                dataNasc: new Date(dataNasc),
            },
        })
        res.json(autor)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// DELETE /autor/:id - Deleta um autor
// Deleta um autor com o ID passado na URL e retorna o registro deletado
autorRoutes.delete("/delete/:id", async (req, res) => {
    try {
        const autor = await prisma.autor.delete({
            where: { id: Number(req.params.id) },
        })
        res.json(autor)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// Exporta as rotas 
export default autorRoutes
