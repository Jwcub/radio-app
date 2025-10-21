// Denna fil ska innehålla din lösning till uppgiften (moment 5).

"use strict";

/*  Delar till ej obligatorisk funktionalitet, som kan ge poäng för högre betyg
*   Radera rader för funktioner du vill visa på webbsidan. */
document.getElementById("player").style.display = "none";      // Radera denna rad för att visa musikspelare
document.getElementById("shownumrows").style.display = "none"; // Radera denna rad för att visa antal träffar

/* Här under börjar du skriva din JavaScript-kod */
window.onload = init;

function init() {

    getChannels();

};

function getChannels() {
    const url = "http://api.sr.se/api/v2/channels?format=json&size=10";
    
    fetch(url)
        .then(res => res.json())
        .then(data => displayChannels(data.channels))
        .catch(error => console.log("Det blev ett fel! Felmeddelande: " + error))
}

// Skriv ut kanalnamn som listelement i DOM. 
function displayChannels(srChannels) {
    const channelListEl = document.getElementById("mainnavlist");

    if(srChannels.lenght < 0){ // Felmeddelande om inga kanaler finns. 
        channelListEl.innerHTML = "<li>Inga kanaler tillgängliga</li>"; 
    return;
    } 

    srChannels.forEach(channel => { // Läser igenom alla objekt (kanaler)
        const newListEl = document.createElement("li"); //Skapar <li></li>
        newListEl.setAttribute("title", channel.tagline); // Lägger till information när man för mus över kanalnamn.
        const newNameEl = document.createTextNode(channel.name); // Textsträng med kanalnamn

        newListEl.appendChild(newNameEl); // Lägger till kanalnamn i listelementet
        channelListEl.appendChild(newListEl); // Lägger till listelementet i listraden på webbplats

        let channelId = channel.id;
        newListEl.addEventListener("click", () => getPrograms(channelId), false);
    });
}

// Funktion för att hämta hem information om program
function getPrograms(id) {
    const url = "http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=" + id

    fetch(url)
    .then(res => res.json())
    .then(data => displayPrograms(data.schedule))
    .catch(error => console.log("Det blev ett fel! Felmeddelande: " + error))
}

// Funktion för att visa programtablå i DOM
function displayPrograms(programList) {
    const programListEl = document.getElementById("info");
    programListEl.innerHTML = "";

    if(programList.lenght < 0){ // Felmeddelande om inga kanaler finns. 
       programListEl.innerHTML = "<b>Inga program är tillgängliga...</b>";
    return;
    } 

    // Itererar genom program
    programList.forEach(program => {

    // SKAPA IF-SATS HÄR SOM KOLLAR OM PROGRAMMET REDAN VARIT. 
    // OM VARIT, SKRIV INTE UT TILL DOM. ANNARS SKRIV UT.

        // Skapar HTML-element
        const articleEl = document.createElement("article");
        const titleEl = document.createElement("h3");
        const subtitleEl = document.createElement("h4");
        const timeEl = document.createElement("h5");
        const descriptionEl = document.createElement("p");

        titleEl.innerHTML = program.title; // Lägger till titel
        if(program.subtitle === undefined){ // Kollar om det finns subtitle
        } else {
            subtitleEl.innerHTML = program.subtitle;
        }
        descriptionEl.innerHTML = program.description; // Lägger till beskrivning

        // Slår ihop element
        articleEl.appendChild(titleEl);
        articleEl.appendChild(subtitleEl);
        articleEl.appendChild(descriptionEl);
        programListEl.appendChild(articleEl);
    });

}