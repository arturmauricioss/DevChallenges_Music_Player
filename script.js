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
let originalWidth
let originalHeight

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
    iniciarAudioContext()
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

const canvas = document.getElementById("frequencia")
const ctx = canvas.getContext("2d")

canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight
originalWidth = canvas.offsetWidth
originalHeight = canvas.offsetHeight

function resizeCanvas() {
    if (document.documentElement.classList.contains("beat")) {

        const size = Math.min(window.innerWidth, window.innerHeight) * 0.95

        canvas.width = size
        canvas.height = size

        canvas.style.width = size + "px"
        canvas.style.height = size + "px"

        canvas.style.left = "50%"
        canvas.style.top = "50%"
        canvas.style.transform = "translate(-50%, -50%)"

    } else {

    canvas.width = originalWidth
    canvas.height = originalHeight

    canvas.style.width = originalWidth + "px"
    canvas.style.height = originalHeight + "px"

    canvas.style.left = ""
    canvas.style.top = ""
    canvas.style.transform = ""
    }
}
ctx.shadowBlur = 15
ctx.shadowColor = "rgba(0, 255, 221, 0.47)"

let audioContext;
let analyser;
let bufferLength;
let dataArray;

const gradient = ctx.createRadialGradient(
    canvas.width / 2,   // centro X
    canvas.height,      // centro Y (base das barras)
    0,                  // raio interno
    canvas.width / 2,
    canvas.height,
    canvas.width / 1.2  // raio externo
)

function iniciarAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContext()

        const source = audioContext.createMediaElementSource(audio)
        analyser = audioContext.createAnalyser()

        source.connect(analyser)
        analyser.connect(audioContext.destination)

        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.85

        bufferLength = analyser.frequencyBinCount
        dataArray = new Uint8Array(bufferLength)

        animate()
    }

    audioContext.resume()
}

        let rotation = 0
        let rotationSpeed = 0
        function animate() {
            requestAnimationFrame(animate)

            analyser.getByteFrequencyData(dataArray)

            rotation %= Math.PI * 2
            
            ctx.clearRect(0, 0, canvas.width, canvas.height)


            // dentro do animate
            const bass = dataArray[2] / 255
            rotationSpeed += bass * 0.002
            rotationSpeed *= 0.5
            rotation += 0.002 + rotationSpeed
            rotation %= Math.PI * 2
            const isBeatMode = document.documentElement.classList.contains("beat")

            if (!isBeatMode) {

                // 🔵 MODO NORMAL (barras horizontais)
                const centerX = canvas.width / 2
                const totalBars = 64
                const halfBars = totalBars / 2
                const barWidth = (canvas.width / 2) / halfBars

                const bass = dataArray[2] / 255
                const dynamicRadius = (Math.min(canvas.width, canvas.height) / 2) + (bass * 60)

                const gradient = ctx.createRadialGradient(
                    centerX,
                    canvas.height,
                    0,
                    centerX,
                    canvas.height,
                    dynamicRadius
                )

                gradient.addColorStop(0, "#00ffff")
                gradient.addColorStop(0.5, "#00ff88")
                gradient.addColorStop(1, "rgba(0,255,200,0.1)")

                ctx.fillStyle = gradient
                ctx.globalCompositeOperation = "lighter"

                for (let i = 0; i < halfBars; i++) {

                    const index = Math.floor(i * (bufferLength / halfBars))
                    const normalized = dataArray[index] / 255
                    const barHeight = normalized * canvas.height * 0.85

                    const xRight = centerX + (i * barWidth)
                    const xLeft = centerX - ((i + 1) * barWidth)

                    const y = canvas.height - barHeight

                    ctx.fillRect(xRight, y, barWidth - 2, barHeight)
                    ctx.fillRect(xLeft, y, barWidth - 2, barHeight)
                }

            } else {
        // 🔥 MODO BEAT 360° ESPELHADO
                
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const capaRect = capa.getBoundingClientRect()
    const capaRadius = capaRect.width / 2

    const gap = 1

    const bass = dataArray[2] / 255

    // 🔥 limita o quanto pode crescer
    const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 40

    const baseRadius = capaRadius + gap
    const dynamicRadius = baseRadius + (bass * 10)

    const radius = Math.min(dynamicRadius, maxRadius)

        const totalBars = 128
        const halfBars = totalBars / 2

        for (let i = 0; i < halfBars; i++) {

            const index = Math.floor(i * (bufferLength / halfBars))
            const value = dataArray[index] / 255
            const barHeight = value * 120

            const angle = ((i / halfBars) * Math.PI) + rotation

            // LADO 1
            const x1 = centerX + Math.cos(angle) * radius
            const y1 = centerY + Math.sin(angle) * radius

            const x2 = centerX + Math.cos(angle) * (radius + barHeight)
            const y2 = centerY + Math.sin(angle) * (radius + barHeight)

            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()

            // LADO 2 (espelho perfeito)
            const oppositeAngle = angle + Math.PI

            const ox1 = centerX + Math.cos(oppositeAngle) * radius
            const oy1 = centerY + Math.sin(oppositeAngle) * radius

            const ox2 = centerX + Math.cos(oppositeAngle) * (radius + barHeight)
            const oy2 = centerY + Math.sin(oppositeAngle) * (radius + barHeight)

            ctx.beginPath()
            ctx.moveTo(ox1, oy1)
            ctx.lineTo(ox2, oy2)
            ctx.stroke()
        }
    }
    ctx.globalCompositeOperation = "source-over"
}

function ajustarCapaBeat() {
    if (document.documentElement.classList.contains("beat")) {

        const menorLado = Math.min(window.innerWidth, window.innerHeight)

        let escala = 0.8

        if (menorLado < 600) {
            escala = 0.5
        } else if (menorLado < 900) {
            escala = 0.7
        }

        capa.style.transform = `translate(-50%, -50%) scale(${escala})`
        capa.style.transition = "transform 0.0s ease"

    } else {
        capa.style.transform = ""
    }
}

function alternarBeat() {
    document.documentElement.classList.toggle("beat")
    resizeCanvas()
    ajustarCapaBeat()
}

capa.addEventListener("click", alternarBeat)

document.addEventListener("keydown", (event) => {

    switch (event.key) {

        case "ArrowUp":
            tocando()
            break

        case "ArrowRight":
            tocar_proxima()
            break

        case "ArrowLeft":
            tocar_anterior_reset()
            break

        case "ArrowDown":
            alternarBeat()
            break
    }
})
let touchStartX = 0
let touchStartY = 0

document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
})

document.addEventListener("touchend", (e) => {

    let touchEndX = e.changedTouches[0].clientX
    let touchEndY = e.changedTouches[0].clientY

    let diffX = touchEndX - touchStartX
    let diffY = touchEndY - touchStartY

    const threshold = 60 // um pouco maior pra evitar erro

    if (Math.abs(diffX) > Math.abs(diffY)) {

        if (diffX > threshold) {
            tocar_proxima()
        } 
        else if (diffX < -threshold) {
            tocar_anterior_reset()
        }

    } else {

        if (diffY < -threshold) {
            tocando()
        } 
        else if (diffY > threshold) {
            alternarBeat()
        }
    }
})