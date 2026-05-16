'use strict'

import { preview, uploadImagem } from "./preview.js"
import { getContatos, criarContato, atualizarContato, deletarContato } from "./contatos.js"


function criarEstruturaContato(contato) {
    const listaContatos = document.getElementById('lista-contatos')

    const card = document.createElement('div')
    card.classList.add('card')

    const idInterface = document.createElement('span')
    idInterface.textContent = `Id: ${contato.id}`
    idInterface.classList.add('id-pequeno')


    const imagem = document.createElement('img')

    // Carrega uma foto padrão se não tiver foto de perfil
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

    // Criação do botão editar
    const btnEditar = document.createElement('button')
    btnEditar.textContent = 'Editar'
    btnEditar.classList.add('btn', 'btn-warning', 'mt-2')

    // Conecta o botão com a funcao de editar
    btnEditar.onclick = () => editarContato(contato.id) 

    // Criacão do Botão excluir
    const btnExcluir = document.createElement('button')
    btnExcluir.textContent = 'Excluir'
    btnExcluir.classList.add('btn', 'btn-danger', 'mt-2')

    btnExcluir.onclick = () => excluirContato(contato.id, coluna)
    

    const infoContainer = document.createElement('div')
    infoContainer.classList.add('info-container')
    infoContainer.append(nome, celular, endereco, cidade)

    const btnGroup = document.createElement('div')
    btnGroup.classList.add('btn-group-custom')
    btnGroup.append(btnEditar, btnExcluir)



    card.append(imagem, idInterface, infoContainer, btnGroup)

    const coluna = document.createElement('div')
    coluna.classList.add('col-12', 'col-sm-6', 'col-lg-3', 'mb-4')
    coluna.id = `card-${contato.id}`

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
    const urlFoto = await uploadImagem()

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
        await criarContato(contatos)

        alert("Contato cadastrado com sucesso!")

        carregarContatos()
    }catch(erro){
        console.error("Erro ao cadastrar contato: " + erro.message)
        alert("Erro ao cadastrar contato: " + erro.message)
    }


}

// Pesquisar contatos 
const btnPesquisar = document.getElementById('botao-pesquisar').addEventListener('click', buscarContato)

// Carrega todos os contatos
document.addEventListener('DOMContentLoaded', carregarContatos)

document.getElementById('form-cadastro').addEventListener('submit', cadastrarContato)

