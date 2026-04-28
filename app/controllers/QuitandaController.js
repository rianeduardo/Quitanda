import { QuitandaModel } from '../models/QuitandaModel.js';

export class QuitandaController {
  constructor() {
    this.model = new QuitandaModel();
  }

  // Métodos para produtos
  adicionarProduto(nome, descricao, preco, quantidade, categoria) {
    this.model.createProduto(nome, descricao, parseFloat(preco), parseInt(quantidade), categoria);
  }

  listarProdutos() {
    return this.model.readProdutos();
  }

  // Métodos para movimentações
  registrarEntrada(id, quantidade, fornecedor, observacoes) {
    this.model.entradaProduto(parseInt(id), parseInt(quantidade), fornecedor, observacoes);
  }

  registrarSaida(id, quantidade, cliente, tipoVenda) {
    this.model.saidaProduto(parseInt(id), parseInt(quantidade), cliente, tipoVenda);
  }

  listarMovimentacoes() {
    return this.model.consultarMovimentacoes();
  }
}