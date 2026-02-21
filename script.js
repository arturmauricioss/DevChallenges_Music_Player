const html = document.documentElement

// let capa = document.querySelector("#capa")
// let musica = document.querySelector("h1")
// let artista = document.querySelector("p")
let tempo_atual = document.querySelector("#tempo_atual")
let tempo_total = document.querySelector("#tempo_total")
let barra_progresso_atual = document.querySelector("#barra_progresso_atual")
let icone = document.querySelector("#image_play")
let audio = document.querySelector("audio")


function tocando(){
    html.classList.toggle('tocando')
    if(html.classList.contains('tocando')){
        icone.setAttribute('src', './assets/pause.svg')
        audio.play()
    }
    else{
        icone.setAttribute('src', './assets/play.svg')
        audio.pause()
    }
}
function formatar_tempo(tempo){

    let minutos = Math.floor(tempo/60)
    let segundos = Math.floor(tempo%60)

    if (segundos <10){
        segundos = "0" + segundos
    }
    return minutos + ":" + segundos
}
tempo_total.innerHTML = formatar_tempo(audio.duration)   

audio.addEventListener('loadedmetadata', () => {
    tempo_total.innerHTML = formatar_tempo(audio.duration)    
})
function tocar_proxima(){
    if(audio.src.includes("./assets/lost-in-city-lights.mp3")){
        audio.src="./assets/forest-lullaby.mp3";
        audio.play();
    }
}

audio.addEventListener('timeupdate', () => {
    tempo_atual.innerHTML = formatar_tempo(audio.currentTime);
    progresso_do_audio = audio.currentTime/audio.duration;
    barra_progresso_atual.style.width = (progresso_do_audio*100)+ "%";

});

audio.addEventListener('ended', () => {
    tocar_proxima();
});