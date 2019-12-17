# Projeto Prático Backend CRUD - Controle de Vagas 💻


Projeto final realizado no curso de backend do {reprograma}, onde desenvolvi uma API para area de RH controlar a abertura de vagas de cada gestor/responsavel.

### Tecnologias e ferramentas utilizadas na criação do projeto:
- Javascript
- Node
- Visual Code
- Postman
- Git e Github
- Express
- Nodemon
- MongoDB e Mongoose
- Heroku
- JWT e Bcrypt


### Rotas/retornos

- Consultar todos os Responsáveis cadastrados - Get(’’)
- Adicionar Admin - Post(‘/admin’)
- Adicionar Responsável - Post('')
- Consultar Responsável por ID - Get(‘/:id’)
- Atualizar Responsável - Patch('/:id’)
- Deletar Responsável - Delete('/:id’)
- Logar - Post('/login')
- Adicionar vaga ao Responsável - Post('/:responsavelId/vagas')
- Consultar vagas por Responsável - Get('/:responsavelId/vagas')
- Consultar uma vaga por Id  - Get('/:responsavelId/vagas/:vagaId’)
- Atualizar vaga do Gestor - Patch('/:responsavelId/vagas/:vagaId', autenticarAdmin, controller.updateVaga)
- Deletar vaga - Delete('/:responsavelId/vagas/:vagaId')
