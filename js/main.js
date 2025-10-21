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
        channelListEl = "<li>Inga kanaler tillgängliga</li>"; 
    return;
    } 

    srChannels.forEach(channel => { // Läser igenom alla objekt (kanaler)
        const newListEl = document.createElement("li"); //Skapar <li></li>
        const newNameEl = document.createTextNode(channel.name); // Textsträng med kanalnamn

        newListEl.appendChild(newNameEl); // Lägger till kanalnamn i listelementet
        channelListEl.appendChild(newListEl); // Lägger till listelementet i listraden på webbplats
    });
}