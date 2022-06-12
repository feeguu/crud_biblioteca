// Importa a classe Router do express
import { Router } from "express"

//Importa a classe de cliente do Prisma
import { PrismaClient } from "@prisma/client"

const livroRoutes = Router() // Instancia o objeto Router do express

const prisma = new PrismaClient() // Instancia o objeto de cliente do Prisma

// GET /livro - Lista todas os livros
// Retorna um array de registros de livros com os dados dos autores e da categoria, caso não existam, retorna um array vazio
livroRoutes.get("/", async (req, res) => {
    try {
        const livros = await prisma.livro.findMany({
            include: {autores: true, categoria: true}, // Essa linha é responsável pela inclusão dos dados dos autores
        })
        res.json(livros)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// GET /livro/:id - Busca um livro pelo ID
// Retorna um registro com os dados dos autores pelo ID caso nao encontrado retorna um objeto vazio

livroRoutes.get("/:id", async (req, res) => {
    try {
        const livro =
            (await prisma.livro.findUnique({
                where: { id: Number(req.params.id) },
                include: {autores: true}, // Essa linha é responsável pela inclusão dos dados dos autores
            })) || {}
        res.json(livro)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// POST /livro - Cria um novo livro
// Cria um livro com os dados passado no corpo da requisição
// Usa o prisma para fazer o relacionamento entre as informações de autores e categorias com o livro
// Também retorna o registro criado
livroRoutes.post("/", async (req, res) => {
    try {
        const { nome, ISBN, dataLancamento, categoriaId, autoresId } = req.body

        const livro = await prisma.livro.create({
            data: {
                nome,
                ISBN,
                dataLancamento: new Date(dataLancamento),
                // Trecho responsável por fazer o relacionamento entre o livro e a categoria utilizando o ID passado na requisição
                categoria: {
                    connect: { id: categoriaId }, 
                },
                // Trecho responsável por fazer o relacionamento entre o livro e os autores, utilizando o array de IDs passados na requisição
                autores: {
                    connect: autoresId.map((id) => ({ id: Number(id) })),
                },
            },
        })
        res.json(livro)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// PUT /livro/:id - Atualiza um livro
// Atualiza um livro com os dados passado no corpo da requisição
// Assim como na criação, utiliza o Prisma para fazer os relacionamentos
// Retorna o registro atualizado
livroRoutes.put("/update/:id", async (req, res) => {
    try {
        const { nome, ISBN, dataLancamento, categoriaId, autoresId } = req.body
        const livro = await prisma.livro.update({
            where: { id: Number(req.params.id) },
            data: {
                nome,
                ISBN,
                dataLancamento: new Date(dataLancamento),
                categoria: {
                    connect: { id: categoriaId },
                },
                autores: {
                    connect: autoresId.map((id) => ({ id: Number(id) })),
                },
            },
        })
        res.json(livro)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// DELETE /livro/:id - Deleta um livro
// Deleta um livro pelo ID
// Retorna o registro deletado
livroRoutes.delete("/delete/:id", async (req, res) => {
    try {
        const livro = await prisma.livro.delete({
            where: { id: Number(req.params.id) },
        })
        res.json(livro)
    } catch (error) {
        res.json({ error: error.message })
    }
})

// Exporta o objeto livroRoutes
export default livroRoutes
