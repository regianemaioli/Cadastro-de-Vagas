const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Dados necessários para os descritivos de vagas
const VagasSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true, required: true },
  vaga: { type: String, required: true },
  requisitos: { type: String, required: true },
  salario: { type: Number },
  inclusao: {type: Date, required: true, default: Date.now}
})

const vagasModel = mongoose.model('vagas', VagasSchema);

module.exports = { vagasModel, VagasSchema };