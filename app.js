'use strict'

import { preview, uploadImagem } from "./preview.js"
import { getContatos, criarContato, atualizarContato, deletarContato } from "./contatos.js"


function criarEstruturaContato(contato) {
    const listaContatos = document.getElementById('lista-contatos')

    // 1. Cria a coluna principal primeiro para não dar erro de leitura
    const coluna = document.createElement('div')
    coluna.classList.add('col-12', 'col-sm-6', 'col-lg-3', 'mb-4')
    coluna.id = `card-${contato.id}`

    // 2. Cria o card interno
    const card = document.createElement('div')
    card.classList.add('card')

    // 3. Cria as informações de texto e ID
    const idInterface = document.createElement('span')
    idInterface.textContent = `Id: ${contato.id}`
    idInterface.classList.add('id-pequeno')

    const imagem = document.createElement('img')
    if (contato.foto === ""){
        imagem.src = "./img/sem-foto.png"
    }else{
        imagem.src = contato.foto
    }
    imagem.alt = contato.nome

    const nome = document.createElement('h3')
    nome.textContent = contato.nome
    nome.classList.add('titulo-card', 'mt-2')

    const celular = document.createElement('p')
    celular.textContent = `Celular: ${contato.celular}`

    const endereco = document.createElement('p')
    endereco.textContent = `Endereço: ${contato.endereco}`

    const cidade = document.createElement('p')
    cidade.textContent = `Cidade: ${contato.cidade}`

    // 4. Criação do botão EDITAR
    const btnEditar = document.createElement('button')
    btnEditar.textContent = 'Editar'
    btnEditar.classList.add('btn', 'btn-warning', 'mt-2')
    btnEditar.onclick = () => editarContato(contato.id)

    // 5. Criação do botão EXCLUIR
    const btnExcluir = document.createElement('button')
    btnExcluir.textContent = 'Excluir'
    btnExcluir.classList.add('btn', 'btn-danger', 'mt-2')
    btnExcluir.onclick = () => excluirContato(contato.id, coluna)

    // 6. Montagem dos containers na ordem certa
    const infoContainer = document.createElement('div')
    infoContainer.classList.add('info-container')
    infoContainer.append(nome, celular, endereco, cidade)

    const btnGroup = document.createElement('div')
    btnGroup.classList.add('btn-group-custom')
    btnGroup.append(btnEditar, btnExcluir)

    // 7. Junta tudo dentro do card e coloca na tela
    card.append(imagem, idInterface, infoContainer, btnGroup)
    coluna.appendChild(card)
    listaContatos.appendChild(coluna)
}


async function carregarContatos() {

    const listaContatosEstrutura = document.getElementById('lista-contatos')
    
    if (!listaContatosEstrutura) return


    try{
       const contatosInformacao = await getContatos()
        listaContatosEstrutura.replaceChildren()
        
        contatosInformacao.forEach(contato => {criarEstruturaContato(contato)})

    }catch(erro){

        console.error("Erro ao acessar API: " + erro.message)
        alert("Erro ao acessar API" + erro.message)
    }

}





async function buscarContato(){
    const listaContatosEstrutura = document.getElementById('lista-contatos')
    if (!listaContatosEstrutura) return
    
    const buscaContato = document.getElementById('input-contato').value.toLowerCase()
    const btnPesquisar = document.getElementById('botao-pesquisar')

   

    try {
        const todosContatos = await getContatos()


        const contatoDesejado = todosContatos.filter(contato => 
            contato.nome.toLowerCase().includes(buscaContato)
        )

        listaContatosEstrutura.replaceChildren()

        if (contatoDesejado == ""){

            const semContatoTexto = document.createElement('p')
            semContatoTexto.textContent = `Nenhum Contato Encontrado com o nome: ${buscaContato}`
            semContatoTexto.classList.add('text-center', 'text-muted', 'fw-bold', 'mt-3')
            listaContatosEstrutura.appendChild(semContatoTexto)

        }else{
            contatoDesejado.forEach(contato => {
                criarEstruturaContato(contato)
            })
        }
    }catch(erro){
        console.error("Erro ao buscar contato: " + erro.message)
        alert("Erro ao buscar contato: " + erro.message)
    }
}

async function cadastrarContato(evento) {

    // Impede que o form resete
    evento.preventDefault()
    const id = document.getElementById('id').value

    // Envia a imagem pro cloudinary e pega a url
    let urlFoto = await uploadImagem()


    if (urlFoto === "" && id) {
        // Buscamos a URL da foto antiga que já está sendo exibida no preview da tela
        const fotoAtual = document.getElementById('preview-image').src
        
        // Se a foto atual não for o ícone padrão de upload, mantemos ela!
        if (!fotoAtual.includes('upload-icon.svg')) {
            urlFoto = fotoAtual
        }
    }
    
    // Guarda as informações
    const contatos = {

        id: id,
        nome:  document.getElementById('nome').value, 
        celular: document.getElementById('celular').value,
        email: document.getElementById('email').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        foto: urlFoto

    }

    // Envia as informações para o render
    try{
        if(id){
            await atualizarContato(id,contatos)
            alert("Contato Atualizado com sucesso!!")
        }else{
            await criarContato(contatos)
            alert("Contato cadastrado com sucesso!")
        }

        limparFormulario()

        // Atualiza o título do form
        document.getElementById('titulo-form').textContent = "Cadastrar Contato"
        
        // Faz o preview da foto voltar a ser o ícone de upload azul tradicional
        document.getElementById('preview-image').src = "./img/upload-icon.svg"

        carregarContatos()
    }catch(erro){
        console.error("Erro ao cadastrar contato: " + erro.message)
        alert("Erro ao cadastrar contato: " + erro.message)
    }


}

async function editarContato(id) {

    try{
        // Carrega todos os contatos 
        const todosContatos = await getContatos()

        // Busca o contato pelo ID
        //  o c => é um apelido temporário para contatos
        const contato = todosContatos.find(c => c.id == id )

        if (!contato) return

        // 3. Joga os dados do contato de volta para os inputs do formulário
        document.getElementById('id').value = contato.id
        document.getElementById('nome').value = contato.nome
        document.getElementById('celular').value = contato.celular
        document.getElementById('email').value = contato.email
        document.getElementById('endereco').value = contato.endereco
        document.getElementById('cidade').value = contato.cidade

        // Se tiver foto, vai mostrar ela no preview
        if(contato.foto){
            document.getElementById('preview-image').src = contato.foto
        } 

        // Muda o título do form para editar contato
        const tituloForm = document.getElementById('titulo-form')
        tituloForm.textContent = "Editar Contato"

    }catch(erro){
        console.error("Erro ao carregar dados para edição: " + erro.message)
        alert("Não foi possível carregar os dados do contato." + erro.message)
    }
}

// Função Excluir Contato
async function excluirContato(id, card) {
    // Pergunta se o usuário deseja mesmo excluir o contato
    const confirmarExclusao =  confirm("Você realmente deseja excluir esse contato?") 

    if(confirmarExclusao){
        try{
            await deletarContato(id)
            card.remove()
            alert('Contato excluído com sucesso!!')
            limparFormulario()
            const listaContatosEstrutura = document.getElementById('lista-contatos')
            if (listaContatosEstrutura.children.length === 0){
                carregarContatos()
            }

        }catch (erro) {
            console.error("Erro ao excluir contato: " + erro.message)
            alert("Não foi possível excluir o contato." + erro.message)
        }
    }

}

// Função para limpar os campos do form
function limparFormulario() {
    // 1. Apaga o ID escondido (isso faz o sistema entender que o próximo será um cadastro NOVO)
    document.getElementById('id').value = ""

    // 2. Reseta os textos dos campos normais (Nome, celular, etc)
    document.getElementById('form-cadastro').reset()

    // 3. Volta o título do formulário para o padrão de cadastro
    document.getElementById('titulo-form').textContent = "Cadastrar Contato"

    // 4. Faz a imagem voltar para o ícone azul de upload
    document.getElementById('preview-image').src = "./img/upload-icon.svg"
}



// Pesquisar contatos 
const btnPesquisar = document.getElementById('botao-pesquisar').addEventListener('click', buscarContato)

// Carrega todos os contatos
document.addEventListener('DOMContentLoaded', carregarContatos)

// Cadastrar no form
document.getElementById('form-cadastro').addEventListener('submit', cadastrarContato)

// Botão de limpar os campos
// Ativa a limpeza completa ao clicar no botão "Limpar Campos"
document.querySelector('button[type="reset"]').addEventListener('click', limparFormulario)