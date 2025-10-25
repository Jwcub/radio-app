// Denna fil ska innehålla din lösning till uppgiften (moment 5).

"use strict";

/*  Delar till ej obligatorisk funktionalitet, som kan ge poäng för högre betyg
*   Radera rader för funktioner du vill visa på webbsidan. */
// document.getElementById("player").style.display = "none";      // Radera denna rad för att visa musikspelare
// document.getElementById("shownumrows").style.display = "none"; // Radera denna rad för att visa antal träffar

/* Här under börjar du skriva din JavaScript-kod */
window.onload = init;

function init() {

    getStoredChannelslist();
    document.getElementById("numrows").addEventListener("change", addChannels); // Händelselyssnare för att välja antal kanaler som ska visas
    document.getElementById("playbutton").addEventListener("click", playChannel); // Händelselyssnare för att spela upp radioprogram
    getStoredChannel();
};

// Funktion som hämtar tidigare antal lagrade radiokanaler
function getStoredChannelslist() {
    const numberOfChannels = localStorage.getItem("numberOfChannels")
    if(numberOfChannels > 0){
        getChannels(numberOfChannels); // Om kanaler är lagrade hämta dem
    } else {
        getChannels(10); // Hämta 10 kanaler om inte antal kanaler lagrats tidigare
    }
}

 // Funktion för att hämta valt antal kanaler
function addChannels() {
    const numrowsValue = document.getElementById("numrows").value;

    // Lagra antal valda kanaler LocalStorage
    localStorage.setItem("numberOfChannels", numrowsValue);

    getChannels(numrowsValue);
}

// Hämta kanaler från Sveriges Radio (SR)
function getChannels(numberOfChannels) {
    const mainNavListEl = document.getElementById("mainnavlist");
    mainNavListEl.innerHTML = "";

    const url = "http://api.sr.se/api/v2/channels?format=json&size=" + numberOfChannels;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            displayChannels(data.channels)
            listChannelsInPlayer(data.channels)})
        .catch(error => console.log("Det blev ett fel! Felmeddelande: " + error))
}

// Skriv ut kanalnamn som listelement i DOM. 
function displayChannels(srChannels) {
    const channelListEl = document.getElementById("mainnavlist");

    if(srChannels.lenght < 0){ // Felmeddelande om inga kanaler finns. 
        channelListEl.innerHTML = "<li>Inga kanaler tillgängliga</li>"; 
    return; }

    srChannels.forEach(channel => { // Läser igenom alla objekt (kanaler)
        const newListEl = document.createElement("li"); //Skapar <li></li>
        newListEl.setAttribute("title", channel.tagline); // Lägger till information när man för mus över kanalnamn.

        const newNameEl = document.createTextNode(channel.name); // Textsträng med kanalnamn

        newListEl.appendChild(newNameEl); // Lägger till kanalnamn i listelementet
        channelListEl.appendChild(newListEl); // Lägger till listelementet i listraden på webbplats

        let channelId = channel.id;
        newListEl.addEventListener("click", () => { 

            // Lagra vald radiokanl i Local Storage
            localStorage.setItem("myChannel", channelId);

            // Lägger till information om radiokanal i listan med program.
            const programListEl = document.getElementById("info");
            programListEl.innerHTML = `<div style="display: grid; grid-template-columns: auto auto; grid-template-rows: auto auto; gap: 0 15px; background: #f4f3f3; padding: 20px; border-radius: 10px; margin-bottom: 10px;"><div style="grid-area: 1 / 1 / 3 / 2;"><img src="${channel.image}" width="150" alt="SR Kanal - bild"></div> <div style="grid-area: 1 / 2 / 2 / 3; align-self: end;"><h2>${channel.name}</h2></div> <div style="grid-area: 2 / 2 / 3 / 3;"><p>${channel.tagline}</p> <a href="${channel.siteurl}">${channel.siteurl.slice(12)}</a></div>`;

            getPrograms(channelId);
        });
    });
}

// Funktion för att hämta hem information om program
function getPrograms(id) {
    const url = "http://api.sr.se/api/v2/scheduledepisodes?format=json&size=999&channelid=" + id;

    fetch(url)
    .then(res => res.json())
    .then(data => displayPrograms(data.schedule))
    .catch(error => console.log("Det blev ett fel! Felmeddelande: " + error))
}

// Funktion för att visa programtablå i DOM
function displayPrograms(programList) {
    const programListEl = document.getElementById("info");

    // Felmeddelande om inga kanaler finns. 
    if(programList.lenght < 0){ 
       programListEl.innerHTML = "<b>Inga program är tillgängliga...</b>";
    return;
    } 

    // Itererar genom program
    programList.forEach(program => {

        // Bearbeta start och sluttid för program
        const currentTime = Date.now(); // Tid nu i ms.

        const startTimeMs = parseInt(program.starttimeutc.slice(6,-2));
        const endTimeMs = parseInt(program.endtimeutc.slice(6,-2));
        const endTimeDateFormat = new Date(endTimeMs);

        // Om programmet redan slutat, skriv inte ut till DOM
        if(endTimeDateFormat < currentTime) {    
        } else {
            // Skapa HTML-element
            const articleEl = document.createElement("article");
            const titleEl = document.createElement("h3");
            const subtitleEl = document.createElement("h4");
            const timeEl = document.createElement("h5");
            const descriptionEl = document.createElement("p");

            // Lägg till innehåll innanför skapade HTML-taggar
            titleEl.innerHTML = program.title; // Lägger till titel
            if(program.subtitle === undefined){ // Kollar om det finns subtitle
            } else {
                subtitleEl.innerHTML = program.subtitle; //Lägger till subtitle
            }
            timeEl.innerHTML = "Tid: " + convertTime(startTimeMs) + " - " + convertTime(endTimeMs); 
            descriptionEl.innerHTML = program.description; // Lägger till beskrivning

            // Slår ihop element
            articleEl.appendChild(titleEl);
            articleEl.appendChild(subtitleEl);
            articleEl.appendChild(timeEl);
            articleEl.appendChild(descriptionEl);
            programListEl.appendChild(articleEl);
        }
    });
}

// Konvertera tid till format 00:00
function convertTime(time) {
    const tempDate = new Date(time);

    let hours = tempDate.getHours();
    let minutes = tempDate.getMinutes();

    if(hours < 10){ hours = "0" + hours} 
    if(minutes < 10){ minutes = "0" + minutes}

    return hours + ":" + minutes;
}

// Funktion för att skriva ut lista med kanaler till radio-"väljare"
function listChannelsInPlayer(srChannels) {
    const playChannelEl = document.getElementById("playchannel");
    playChannelEl.innerHTML = "";
   
    srChannels.forEach(channel => {
    const optionEl = document.createElement("option");
    optionEl.innerHTML = channel.name; 
    optionEl.setAttribute("value", channel.id)

    playChannelEl.appendChild(optionEl);
    })
}

// Funktion för att spela radiokanaler
function playChannel() {
    const channelId = document.getElementById("playchannel").value; // Värde för KanalId
    const audioUrl = "http://www.sverigesradio.se/topsy/direkt/srapi/" + channelId

    const radioPlayerEl = document.getElementById("radioplayer");
    radioPlayerEl.innerHTML = ""; // Tar bort dubletter av spelare

    // Skapa element för radiospelare
    const audioPlayerEl = document.createElement("audio");
    audioPlayerEl.setAttribute("controls", "");
    audioPlayerEl.setAttribute("autoplay", "");
    const sourceEl = document.createElement("source");
    sourceEl.setAttribute("src", audioUrl);
    sourceEl.setAttribute("type", "audio/mpeg");

    // Skriv ut till DOM
    audioPlayerEl.appendChild(sourceEl);
    radioPlayerEl.appendChild(audioPlayerEl);
}

function getStoredChannel() {

    const myStoredChannel = localStorage.getItem("myChannel");

    if(myStoredChannel>0) {
        
        getPrograms(myStoredChannel);

    } else {
        const infoEl = document.getElementById("info");
        infoEl.innerHTML = "<h2>Välkommen till tablåer för Sveriges Radio</h2> Denna applikation använder Sveriges Radios öppna API för tablåer. Välj en kanal i listan till vänster för att visa tablå för kanalen.<p>"
    }
}

    
