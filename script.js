const html = document.documentElement

let capa = document.querySelector("#capa")
let musica = document.querySelector("h1")
let artista = document.querySelector("p")
let tempo_atual = document.querySelector("#tempo_atual")
let tempo_total = document.querySelector("#tempo_total")
let barra_progresso_atual = document.querySelector("#barra_progresso_atual")
let icone = document.querySelector("#image_play")
let audio = document.querySelector("audio")
let ponto_tempo = document.querySelector("#selecionar_tempo")
const player = document.getElementById("player");

let musicas=[
    {   
        "titulo":"Lost in City Lights",
        "autor":"Cosmo Sheldrake",
        "audio":"./assets/lost-in-city-lights.mp3",
        "capa":"./assets/cover-1.jpg",
    },
    {
        "titulo":"Forest Lullaby",
        "autor":"Lesfm",
        "audio":"./assets/forest-lullaby.mp3",
        "capa":"./assets/cover-2.jpg",
    }
]
let indice_musica = 0;

function alterar_dados(){
        audio.src = musicas[indice_musica].audio;
        capa.src = musicas[indice_musica].capa;
        musica.innerHTML = musicas[indice_musica].titulo;
        artista.innerHTML = musicas[indice_musica].autor;
}

function play_pause(){
    if(html.classList.contains('tocando')){
        icone.setAttribute('src', './assets/pause.svg');
        audio.play();
    }
    else{
        icone.setAttribute('src', './assets/play.svg');
        audio.pause();
    }
}

function tocando(){
    html.classList.toggle('tocando');
    play_pause();
}


function formatar_tempo(tempo){

    let minutos = Math.floor(tempo/60);
    let segundos = Math.floor(tempo%60);

    if (segundos <10){
        segundos = "0" + segundos;
    }
    return minutos + ":" + segundos;
}

tempo_total.innerHTML = formatar_tempo(audio.duration);

audio.addEventListener('loadedmetadata', () => {
    tempo_total.innerHTML = formatar_tempo(audio.duration); 
})

function reset_bar(){
    barra_progresso_atual.style.width = 0;
    ponto_tempo.style.marginLeft = "-4px";
}

audio.addEventListener('timeupdate', () => {
    tempo_atual.innerHTML = formatar_tempo(audio.currentTime);
    progresso_do_audio = audio.currentTime/audio.duration;
    barra_progresso_atual.style.width = (progresso_do_audio*100)+ "%";
    ponto_tempo.style.marginLeft = (progresso_do_audio*100-1)+ "%";
});

function tocar_proxima(){
    indice_musica++;
    if (indice_musica >= musicas.length){
        indice_musica = 0;
    }
    alterar_dados();
    reset_bar();  
    play_pause();
}
audio.addEventListener('ended', () => {
    tocar_proxima();
});

function tocar_anterior_reset(){
    if(audio.currentTime<5){
        indice_musica--;
        if (indice_musica <0){
            num_musicas = musicas.length - 1;
            indice_musica = num_musicas;
        }
        alterar_dados();
        reset_bar();
        play_pause();
    }
    else {
        audio.currentTime = 0;
    } 
}


player.addEventListener("click", function(event){
    const rect = player.getBoundingClientRect();
    const clickpos = event.clientX - rect.left;
    const largura = rect.width;
    let clickrange = (clickpos/largura)*audio.duration;
    audio.currentTime = clickrange;
});