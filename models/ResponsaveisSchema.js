const mongoose = require('mongoose');
const { VagasSchema } = require('./VagasSchema')
const Schema = mongoose.Schema;
//Dados necessários para cadastro de responsável
const ResponsaveisSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  nome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  grupo: {type: String},
  vagas: [VagasSchema]
})

const responsaveisModel = mongoose.model('responsaveis', ResponsaveisSchema);

module.exports = responsaveisModel;