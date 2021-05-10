//vamos selecionar todas as tags ou elementos necessários
const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
showMoreBtn = wrapper.querySelector("#more-music"),
musicList = wrapper.querySelector(".music-list"),
hideMusicBtn = musicList.querySelector("#close");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

//chamando a função carregar música quando a janela é carregada
window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingNow();
});

//carregar função de música
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `music/${allMusic[indexNumb - 1].src}.mp3`;
}

//função de tocar música
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//função de parar música
function pausedMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//função de chamar a próxima música
function nextMusic(){
    //aqui vamos apenas incrementar o índice em 1
   musicIndex++;
   //se musicIndex for maior que o comprimento da matriz, 
   //então a primeira música será reproduzida
   musicIndex > allMusic.length ? musicIndex  = 1 : musicIndex  = musicIndex;
   loadMusic(musicIndex);
   playMusic();
   playingNow();
}

//função de chamar a voltar música
function prevMusic(){
   musicIndex--;
   musicIndex < 1 ? musicIndex  = allMusic.length : musicIndex  = musicIndex;
   loadMusic(musicIndex);
   playMusic();
   playingNow();
}

//botão de reprodução
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    //se musicPaused for verdadeiro, chame pauseMusic senão chame playMusic
    isMusicPaused ? pausedMusic() : playMusic();
    playingNow();
});

//chamando a função de próxima música
nextBtn.addEventListener("click", ()=>{
    nextMusic();
});

//chamando a função de música anterior
prevBtn.addEventListener("click", ()=>{
    prevMusic();
});

//atualiza a barra deprogresso de acordo com o tempo atual da música
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{

        //atualiza a duração total da música
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ //adiciona o 0 antes dos segundos
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin};${totalSec}`;
    });

    //atualiza a reprodução da música com a hora atual
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){ //adiciona o 0 antes dos segundos
        currentSec = `0${currentSec}`;
    }
    
    musicCurrentTime.innerText = `${currentMin};${currentSec}`;

});

//atualiza o tempo atual de reprodução da música de acordo com a largura da barra de progresso
progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth; //obtendo largura da barra de progresso
    let clickedOffSetX = e.offsetX; //obtendo valor de deslocamento x
    let songDuration = mainAudio.duration; //obtendo a duração total da música

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});

//vamos repetir, embaralhar a música de acordo com o ícone
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
    //primeiro obtemos o texto interno do ícone, então vamos mudar de acordo
    let getText = repeatBtn.innerText; //obtendo o texto interno do ícone
    //vamos fazer mudanças diferentes em ícones diferentes usando o interruptor
    switch(getText){
        case "repeat": //se este ícone for repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Repetir Música");
            break;
        case "repeat_one": //se o ícone for repeat_one, mude para embaralhar
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Aleatório");
            break;
        case "shuffle": //se o ícone for aleatório, altere-o para repetir
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Repetir Lista");
            break;
    }                              
});

//acima, acabamos de mudar o ícone, agora vamos trabalhar no que fazer
//depois que a música acabou

mainAudio.addEventListener("ended", ()=>{
    //faremos de acordo com o ícone significa que se o usuário definiu o ícone para repetir a música, repetiremos
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1)
            }while(musicIndex == randIndex);
            musicIndex = randIndex; 
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }   
});

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//vamos criar li de acordo com o comprimento do array
for (let i = 0; i < allMusic.length; i++) {
    //vamos passar o nome da música, artista do array para li
    let liTag = `<li li-index"${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
                    <span id= "${allMusic[i].src}" class="audio-duration">4:18</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ //adiacionando o 0 antes dos segundos
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin};${totalSec}`;
            //adding t duration attribute which we'll use below
        liAudioDuration.setAttribute("t-duration", `${totalMin};${totalSec}`);
    });
}

//vamos trabalhar para tocar uma música específica no clique
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        //if there is an li tag which i-index is equal to musicIndex
        //then this music is playing now and we'll style it
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
    
        //adicionando o atributo onclick em todas as tags li
        allLiTags[j].setAttribute("onclick", "clicked(this)");
}

    //vamos tocar música no li clique
    function clicked(element){
        //obtendo o índice li de determinada tag li clicada
        let getLiIndex = element.getAtribute("li-index");
        musicIndex = getLiIndex; //passando aquele liindex para musicIndex
        loadMusic(musicIndex);
        playMusic();
        playingNow();
    }

}