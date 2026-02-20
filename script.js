const html = document.documentElement

const capa = document.querySelector("#capa")
const musica = document.querySelector("h1")
const artista = document.querySelector("p")
const tempo_atual = document.querySelector("#tempo_atual")
const tempo_total = document.querySelector("tempo_total")
const barra_progresso_atual = document.querySelector("#barra_progresso_atual")
const icone = document.querySelector("#image_play")

function tocando(){
    html.classList.toggle('tocando')
    if(html.classList.contains('tocando')){
        icone.setAttribute('src', './assets/pause.svg')
    }
    else{
        icone.setAttribute('src', './assets/play.svg')
    }
}