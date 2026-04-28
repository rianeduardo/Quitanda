export class QuitandaModel {
    constructor() {
      this.produtos = [];
      this.currentId = 1;
    }

    // CRUD

    createProduto(nome, descricao, preco, quantidade, categoria) {
      const produto = {
        id: this.currentId,
        nome: nome,
        descricao: descricao,
        preco: preco,
        estoque: quantidade,
        categoria: categoria
      };
      this.produtos.push(produto);
      this.currentId++;
    }

    readProdutos() {
      return this.produtos;
    }

    updateProduto(id, nome, descricao, preco, quantidade, categoria) {
      const produto = this.produtos.find(p => p.id === id);
      if (produto) {
        produto.nome = nome;
        produto.descricao = descricao;
        produto.preco = preco;
        produto.estoque = quantidade;
        produto.categoria = categoria;
      }
    }

    deleteProduto(id) {
      this.produtos = this.produtos.filter(p => p.id !== id);
    }

    // MOVIMENTAÇÕES -> ENTRADA & SAÍDA

    // CRIAR UM VETOR DE MOVIMENTAÇÕES PARA REGISTRAR AS ENTRADAS E SAÍDAS DE PRODUTOS E EXIBI-LAS NA VIEW DEPOIS

    movimentacoes = [];

    entradaProduto(id, quantidade, fornecedor = '', observacoes = '') {
      const produto = this.produtos.find(p => p.id === id);
      if (produto) {
        produto.estoque += quantidade;
        this.movimentacoes.push({
          idProduto: id,
          tipo: 'entrada',
          nomeProduto: produto.nome,
          quantidade: quantidade,
          data: new Date().toISOString(),
          timestamp: new Date(),
          fornecedor: fornecedor,
          observacoes: observacoes,
          precoUnitario: produto.preco
        });
      }
    }

    saidaProduto(id, quantidade, cliente = '', tipoVenda = '') {
      const produto = this.produtos.find(p => p.id === id);
      if (produto) {
        produto.estoque -= quantidade;
        this.movimentacoes.push({
          idProduto: id,
          tipo: 'saida',
          nomeProduto: produto.nome,
          quantidade: quantidade,
          data: new Date().toISOString(),
          timestamp: new Date(),
          cliente: cliente,
          tipoVenda: tipoVenda,
          precoUnitario: produto.preco
        });
      }
    }

    // CONSULTAS (MOVIMENTAÇÕES & ESTOQUE DE PRODUTOS TOTAL & ESPECÍFICOS)

    consultarMovimentacoes() {
      return this.movimentacoes;
    }

    consultarEstoqueTotal() {
      return this.produtos.reduce((total, produto) => total + produto.estoque, 0);
    }

    consultarEstoqueProduto(id) {
      const produto = this.produtos.find(p => p.id === id);
      return produto ? produto.estoque : null;
    }
  }