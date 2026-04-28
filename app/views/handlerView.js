import { QuitandaController } from '../controllers/QuitandaController.js';

const controller = new QuitandaController();

function exibirAlerta(mensagem) {
  alert(mensagem);
}

function buscarProdutoPorId(id) {
  const produtos = controller.listarProdutos();
  return produtos.find(produto => produto.id === id);
}

function validarNumero(valor, nomeCampo) {
  if (valor === '' || Number.isNaN(valor)) {
    exibirAlerta(`Por favor informe um valor válido para ${nomeCampo}.`);
    return false;
  }
  return true;
}

// Form produto
document.getElementById('formProduto').addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const preco = parseFloat(document.getElementById('preco').value);
  const quantidade = parseInt(document.getElementById('quantidade').value, 10);
  const categoria = document.getElementById('categoria').value.trim();

  if (!nome || !descricao || !categoria) {
    exibirAlerta('Nome, descrição e categoria são obrigatórios.');
    return;
  }

  if (!validarNumero(preco, 'preço') || preco < 0) {
    exibirAlerta('O preço deve ser um valor igual ou maior que 0.');
    return;
  }

  if (!validarNumero(quantidade, 'quantidade') || quantidade < 0) {
    exibirAlerta('A quantidade deve ser um número inteiro igual ou maior que 0.');
    return;
  }

  controller.adicionarProduto(nome, descricao, preco, quantidade, categoria);
  atualizarProdutos();
  e.target.reset();
});

// Form entrada
document.getElementById('formEntrada').addEventListener('submit', (e) => {
  e.preventDefault();

  const id = parseInt(document.getElementById('idEntrada').value, 10);
  const quantidade = parseInt(document.getElementById('quantidadeEntrada').value, 10);
  const fornecedor = document.getElementById('fornecedor').value.trim();
  const observacoes = document.getElementById('observacoes').value.trim();

  if (!validarNumero(id, 'ID do produto') || id <= 0) {
    exibirAlerta('Informe um ID de produto válido.');
    return;
  }

  if (!validarNumero(quantidade, 'quantidade') || quantidade <= 0) {
    exibirAlerta('A quantidade de entrada deve ser um número inteiro maior que 0.');
    return;
  }

  const produto = buscarProdutoPorId(id);
  if (!produto) {
    exibirAlerta('Produto não encontrado. Verifique o ID informado.');
    return;
  }

  controller.registrarEntrada(id, quantidade, fornecedor, observacoes);
  atualizarProdutos();
  atualizarMovimentacoes();
  e.target.reset();
});

// Form saída
document.getElementById('formSaida').addEventListener('submit', (e) => {
  e.preventDefault();

  const id = parseInt(document.getElementById('idSaida').value, 10);
  const quantidade = parseInt(document.getElementById('quantidadeSaida').value, 10);
  const cliente = document.getElementById('cliente').value.trim();
  const tipoVenda = document.getElementById('tipoVenda').value.trim();

  if (!validarNumero(id, 'ID do produto') || id <= 0) {
    exibirAlerta('Informe um ID de produto válido.');
    return;
  }

  if (!validarNumero(quantidade, 'quantidade') || quantidade <= 0) {
    exibirAlerta('A quantidade de saída deve ser um número inteiro maior que 0.');
    return;
  }

  const produto = buscarProdutoPorId(id);
  if (!produto) {
    exibirAlerta('Produto não encontrado. Verifique o ID informado.');
    return;
  }

  if (quantidade > produto.estoque) {
    exibirAlerta(`Não é possível retirar ${quantidade} unidades. O estoque atual de ${produto.nome} é ${produto.estoque}.`);
    return;
  }

  controller.registrarSaida(id, quantidade, cliente, tipoVenda);
  atualizarProdutos();
  atualizarMovimentacoes();
  e.target.reset();
});

function atualizarProdutos() {
  const produtos = controller.listarProdutos();
  const lista = document.getElementById('listaProdutos');
  lista.innerHTML = '';
  produtos.forEach(produto => {
    const li = document.createElement('li');
    li.textContent = `ID: ${produto.id}, Nome: ${produto.nome}, Descrição: ${produto.descricao}, Preço: ${produto.preco}, Estoque: ${produto.estoque}, Categoria: ${produto.categoria}`;
    lista.appendChild(li);
  });
}

function formatarTipoVenda(tipoVenda) {
  if (!tipoVenda) return 'Não especificado';
  return tipoVenda.charAt(0).toUpperCase() + tipoVenda.slice(1).toLowerCase();
}

function formatarValorNaoVazio(valor, textoPadrao) {
  if (!valor || !valor.toString().trim()) {
    return textoPadrao;
  }
  return valor;
}

function formatarData(dataISO) {
  const data = new Date(dataISO);
  if (Number.isNaN(data.getTime())) return dataISO;

  const pad = (valor) => String(valor).padStart(2, '0');
  const ano = data.getFullYear();
  const mes = pad(data.getMonth() + 1);
  const dia = pad(data.getDate());
  const hora = pad(data.getHours());
  const minuto = pad(data.getMinutes());

  return `${ano}-${mes}-${dia} ${hora}:${minuto}`;
}

function atualizarMovimentacoes() {
  const movimentacoes = controller.listarMovimentacoes();
  const lista = document.getElementById('listaMovimentacoes');
  lista.innerHTML = '';
  movimentacoes.forEach(mov => {
    const tipo = mov.tipo.charAt(0).toUpperCase() + mov.tipo.slice(1).toLowerCase();
    const dataFormatada = formatarData(mov.data);

    const fornecedor = formatarValorNaoVazio(mov.fornecedor, 'Não especificado');
    const observacoes = formatarValorNaoVazio(mov.observacoes, 'Não especificado');
    const cliente = formatarValorNaoVazio(mov.cliente, 'Não especificado');
    const tipoVenda = formatarTipoVenda(mov.tipoVenda);

    let descricao = `${tipo}: ${mov.nomeProduto}, Quantidade: ${mov.quantidade}`;

    if (mov.tipo === 'entrada') {
      descricao += `, Fornecedor: ${fornecedor}, Observações: ${observacoes}`;
    } else {
      descricao += `, Cliente: ${cliente}, Tipo Venda: ${tipoVenda}`;
    }

    descricao += `, Data: ${dataFormatada}`;

    const li = document.createElement('li');
    li.textContent = descricao;
    lista.appendChild(li);
  });
}

// Inicializar listas
atualizarProdutos();
atualizarMovimentacoes();