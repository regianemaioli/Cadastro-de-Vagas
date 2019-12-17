const express = require('express');
const router = express.Router();
const controller = require("../controllers/ResponsaveisController")
const jwt = require('jsonwebtoken')
const SEGREDO = 'MIICXgIBAAKBgQCeoMKM7li4ttKv1EQjPQtp/zFvvDTH4CGl9esYHPXFyrSgRma6OKab2J3YTU7zsH/gzbVk2Te2Z/hAD0XWmJowQc2QeeG2e40v7hbTZNlY5kxkwf9fkcFs8cXrrTG7EZWK0D+XnuMtvO5pJGwo2OznOxumczX6ITiMltw9oglvrQIDAQABAoGAKFJvAcn4bYOzjJRleZuj0h7XXzK1K/WSOBCJ4QhDhTKgtXkP1dheqZDnlrsYDaPY7bj8mhUJL2nAVfBL7V+/GYy2oBsaIubJcEHyVHNKn5c/nTrUYO+qbL8KAbflj0wNtBvXki5OHVYEW+aitJnlX5oyRWmbHIxDNDdoMZfiXqECQQDOMEszsPoxELE9STS+W75Lax6Frk9I+Ib1a1oWwwF3OZhEH3yL4iPS1TJfUhvg5iy9vB4P9wtaJqp488T8KkGZAkEAxPMVRYqOVEkHpsJtKKn4cDPVkqO2GCR249zLAB95W/QYJGcSDkBHnHf/0T9vYrxQP5l4/eRXa+58TPSsN/eTNQJBAL/KulkF2WQEc+lfDBm5uwPqS0TsBEILM3Zb+jvL/rQJNfLAGxj/LHVz7Nwvw1Dqqll+/7O4B64+4zmI/wXUxJkCQQCT8DQuRGGdFi5VKP5t6R7gyU7IE4kYoWtcxeEGep3iYHwx++ooIkioU8spFolIlUOCQnoL3JV+UWm1NKSYdbNxAkEAtIe+NkA92PTR0QHddx1QJTU/SgJHFcMZXuwKiF+St87QgtNZPGpk4jmz4Ir9bLrD619NG/ZbzH5NDtINORbFBw='


const autenticar = (request, response, next) => {
    const authHeader = request.get('authorization')
    let autenticado = false
  
    if (!authHeader) {
      return response.status(401).send('Você precisa fazer login!')
    }
  
    const token = authHeader.split(' ')[1]
  
    jwt.verify(token, SEGREDO, (error, decoded) => {
      if (error) {
        autenticado = false
      } else {
        if (decoded.grupo == 'comum' || decoded.grupo == 'admin') {
          autenticado = true
        } else {
          autenticado = false
        }
      }
    })
  
    if (!autenticado) {
      return response.status(403).send('Acesso negado.')
    }
  
    next()
  }
  
  const autenticarAdmin = (request, response, next) => {
    const authHeader = request.get('authorization')
    let autenticado = false
  
    if (!authHeader) {
      return response.status(401).send('Você precisa fazer login!')
    }
  
    const token = authHeader.split(' ')[1]
  
    jwt.verify(token, SEGREDO, (error, decoded) => {
      if (error) {
        autenticado = false
      } else {
        if (decoded.grupo == 'admin') {
          autenticado = true
        } else {
          autenticado = false
        }
      }
    })
  
    if (!autenticado) {
      return response.status(403).send('Acesso negado.')
    }
  
    next()
  }
  


  router.get('', autenticarAdmin, controller.getAll)
  router.post('/admin', autenticarAdmin, controller.addAdmin)
  router.post('', autenticarAdmin, controller.add)
  router.get('/:id', autenticar, controller.getById)
  router.patch('/:id', autenticarAdmin, controller.update)
  router.delete('/:id', autenticarAdmin, controller.remove)
  router.post('/login', controller.login)
  //Rotas para vagas
  router.post('/:responsavelId/vagas', autenticar, controller.addVaga)
  router.get('/:responsavelId/vagas', autenticar, controller.getVagas)
  router.get('/:responsavelId/vagas/:vagaId', autenticar, controller.getVagaById)
  router.patch('/:responsavelId/vagas/:vagaId', autenticarAdmin, controller.updateVaga)
  router.delete('/:responsavelId/vagas/:vagaId', autenticarAdmin, controller.removeVaga)




module.exports = router