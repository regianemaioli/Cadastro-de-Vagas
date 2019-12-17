const { connect } = require('../models/Repository')
const responsaveisModel = require('../models/ResponsaveisSchema')
const { vagasModel } = require('../models/VagasSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SEGREDO = 'MIICXgIBAAKBgQCeoMKM7li4ttKv1EQjPQtp/zFvvDTH4CGl9esYHPXFyrSgRma6OKab2J3YTU7zsH/gzbVk2Te2Z/hAD0XWmJowQc2QeeG2e40v7hbTZNlY5kxkwf9fkcFs8cXrrTG7EZWK0D+XnuMtvO5pJGwo2OznOxumczX6ITiMltw9oglvrQIDAQABAoGAKFJvAcn4bYOzjJRleZuj0h7XXzK1K/WSOBCJ4QhDhTKgtXkP1dheqZDnlrsYDaPY7bj8mhUJL2nAVfBL7V+/GYy2oBsaIubJcEHyVHNKn5c/nTrUYO+qbL8KAbflj0wNtBvXki5OHVYEW+aitJnlX5oyRWmbHIxDNDdoMZfiXqECQQDOMEszsPoxELE9STS+W75Lax6Frk9I+Ib1a1oWwwF3OZhEH3yL4iPS1TJfUhvg5iy9vB4P9wtaJqp488T8KkGZAkEAxPMVRYqOVEkHpsJtKKn4cDPVkqO2GCR249zLAB95W/QYJGcSDkBHnHf/0T9vYrxQP5l4/eRXa+58TPSsN/eTNQJBAL/KulkF2WQEc+lfDBm5uwPqS0TsBEILM3Zb+jvL/rQJNfLAGxj/LHVz7Nwvw1Dqqll+/7O4B64+4zmI/wXUxJkCQQCT8DQuRGGdFi5VKP5t6R7gyU7IE4kYoWtcxeEGep3iYHwx++ooIkioU8spFolIlUOCQnoL3JV+UWm1NKSYdbNxAkEAtIe+NkA92PTR0QHddx1QJTU/SgJHFcMZXuwKiF+St87QgtNZPGpk4jmz4Ir9bLrD619NG/ZbzH5NDtINORbFBw='

connect()

//Consultar todos os responsaveis
const getAll = (request, response) => {
  responsaveisModel.find((error, responsaveis) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(200).send(responsaveis)
  })
}

//Consultar responsavel por id
const getById = (request, response) => {
  const id = request.params.id

  return responsaveisModel.findById(id, (error, responsavel) => {
    if (error) {
      return response.status(500).send(error)
    }

    if (responsavel) {
      return response.status(200).send(responsavel)
    }

    return response.status(404).send('Responsavel não encontrado')
  })
}

//Incluir responsavel
const add = (request, response) => {
  if (!request.body.senha) {
    return response.status(400).send('Coloque a senha')
  }
  const senhaCriptografada = bcrypt.hashSync(request.body.senha)
  request.body.senha = senhaCriptografada
  request.body.grupo = 'comum'
  const novoResponsavel = new responsaveisModel(request.body)

  novoResponsavel.save((error) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(201).send(novoResponsavel)
  })
}

const addAdmin = (request, response) => {
  const senhaCriptografada = bcrypt.hashSync(request.body.senha)
  request.body.senha = senhaCriptografada
  request.body.grupo = 'admin'
  const novoResponsavel = new responsaveisModel(request.body)

  novoResponsavel.save((error) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(201).send(novoResponsavel)
  })
}

//Logar responsavel
const login = async (request, response) => {
  const responsavelEncontrado = await responsaveisModel.findOne({ email: request.body.email })

  if (responsavelEncontrado){
    const senhaCorreta = bcrypt.compareSync(request.body.senha, responsavelEncontrado.senha)
  
  if (senhaCorreta) {
    const token = jwt.sign(
      {
        grupo: responsavelEncontrado.grupo
      },
      SEGREDO,
      { expiresIn: 200000}
    )
    return response.status(200).send({ token })
  }

  return response.status(401).send('Senha incorreta')
}

return response.status(404).send('Treinador nao encontrado')
}

//Remover responsavel
const remove = (request, response) => {
  const id = request.params.id

  responsaveisModel.findByIdAndDelete(id, (error, responsavel) => {
    if (error) {
      return response.status(500).send(error)
    }

    if (responsavel) {
      return response.status(200).send('Responsavel removido com sucesso')
    }

    return response.status(404).send('Responsavel não encontrado.')
  })
}

//Atualizar responsavel
const update = (request, response) => {
  const id = request.params.id
  const responsavelUpdate = request.body
  const options = { new: true }

  responsaveisModel.findByIdAndUpdate(
    id,
    responsavelUpdate,
    options,
    (error, responsavel) => {
      if (error) {
        return response.status(500).send(error)
      }

      if (responsavel) {
        return response.status(200).send(responsavel)
      }

      return response.status(404).send('Responsavel não encontrado.')
    }
  )
}

//Adicionar vaga ao responsavel
const addVaga = async (request, response) => {
  const responsavelId = request.params.responsavelId
  const vaga = request.body
  const novaVaga = new vagasModel(vaga)
  const responsavel = await responsaveisModel.findById(responsavelId)

  responsavel.vagas.push(novaVaga)
  responsavel.save((error) => {
    if (error) {
      return response.status(500).send(error)
    }

    return response.status(201).send(responsavel)
  })
}

//Deletar vaga por id dentro de um responsavel
const removeVaga = async (request, response)=>{
  const responsavelId = request.params.responsavelId
  const vagaId = request.params.vagaId
  const responsavel = await responsaveisModel.findOneAndUpdate({ _id: responsavelId },
    {$pull: { vagas: { _id: vagaId } }},

    (error, responsavel) => {
      if (error) {
        return response.status(500).send(error)
      }

      if (responsavel) {
        return response.status(200).send(responsavel)
      }

      return response.status(404).send('Responsavel não encontrado.')
    }) 

    }

//Consultar todas as vagas por responsavel
const getVagas = async (request, response) => {
  const responsavelId = request.params.responsavelId
  await responsaveisModel.findById(responsavelId, (error, responsavel) => {
    if (error) {
      return response.status(500).send(error)
    }

    if (responsavel) {
      return response.status(200).send(responsavel.vagas)
    }

    return response.status(404).send('Responsavel não encontrado.')
  })
}
//Consultar uma vaga por id, atribuida ao responsavel
const getVagaById = async (request, response) => {
  const responsavelId = request.body.responsavelId
  const vagaId = request.body.vagaId
  const responsavel = await reponsaveisModel.findById(responsavelId)
  const vaga = responsavel.vagas.find((vaga) => {
    return vagaId == vaga._id
  })

  if (vaga) {
    return response.status(200).send(vaga)
  }

  return response.status(404).send('Vaga não encontrada')
}

//Atualizar vaga cadastrada para o responsavel
const updateVaga = (request, response) => {
  const responsavelId = request.params.responsavelId
  const vagaId = request.params.vagaId
  const options = { new: true }

  responsaveisModel.findOneAndUpdate(
    { _id: responsavelId, 'vagas._id': vagaId },
    { $set:
        {
          'vagas.$.requisitos': request.body.requisitos,
          'vagas.$.salario': request.body.salario
        }
    },
    options,
    (error, responsavel) => {
      if (error) {
        return response.status(500).send(error)
      }
      if (responsavel){
        return response.status(200).send(responsavel)
      }

      return response.status(404).send('Responsavel nao encontrado')
    }
  )
}

module.exports = {
  getAll,
  getById,
  add,
  addAdmin,
  remove,
  update,
  addVaga,
  getVagas,
  getVagaById,
  updateVaga,
  login,
  removeVaga
}
