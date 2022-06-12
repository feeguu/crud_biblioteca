// Importa a classe Router do express
import { Router } from "express"

//Importa a classe de cliente do Prisma
import { PrismaClient } from "@prisma/client"

const categoriaRoutes = Router() // Instancia o objeto Router do express

const prisma = new PrismaClient() // Instancia o objeto de cliente do Prisma

// GET /categoria - Lista todas as categorias
// Retorna um array de registros de categorias, caso não existam, retorna um array vazio
categoriaRoutes.get("/", async (req, res) => {
    try {
        const categorias = await prisma.categoria.findMany({
            include: {
                livros: {
                    include: {
                        autores: true,
                    },
                },
            },
        })
        res.json(categorias)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// GET /categoria/:id - Busca uma categoria pelo ID
// Retorna um registro pelo ID caso nao encontrado retorna um objeto vazio
categoriaRoutes.get("/:id", async (req, res) => {
    try {
        const categoria =
            (await prisma.categoria.findUnique({
                where: { id: Number(req.params.id) },
                include: {
                    livros: {
                        include: {
                            autores: true,
                        },
                    },
                },
            })) || {}
        res.json(categoria)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// POST /categoria - Cria uma nova categoria
// Cria uma categoria com o nome passado no corpo da requisição e retorna o registro criado
categoriaRoutes.post("/", async (req, res) => {
    try {
        const categoria = await prisma.categoria.create({
            data: {
                nome: req.body.nome,
            },
        })
        res.json(categoria)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// PUT /categoria/:id - Atualiza uma categoria
// Atualiza uma categoria com o ID passado na URL com dados passados no corpo da requisição e retorna o registro atualizado
categoriaRoutes.put("/update/:id", async (req, res) => {
    try {
        const categoria = await prisma.categoria.update({
            where: { id: Number(req.params.id) },
            data: {
                nome: req.body.nome,
            },
        })
        res.json(categoria)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// DELETE /categoria/:id - Deleta uma categoria
// Deleta a categoria com o ID passado na URL e retorna o registro deletado
categoriaRoutes.delete("/delete/:id", async (req, res) => {
    try {
        const categoria = await prisma.categoria.delete({
            where: { id: Number(req.params.id) },
        })
        res.json(categoria)
    } catch (error) {
        res.json({ error: error.message })
    }
})

//Exporta as rotas
export default categoriaRoutes
