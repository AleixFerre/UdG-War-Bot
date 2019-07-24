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

var execute = require('child_process').exec;
var fs = require('fs');

console.log("Import done\n-----------------\n");

// ----------------------------------------------------------------
// Variables

var frases_mort = [
    "* ha guanyat a + l'1 pa 1 sin camiseta en el parque",
    "* ha enverinat a + tirant-li mata rates en el cafè",
    "* ha atropellat a + amb un John Deere",
    "* ha enviat a + a recu de EDA",
    "* ha matat a + \nLast whisper: He mort, però tornaré penis en mà i la meva venjança serà terrible",
    "* ha matat a + sense motius, F",
    "* ha enviat a + a l'Àrea 51",
    "* ha ofegat a + amb els seus pectorals herculis",
    "* s'ha despullat en mig de classe i + ha mort del fàstic",
    "* ha dutxat a l'otaku +",
    "* ha tirat a + per les escales de la P2",
    "* ha exterminat a + amb una bomba d'hidrògen",
    "* s'ha fumat a + i ara toca pey de celebració",
    "* ha matat a + amb una cullera de plastic després de 10 hores...",
    "* ha matat a + i aquest contesta: Cuando nos veamos, uno pa uno y te salto los empastes.",
    "* ha penetrat amb un consolador a + fins la mort",
    "* ha fet veure una marató de One Piece a + \n\nHa mort de deshidratació",
    "* ha empalat a + amb un arma secreta",
    "* ha enviat a + cap a la Lobby",
    "* ha sacrificat a + als deus obscurs amb una bomba atomica"
];

var frases_suicidi = [
    "* ha matat a *, perquè s'ha suicidat, ho pilles? jjajaj xD",
    "* ha ensopegat per les escales del P2 i s'ha obert el cap",
    "* s'ha suicidat al bar",
    "* ha decidit deixar GDDV per Magisteri",
    "* diu: El meu cap m'ha insultat, així que li he pegat un tret",
    "* ha suspès la recu",
    "* s'ha electrocutat amb un Arduino",
    "* ha relliscat amb una bassa de Fairy i s'ha trencat el cap",
    "* s'ha suicidat perque se n'ha adonat de que el seu profe d'MTP serà en Rigau",
    "* no para de fer int",
    "* s'ha vist al mirall.",
    "* s'ha fotut un tret al cap a casa seva despres d'estar 3 hores buscant un error causat per escriure malament una variable;",
    "* s'ha suicidat de sobredosi almenys va viure els ultims moments amb intensitat",
    "* ja no podia més i s'ha tirat per un pont",
    "* diu: Ojalá un Otaku en mi lugar, por un bien global.",
    "* s'ha adonat que pensar que la terra és esfèrica és de 5 d'IQ i s'ha tirat d'un balcó",
    "* no ha pogut processar el NULL de JavaScript, * no vol saber res més d'aquest món",
    "* s'ha ofegat amb la seva pròpia saliva",
    "* s'ha mort de desesperació esperant que s'obrís el 3DS MAX",
    "* s'ha suicidat dient Jo soc Ironman \nNo serà recordat",
    "* s'ha suïcidat al P2 perquè s'ha estresat amb Disseny Conceptual"
];

var frases_doble_baixa = [
    "* ha deixat les practiques a + i =, cosa que els ha donat sida.",
    "* s'ha marcat un dos por uno matant a + i a =",
    "* ha destrossat l'ano de + i = mentre feien un threesome",
    "Tinc polla per a tots, a * per davant i a B per darrera",
    "* ha posat fi a la vida de + i =",
    "* ha trobat un exploit al backend d'aquest bot, i ha esborrat a + i = de la llista de vius.",
    "* ha sacrificat a un ritual satànic a + i a =",
    "* s'ha fet una doble baixa matant a + amb una ma i a = amb l'altre",
    "* ha mantingut el seu cul intacte matant a + i a =",
    "* ha dit Efenelchat. + i = han decidit abandonar per no seguir amb en cringe.",
    "* ha assessinat cruelment a + i a = mentre dormien",
    "* esta mode fumat i amb la illuminacio mental ha aconseguit fer una doble baixa matant a + i a =",
    "* ha fet explotar un banc on + i = hi estàven atracant",
    "* ha matat a + i = dient ¡Toma cipotazo doble!",
    "Intentant fent un centpeus humà, el científic * ha matat a + i a =",
    "* no s'ha pogut controlar i ha matat a + i = per no poder haver entregat el projecte de jocs web",
    "* ha matat a + i a = \nDany en àrea",
    "* no en tenia prou amb + i ha matat també a =",
    "* ha fet justicia matant a + i =",
];

// Llista que mantindrà a tots els jugadors vius de la partida

var llistaVius = [
    { nom: "Blascovitz",                    alias: "( @en_sharp ) ",            baixes: 0 },
    { nom: "Laura Qwerty",                  alias: "( @LauraQwerty_ ) ",        baixes: 0 },
    { nom: "Alex V.",                       alias: "( @JainkoAteoa ) ",         baixes: 0 },
    { nom: "Aureoloss - El Meme Master",    alias: "( @ovonesix ) ",            baixes: 0 },
    { nom: "EnormousBlackDildo",            alias: "( @Rigoberto_III ) ",       baixes: 0 },
    { nom: "Sandro Bortolotti",             alias: "",                          baixes: 0 },
    { nom: "Quasar",                        alias: "( @qsr711 ) ",              baixes: 0 },
    { nom: "Big oof",                       alias: "( @ThunderUsed ) ",         baixes: 0 },
    { nom: "Satán",                         alias: "( @seitnist ) ",            baixes: 0 },
    { nom: "ArrozArea51",                   alias: "( @zRoz14 ) ",              baixes: 0 },
    { nom: "Català AltaDefinició",          alias: "( @CatalaHD ) ",            baixes: 0 },
    { nom: "Carla",                         alias: "( @maya8carla ) ",          baixes: 0 },
    { nom: "AlienFumeta",                   alias: "",                          baixes: 0 },
    { nom: "Arnau Marquez",                 alias: "",                          baixes: 0 },
    { nom: "Tomasz SzGu",                   alias: "( @TomaszSzeliga ) ",       baixes: 0 },
    { nom: "Joel AKA Chavalada",            alias: "( @Jowi_99 ) ",             baixes: 0 },
    { nom: "TitoVizonte",                   alias: "( @Tito_Vizonte ) ",        baixes: 0 },
    { nom: "Pugdemon el pelucas",           alias: "( @_rxbxn ) ",              baixes: 0 },
    { nom: "Santi",                         alias: "( @SantiVG_99 ) ",          baixes: 0 },
    { nom: "Jack el Destripador",           alias: "( @JackArcanMiller ) ",     baixes: 0 },
    { nom: "Anabel",                        alias: "( @OnlyDreamAgain ) ",      baixes: 0 }
 ];

var midaInici = llistaVius.length;

// Llista que mantindrà a tots els jugadors morts de la partida
var llistaMorts = [];

// Contingut del Twit que s'ha de publicar
// Aquest es va modificant dinàmicament al programa
var hashtag = "#UdGBattleRoyale2";
var content = "";

var frequencia_twits = 4; // Quantitat de Twits que s'han de pujar cada dia
var frequencia_especials = 4; // Cada quants twits sortirà una ronda especial

var nTwits = 0;

// ----------------------------------------------------------------
// Main Program

// Fem el primer torn en quant el bot comenci
ferTorn();

// I cridem al setInterval perque cada x hores torni a fer un torn
var intervalID = setInterval(ferTorn, 1000*60*60*24/frequencia_twits);


// ----------------------------------------------------------------
// Functions

function ferTorn() {

    if (nTwits%frequencia_especials === 0 && llistaVius.length > 5 && nTwits != 0) {
        rondaEspecial();
    } else {
        rondaNormal();
    }

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

    var persona1 = Math.floor(Math.random() * llistaVius.length);
    var persona2 = Math.floor(Math.random() * llistaVius.length);
    
    while (persona1 === persona2) {
        persona1 = Math.floor(Math.random() * llistaVius.length);
    }

    var baixes1 = llistaVius[persona1].baixes;
    var baixes2 = llistaVius[persona2].baixes;

    var posicioAssasi;
    var posicioMort;

    if (quiMata(baixes1, baixes2)) {
        posicioAssasi = persona1;
        posicioMort = persona2;
    } else {
        posicioAssasi = persona2;
        posicioMort = persona1;
    }

    var assasi = llistaVius[posicioAssasi];
    var mort = llistaVius[posicioMort];
    

    // Frase personalitzada

    var posicioFrase = Math.floor(Math.random() * frases_mort.length);
    var frase = frases_mort[posicioFrase];

    frase = frase.replace("*", assasi.nom);
    frase = frase.replace("+", mort.nom);
    
    content = frase;
    
    llistaVius[posicioAssasi].baixes++;
    
    
    llistaMorts.push(mort);
    llistaVius.splice(posicioMort,1);
    
    
    // Condicio de victoria

    if ( llistaVius.length <= 1 ) {
        clearInterval(intervalID);
        content += "\nVictòria Royale!!\n" + llistaVius[0].nom + " ha guanyat la Guerra!";
    }

}


function suicidar() {
    content += "SUICIDI\n";

    var suicidat_pos = Math.floor(Math.random() * llistaVius.length);

    suicidat = llistaVius[suicidat_pos];


    // Frase personalitzada

    var posicioFrase = Math.floor(Math.random() * frases_suicidi.length);
    var frase = frases_suicidi[posicioFrase];

    frase = frase.replace("*", suicidat.nom);
    frase = frase.replace("*", suicidat.nom);

    content += frase;

    llistaMorts.push(suicidat);
    llistaVius.splice(suicidat_pos, 1);
}


function doble_kill() {
    // Quan s'executa la redencion, 2 persones que estaven mortes, reviuen
    if (llistaMorts.length < 2) {
        rondaEspecial();
    }

    content += "DOBLE KILL\n";

    var mort1 = Math.floor( Math.random() * llistaVius.length );
    var mort2 = Math.floor( Math.random() * llistaVius.length );
    var assasi = Math.floor( Math.random() * llistaVius.length );


    while (mort1 === mort2 || mort1 === assasi || mort2 === assasi) {
        mort1 = Math.floor( Math.random() * llistaVius.length );
        mort2 = Math.floor( Math.random() * llistaVius.length );
        assasi = Math.floor( Math.random() * llistaVius.length );
    }

    var nomAssasi = llistaVius[assasi].nom;
    var nom1 = llistaVius[mort1].nom;
    var nom2 = llistaVius[mort2].nom;


    // Frase personalitzada

    var posicioFrase = Math.floor(Math.random() * frases_doble_baixa.length);
    var frase = frases_doble_baixa[posicioFrase];

    frase = frase.replace("*", nomAssasi);
    frase = frase.replace("+", nom1);
    frase = frase.replace("=", nom2);

    content += frase;

    // content += llistaVius[assasi].nom + " ha matat a 2 persones! " + nom1 + " i " + nom2;

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


function redencion() {

    // Quan s'executa la redencion, 2 persones que estaven mortes, reviuen
    if (llistaMorts.length < 2) {
        rondaEspecial();
    }

    content += "REDENCIÓ\n";

    var resucitat1 = Math.floor( Math.random() * llistaMorts.length );
    var resucitat2 = Math.floor( Math.random() * llistaMorts.length );

    while (resucitat1 === resucitat2) {
        resucitat2 = Math.floor( Math.random() * llistaMorts.length );
    }

    var nom1 = llistaMorts[resucitat1].nom;
    var nom2 = llistaMorts[resucitat2].nom;

    content += "Han resucitat 2 persones! " + nom1 + " i " + nom2;

    llistaVius.push(llistaMorts[resucitat1]);
    llistaMorts.splice(resucitat1, 1);

    if (resucitat2 > resucitat1) {
        resucitat2--;
    }

    llistaVius.push(llistaMorts[resucitat2]);
    llistaMorts.splice(resucitat2, 1);
}


function resucitar() {

    // En el cas de que algun jugador hagi de resucitar s'esculleix aleatoriament i es mou d'una llista a l'altra
    if (llistaMorts.length < 1) {
        rondaEspecial();
    }

    var resucitatPosicio = Math.floor(Math.random() * llistaMorts.length);
    var resucitat = llistaMorts[resucitatPosicio];
    content += resucitat.nom + " " + resucitat.alias + "ha reviscut!!!";
    
    llistaVius.push(resucitat);
    llistaMorts.splice(resucitatPosicio, 1);
}
   

function montarFitxer() {

    // Montem el fitxer .csv perque Processing el tingui llest per crear les imatges

    if ( llistaVius.length > 1 ) {
        content += "\n" + llistaVius.length + " vius, " + llistaMorts.length + " morts.";
    }

    // Header
    
    var fitxerContent = "Name,Viu,Baixes\n";


    // Llistat dels vius

    for(i = 0; i < llistaVius.length; i++) {
        fitxerContent += llistaVius[i].nom + "," + 1 + "," + llistaVius[i].baixes + "\n";
    }


    // Llistat dels morts

    for(i = 0; i < llistaMorts.length; i++) {
        fitxerContent += llistaMorts[i].nom + "," + 0 + "," + llistaMorts[i].baixes + "\n";
    }


    // Escrivim el contingut al fitxer

    fs.writeFile('image/data.csv', fitxerContent, writed);
    
    function writed (err) {
        if (err) throw err;        
        
        // Fem servir Processing per crear la imatge i la pengem a Twitter
        
        tweetIt();
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
