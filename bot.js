/*

TWITTER BOT BY ALEIX FERRÉ
GitHub: https://github.com/CatalaHD/Bot-Twitter-v2

USING
Twit: https://github.com/ttezel/twit

Following the Twitter Bot Tutorial by TheCodingTrain
Tutorial Series: https://www.youtube.com/playlist?list=PLRqwX-V7Uu6atTSxoRiVnSuOn6JHnq2yV

Hosted in AWS EC2

*/

// ----------------------------------------------------------------
// Requirements and imports

var Twit = require('twit');

var config = require('./config');
var T = new Twit(config);

var csv = require('csvtojson');

var execute = require('child_process').exec;
var fs = require('fs');

console.log("Import done");

// ----------------------------------------------------------------
// Variables

var frases_mort = [];

var frases_suicidi = [];

var frases_doble_baixa = [];

var frases_resucitar = [];

var frases_redencion = [];

// Llistes que mantindran a tots els jugadors vius de la partida

// var llistaVius = [];
// var llistaMorts = [];

var teamA = [];
var teamB = [];

var viusA;
var viusB;

// Contingut del Twit que s'ha de publicar
// Aquest es va modificant dinàmicament al programa
var hashtag = "#UdGBattleRoyale2";
var content = "";

var frequencia_twits = 4; // Quantitat de Twits que s'han de pujar cada dia
var frequencia_especials = 6; // Cada quants twits sortirà una ronda especial

var nTwits = 0;

var intervalID;

// ----------------------------------------------------------------
// Main Program

setup_taules();



// ----------------------------------------------------------------
// Functions


function setup_taules() {
    
    var csv_team_A = 'info/llista_teamA.csv';
    var csv_team_B = 'info/llista_teamB.csv';
    var csv_f_mort = 'info/frases_mort.csv';
    var csv_f_suicidi = 'info/frases_suicidi.csv';
    var csv_f_doble = 'info/frases_doble.csv';
    var csv_f_resucitar = 'info/frases_resucitar.csv';
    var csv_f_redencion = 'info/frases_redencion.csv';

    csv().fromFile(csv_team_A).then(function(a) {
        teamA = a;
        csv().fromFile(csv_team_B).then(function(a) {
            teamB = a;
            csv().fromFile(csv_f_mort).then(function(a) {
                frases_mort = a;
                csv().fromFile(csv_f_suicidi).then(function(a) {
                    frases_suicidi = a;
                    csv().fromFile(csv_f_resucitar).then(function(a) {
                        frases_resucitar = a;
                        csv().fromFile(csv_f_redencion).then(function(a) {
                            frases_redencion = a;
                            csv().fromFile(csv_f_doble).then(function(a) {
                                frases_doble_baixa = a;
                                viusA = teamA.length;
                                viusB = teamB.length;

                                // Import of all the tables done
                                console.log("All tables charged\n-----------------\n");
                                start_partida();
                            });
                        });
                    });
                });
            });
        });
    });
}


function start_partida() {
        
    // Fem el primer torn en quant el bot comenci
    ferTorn();

    // I cridem al setInterval perque cada x hores torni a fer un torn
    intervalID = setInterval(ferTorn, 100 /* 1000*60*60*24/frequencia_twits*/);

}


function ferTorn() {

    /*
    if (nTwits%frequencia_especials === 0 && llistaVius.length > 5 && nTwits != 0) {
        rondaEspecial();
    } else {
        rondaNormal();
    }
    */

    rondaNormal();

}


function rondaNormal() {
    
    // A una ronda normal, sempre UNA persona mata a UNA altra

    matar();
    
    // Generar una taula d'informació en .csv per processarla a Processing
    
    montarFitxer();
    
}


function rondaEspecial() {
    content = "Ronda Especial: ";
    
    var prob = Math.floor(Math.random() * 100); // Numero aleatori entre 0 i 100

    if (prob < 25) {
        // Suicidar
        suicidar();
        
    } else if (prob > 25 && prob < 50) {
        // O una persona mata a 2 sempre que hi hagi >1 (>= 2) persona viva
        doble_kill();
        
    } else if (prob > 50 && prob < 75) {
        // O redencion (resucitar a dos persones)
        redencion();

    } else {
        resucitar();
    }
    
    montarFitxer();
}


function matar() {

    // Quan un dels integrants ha de morir, s'esculleix un aleatòriament i es passa a la llista de morts 

    var equip_atacant = Math.floor(Math.random()*100);
    var posicioAssasi;
    var posicioMort;
    var assasi;
    var mort;
    var equip;

    if (equip_atacant < 50) {
        
        // Ataca A
        
        equip = "A";

        do {
            posicioAssasi = Math.floor(Math.random() * teamA.length);
            posicioMort = Math.floor(Math.random() * teamB.length);
            
            assasi = teamA[posicioAssasi];
            mort = teamB[posicioMort];
        } while ( assasi.viu == 0 || mort.viu == 0 );

        teamA[posicioAssasi].baixes++;
        teamB[posicioMort].viu = 0;
        viusB--;

    } else {
        
        // Ataca B
        
        equip = "B";

        do {
            posicioAssasi = Math.floor(Math.random() * teamB.length);
            posicioMort = Math.floor(Math.random() * teamA.length);

            assasi = teamB[posicioAssasi];
            mort = teamA[posicioMort];
        } while ( assasi.viu == 0 || mort.viu == 0 );

        teamB[posicioAssasi].baixes++;
        teamA[posicioMort].viu = 0;
        viusA--;

    }

    // Frase personalitzada

    var posicioFrase = Math.floor(Math.random() * frases_mort.length);
    var frase = frases_mort[posicioFrase].info;

    frase = frase.replace(/([*])+/g, assasi.nom + assasi.alias)
                 .replace(/([+])+/g, mort.nom + mort.alias);
    
    content = frase;
    
        
    
    // Condicio de victoria

    if ( viusA <= 0 || viusB <= 0 ) {
        clearInterval(intervalID);
        content += "\nVictòria Royale!!\nL'equip " + equip + " ha guanyat la Guerra!";
    }


}


function suicidar() {

    if (llistaVius.length < 2) {
        rondaEspecial();
    } else {
        content += "SUICIDI\n";

        var suicidat_pos = Math.floor(Math.random() * llistaVius.length);

        suicidat = llistaVius[suicidat_pos];

        
        // Frase personalitzada
        
        var posicioFrase = Math.floor(Math.random() * frases_suicidi.length);
        var frase = frases_suicidi[posicioFrase].info;
        
        frase = frase.replace(/([*])+/g, suicidat.nom + suicidat.alias);

        content += frase;

        llistaMorts.push(suicidat);
        llistaVius.splice(suicidat_pos, 1);
    }
}


function doble_kill() {
    // Quan s'executa la redencion, 2 persones que estaven mortes, reviuen
    if (llistaMorts.length < 2) {
        rondaEspecial();
    } else {        
        content += "DOBLE KILL\n";

        var mort1 = Math.floor( Math.random() * llistaVius.length );
        var mort2 = Math.floor( Math.random() * llistaVius.length );
        var assasi = Math.floor( Math.random() * llistaVius.length );


        while (mort1 === mort2 || mort1 === assasi || mort2 === assasi) {
            mort1 = Math.floor( Math.random() * llistaVius.length );
            mort2 = Math.floor( Math.random() * llistaVius.length );
            assasi = Math.floor( Math.random() * llistaVius.length );
        }

        var _assasi = llistaVius[assasi];
        var _mort1 = llistaVius[mort1];
        var _mort2 = llistaVius[mort2];

        
        // Frase personalitzada
        
        var posicioFrase = Math.floor(Math.random() * frases_doble_baixa.length);
        var frase = frases_doble_baixa[posicioFrase].info;
        
        // El replace només funciona fins que troba UNA instancia
        frase = frase.replace(/([*])+/g, _assasi.nom + _assasi.alias)
                     .replace(/([+])+/g, _mort1.nom + _mort1.alias)
                     .replace(/([=])+/g, _mort2.nom + _mort2.alias);
        
        content += frase;
        
        llistaVius[assasi].baixes += 2;
        
        var cp_mort1 = llistaVius[mort1];
        var cp_mort2 = llistaVius[mort2];
        
        if (mort2 > mort1) {
            mort2--;
        }
        
        llistaMorts.push(cp_mort1);
        llistaVius.splice(mort1, 1);
        
        
        llistaMorts.push(cp_mort2);
        llistaVius.splice(mort2, 1);
    }
}


function redencion() {

    // Quan s'executa la redencion, 2 persones que estaven mortes, reviuen
    if (llistaMorts.length < 2) {
        rondaEspecial();
    } else {
        content += "REDENCIÓ\n";

        var resucitat1 = Math.floor( Math.random() * llistaMorts.length );
        var resucitat2 = Math.floor( Math.random() * llistaMorts.length );

        while (resucitat1 === resucitat2) {
            resucitat2 = Math.floor( Math.random() * llistaMorts.length );
        }

        var res1 = llistaMorts[resucitat1];
        var res2 = llistaMorts[resucitat2];

        // Frase personalitzada
                
        var posicioFrase = Math.floor(Math.random() * frases_redencion.length);
        var frase = frases_redencion[posicioFrase].info;

        frase = frase.replace(/([*])+/g, res1.nom + res1.alias)
                     .replace(/([+])+/g, res2.nom + res2.alias);

        content += frase;

        llistaVius.push(llistaMorts[resucitat1]);
        llistaMorts.splice(resucitat1, 1);

        if (resucitat2 > resucitat1) {
            resucitat2--;
        }

        llistaVius.push(llistaMorts[resucitat2]);
        llistaMorts.splice(resucitat2, 1);
    }
}


function resucitar() {

    // En el cas de que algun jugador hagi de resucitar s'esculleix aleatoriament i es mou d'una llista a l'altra
    if (llistaMorts.length < 1) {
        rondaEspecial();
    } else {
        content += "RESUCITAR\n";
        var resucitatPosicio = Math.floor(Math.random() * llistaMorts.length);
        var resucitat = llistaMorts[resucitatPosicio];

        // Frase personalitzada
                        
        var posicioFrase = Math.floor(Math.random() * frases_resucitar.length);
        var frase = frases_resucitar[posicioFrase].info;

        frase = frase.replace(/([*])+/g, resucitat.nom + resucitat.alias);

        content += frase;
        
        llistaVius.push(resucitat);
        llistaMorts.splice(resucitatPosicio, 1);
    }
}
   

function montarFitxer() {

    // Montem el fitxer .csv perque Processing el tingui llest per crear les imatges
    
    if ( viusA > 0 && viusB > 0 ) {
        content += "\nTeam A: " + viusA + " vius - Team B: " + viusB + " vius";
    }


    // Header
    
    var fitxerContent = "Name,Viu,Equip\n";


    // Llistat del Team A

    for(i = 0; i < teamA.length; i++) {
        fitxerContent += teamA[i].nom + "," + teamA[i].viu +  "," + "A" + "\n";
    }


    // Llistat del Team B

    for(i = 0; i < teamB.length; i++) {
        fitxerContent += teamB[i].nom + "," + teamB[i].viu + "," + "B" + "\n";
    }


    // Escrivim el contingut al fitxer

    fs.writeFile('image/data.csv', fitxerContent, writed);
    
    function writed (err) {
        if (err) throw err;        
        
        // Fem servir Processing per crear la imatge i la pengem a Twitter

        //tweetIt();
        console.log(content+'\n');
        
    }
}


function tweetIt() {
    
    // Creem una comanda per executar directament l'script ALIVE
    // En aquest cas, executarem el programa compilat, ja que estem treballant a Linux
    // i ens és més fàcil.
    
    console.log("Starting processing ALIVE");
    var cmd = './image/alive/image_alive';
    execute(cmd, processing_alive);
    
    function processing_alive(error, stdout, err) {
        
        // Quan ja s'ha creat la imatge ALIVE i no hi ha hagut cap error, començem a processar la segona

        if (error !== null) {
            console.log(error);
        }

        console.log("Processing ALIVE done!");

        

        // Creem una comanda per executar directament l'script però ara DEATH

        console.log("Starting processing DEATH");
        var cmd = './image/death/image_death';
        execute(cmd, processing_death);

        function processing_death(error, data, err) {
            if (error !== null) {
                console.log(error);
            }
    
            console.log("Processing DEATH done!\nReading the img contents...");

            // Llegim el contingut de les dues imatges, ja processades, per pujar-les finalment

            var alive_filename = './image/alive/output_alive.png';
            var alive_params = {
                encoding: 'base64'
            };
            var alive_b64 = fs.readFileSync(alive_filename, alive_params);

            var death_filename = './image/death/output_death.png';
            var death_params = {
                encoding: 'base64'
            };
            var death_b64 = fs.readFileSync(death_filename, death_params);
            

            // Pujem la imatge ALIVE
            console.log("Uploading ALIVE");
            T.post('media/upload', { media_data: alive_b64 }, uploaded_alive);

            
            function uploaded_alive(err,data,response) {
                
                var id_alive = data.media_id_string;
                
                // Pujem la imatge DEATH
                console.log("Uploading DEATH");
                T.post('media/upload', { media_data: death_b64 }, uploaded_death);
                
                function uploaded_death(err,data,error) {
                    var id_death = data.media_id_string;
                    var tweet = {
                        status: dia_actual() + "\n" + content + "\n" + hashtag,
                        media_ids: [id_alive, id_death]
                    };
                    
                    
                    // Pujem el Twit amb la imatge associada
    
                    console.log(tweet.status);
                    T.post('statuses/update', tweet, tweeted);

                    function tweeted(err, data, response) {

                        // Ja tenim el Twit pujat!!
        
                        if (err) {
                            console.log("Something went wrong");
                            console.log(err + '\n');
                        } else {
                            console.log("Tweet posted correctly!\n");
                            nTwits++;
                        }
                    }
                }
            }
        } 
    }
}


function quiMata(kills1, kills2) {
    var guanya1 = true;

    if (kills1 === kills2) {
        guanya1 = (Math.random()*100 < 50);
    } else if (kills1 > kills2) { // Téns més probabilitats 70% - 100% quantes més kills téns
        guanya1 = (Math.random()*100 < map_range((kills1-kills2), 1, midaInici, 70, 100));
    } else {
        guanya1 = (Math.random()*100 > map_range((kills2-kills1), 1, midaInici, 70, 100));
    }

    return guanya1;
}


function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


function dia_actual() {
    return "Dia " + (Math.floor(nTwits/frequencia_twits)+1);
}
