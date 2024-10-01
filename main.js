function start() {

    //henter længderne fra html formen
    var LaengdeForm = document.getElementById("LaengdeForm");
    
    //henter vinklerne fra html formen
    var VinkelForm = document.getElementById("VinkelForm");
    
    for (var i = 0; i < 3; i++) { //enable inputs
        LaengdeForm.elements[i].disabled = false;
        VinkelForm.elements[i].disabled = false;
    }
    //Defininere variablerne. Henter variabler, og tager kun de første 3 variabler
    var l = new Array(LaengdeForm.elements[0].value, LaengdeForm.elements[1].value, LaengdeForm.elements[2].value);
    var a = new Array(VinkelForm.elements[0].value, VinkelForm.elements[1].value, VinkelForm.elements[2].value);
    //Gør det her sålænge i er mindre end l
    for (var i = 0; i < 3; i++) { //Laver det om til tal
        if (!!l[i]) { l[i] = parseFloat(l[i]); }
        if (!!a[i]) { a[i] = parseFloat(a[i]); }
    }

    for (var i = 0; i < 3; i++) { //Sletter gamle outputs, og sætter
        outputForm.elements[i].value = 0;
        outputForm.elements[i + 3].value = 0;
    }

    //henter canvaset + canvas info fra html
    var canvas = document.getElementById("canvas");
    //bredde=x, højde=y
    var canvasSizes = new Array(+canvas.getAttribute("width"), +canvas.getAttribute("height"));
    var ctx = canvas.getContext("2d"); //Tegne på canvas

    //Graffik design/font
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#000000";
    ctx.font = "30px Arial";

    //
    if (trueLength(a) + trueLength(l) < 3) { //Tjek for 3 værdier
        ctx.clearRect(0, 0, canvasSizes[0], canvasSizes[1]);
        ctx.fillText("Ikke nok data", canvasSizes[0] / 2, canvasSizes[1] / 2);
        setTimeout(start, 100); //Starter forfra
        return;
    }
    //Låser for inputs, når der er 3 værdier
    for (var i = 0; i < 3; i++) { //disable inputs
        if (!l[i]) { LaengdeForm.elements[i].disabled = true; }
        if (!a[i]) { VinkelForm.elements[i].disabled = true; }
    }

    if (trueLength(l) < 1) { //Tjek for 1 side
        ctx.clearRect(0, 0, canvasSizes[0], canvasSizes[1]);
        ctx.fillText("Not enough lengths, minimum 1", canvasSizes[0] / 2, canvasSizes[1] / 2);
        setTimeout(start, 100); //Starter forfra
        return;
    }

    for (var i = 0; i < 3; i++) { //Konvertere til radianer fordi Javascript regner i radianer
        if (!!a[i]) { a[i] = toRadians(a[i]); }
    }

    var solved = false; //Ikke løst
    var loops = 0;
    var maxLoops = 10; //Variable så den ikke kan gå i loop

    //finder manglende info
    while (!solved) {
        loops++;
        if (loops > maxLoops) {
            ctx.clearRect(0, 0, canvasSizes[0], canvasSizes[1]);
            ctx.fillText("Forkert data", canvasSizes[0] / 2, canvasSizes[1] / 2);
            setTimeout(start, 100);
            return;
        }

        ctx.clearRect(0, 0, canvasSizes[0], canvasSizes[1]);
        ctx.fillText("Tænker", canvasSizes[0] / 2, canvasSizes[1] / 2);
        //Hvis vi kender 3 sider
        if (trueLength(l) == 3) {
            a[0] = Math.acos(((- l[0] * l[0] + l[1] * l[1] + l[2] * l[2]) / (2 * l[1] * l[2]))); //Isoleret for a
            a[1] = Math.acos(((+ l[0] * l[0] - l[1] * l[1] + l[2] * l[2]) / (2 * l[0] * l[2]))); //Isoleret for b
            a[2] = Math.acos(((+ l[0] * l[0] + l[1] * l[1] - l[2] * l[2]) / (2 * l[1] * l[0]))); //Isoleret for c

            if (trueLength(a)!=3) { //Hvis en af de tre vinkler er en falsk værdi, fordi Math.acos ikke kunne finde en gyldig løsning
                ctx.clearRect(0, 0, canvasSizes[0], canvasSizes[1]);
                ctx.fillText("Forkert data", canvasSizes[0] / 2, canvasSizes[1] / 2);
                setTimeout(start, 100);
                return;
            }

            solved = true; //Løst trekant
        }

        //Hvis vi kender 2 vinkler og (1 side)
        if (trueLength(a) == 2) {
            //Find 3 vinkel (180 graders regel)
            //Hvis vi mangler A
            if (!a[0]) {
                a[0] = (Math.PI) - (a[1] + a[2]);
                console.log("Debug: " + a[0]);
            }

            //Hvis vi mangler B
            else if (!a[1]) {
                a[1] = (Math.PI) - (a[0] + a[2]);
            }

            //Hvis vi mangler C
            else if (!a[2]) {
                a[2] = (Math.PI) - (a[0] + a[1]);
            }

            //Sinusrelationerne derefter
            //Hvis vi kender side a
            if (!!l[0]) {
                l[1] = (Math.sin(a[1]) * l[0]) / Math.sin(a[0]);
                l[2] = (Math.sin(a[2]) * l[0]) / Math.sin(a[0]);
            }

            //Hvis vi kender side b
            if (!!l[1]) {
                l[0] = (Math.sin(a[0]) * l[1]) / Math.sin(a[1]);
                l[2] = (Math.sin(a[2]) * l[1]) / Math.sin(a[1]);
            }

            //Hvis vi kender side c
            if (!!l[2]) {
                l[0] = (Math.sin(a[0]) * l[2]) / Math.sin(a[2]);
                l[1] = (Math.sin(a[1]) * l[2]) / Math.sin(a[2]);
            }

            solved = true; //Trekant løst
        }

        //Hvis vi kender 2 sider og (1 vinkel)
        if (trueLength(l) == 2) {
            //Hvis vi ikke har nogle side og vinkelpar https://www.mathsisfun.com/algebra/trig-solving-sas-triangles.html (Ingen side & vinkelpar)
            if (!(!!l[0] && !!a[0]) && !(!!l[1] && !!a[1]) && !(!!l[2] && !!a[2])) { //Tjekker om der ikke er matchende længder og vinkler
                //Hvis vi mangler side a
                if (!l[0]) {
                    l[0] = Math.sqrt(l[1] * l[1] + l[2] * l[2] - 2 * l[1] * l[2] * Math.cos(a[0]));
                }

                //Hvis vi mangler side b
                if (!l[1]) {
                    l[1] = Math.sqrt(l[0] * l[0] + l[2] * l[2] - 2 * l[0] * l[2] * Math.cos(a[1]))
                }

                //Hvis vi mangler side c
                if (!l[2]) {
                    l[2] = Math.sqrt(l[1] * l[1] + l[0] * l[0] - 2 * l[1] * l[0] * Math.cos(a[2]))
                }

                //once we done with this step of sas trekant it has 3 sides and will go that route on next loop
            }
            else {
                //Hvis vi kender 2 sider og 1 vinkel (og der er et par) ssa https://www.mathsisfun.com/algebra/trig-solving-ssa-triangles.html
                //Hvis vi mangler side a (Kan ik finde vinkel a)
                if (!l[0]) {
                    //Hvis vi mangler vinkel b
                    if (!a[1]) {
                        a[1] = Math.asin((l[1] * Math.sin(a[2])) / l[2]);
                    }
                    //Hvis vi mangler vinkel c
                    if (!a[2]) {
                        a[2] = Math.asin((l[2] * Math.sin(a[1])) / l[1]);
                    }
                }

                //Hvis vi mangler side b (Kan ik finde vinkel b)
                if (!l[1]) {
                    //Hvis vi mangler vinkel a
                    if (!a[0]) {
                        a[0] = Math.asin((l[0] * Math.sin(a[2])) / l[2]);
                    }
                    //Hvis vi mangler vinkel c
                    if (!a[2]) {
                        a[2] = Math.asin((l[2] * Math.sin(a[0])) / l[0]);
                    }
                }

                //Hvis vi mangler side c (Kan ik finde vinkel c)
                if (!l[2]) {
                    //Hvis vi mangler vinkel a
                    if (!a[0]) {
                        a[0] = Math.asin((l[0] * Math.sin(a[1])) / l[1]);
                    }
                    //Hvis vi mangler vinkel b
                    if (!a[1]) {
                        a[1] = Math.asin((l[1] * Math.sin(a[0])) / l[0]);
                    }
                }
                //Når loopet er færdigt, kendes nok værdier til at loopet kan starte forfra, og resten af værdierne kan findes 
            }
        }
    }

    //Tegner trekant

    //Skaffer koordinater fra udregninger
    var marginDivisor = 10;
    var coords = new Array();
    var size = min(new Array(canvasSizes[0], canvasSizes[1]));
    var minDVal = size / marginDivisor;
    var maxDVal = 6 * size / marginDivisor;
    var scaler = maxDVal / max(l);
    //Første koordinat
    var point = new Object();
    point.x = minDVal;
    point.y = maxDVal;
    coords[0] = point;
    //Anden koordinat
    var point = new Object();
    point.x = minDVal + l[0] * scaler
    point.y = maxDVal;
    coords[1] = point;
    //Tredje koordinat
    var point = new Object();
    point.x = minDVal + Math.cos(a[1]) * l[2] * scaler;
    point.y = maxDVal - Math.sin(a[1]) * l[2] * scaler;
    coords[2] = point;

    var displacement = { x: 0, y: 0 };
    //Tjekker for forskydning uden for canvas
    for (var i = 0; i < coords.length; i++) {
        if (coords[i].x < 0 /*Tjekker om x-værdi er ude af canvas*/ && 0 - coords[i].x > displacement) { //Tjekker om x er mere ude af canvas end den sidste x-værdi
            displacement.x = 0 - coords[i].x; //Gemmer værdien for hvor meget den er uden for canvas (når vi har været alle igennem så ville det være den x som er mest uden for canvas)
        }
        if (coords[i].y < 0 && 0 - coords[i].y > displacement) {
            displacement.y = 0 - coords[i].y;
        }
    }
    //Hvert koordinat rykkes
    for (var i = 0; i < coords.length; i++) {
        coords[i].x = coords[i].x + displacement.x;
        coords[i].y = coords[i].y + displacement.y;
    }

    //Trekant font/styling
    ctx.fillStyle = "red";
    ctx.strokeStyle = "maroon";
    ctx.lineWidth = 10;
    ctx.clearRect(0, 0, canvasSizes[0], canvasSizes[1]);
    //Starter med at tegne trekant
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    ctx.lineTo(coords[1].x, coords[1].y);
    ctx.lineTo(coords[2].x, coords[2].y);
    ctx.closePath(); //Færdig med at tegne trekant
    ctx.stroke();
    ctx.fill();

    //Skriver værdier på trekanten
    ctx.fillStyle = "black";
    for (var i = 0; i < 3; i++) { //Konverter til grader
        a[i] = toDegrees(a[i]);
    }
    //Find koordinaterne hvor værdierne skal skrives
    ctx.fillText("A: " + a[0].toFixed(3), coords[2].x, coords[2].y);
    ctx.fillText("B: " + a[1].toFixed(3), coords[0].x, coords[0].y);
    ctx.fillText("C: " + a[2].toFixed(3), coords[1].x, coords[1].y);

    ctx.fillText("a: " + l[0].toFixed(3), (coords[0].x + coords[1].x) / 2, (coords[0].y + coords[1].y) / 2);
    ctx.fillText("b: " + l[1].toFixed(3), (coords[1].x + coords[2].x) / 2, (coords[1].y + coords[2].y) / 2);
    ctx.fillText("c: " + l[2].toFixed(3), (coords[2].x + coords[0].x) / 2, (coords[2].y + coords[0].y) / 2);

    for (var i = 0; i < 3; i++) { //Skriver værdierne i Outputs 
        outputForm.elements[i].value = l[i].toFixed(3);
        outputForm.elements[i + 3].value = a[i].toFixed(3);
    }

    //Loop efter 100 ms
    setTimeout(start, 100);
}
//Finder mindste værdi i et array
function min(arr) {
    minVal = arr[0];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < minVal) {
            minVal = arr[i];
        }
    }
    return minVal;
}
//Finder største værdi i et array
function max(arr) {
    maxVal = 0;
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > maxVal) {
            maxVal = arr[i];
        }
    }
    return maxVal;
}
//Omregn til radianer
function toRadians(angle) {
    return angle * (Math.PI / 180);
}
//Omregn til grader
function toDegrees(angle) {
    return angle * (180 / Math.PI);
}
//Retunerer længden af et array uden ugyldige værdier (null, not a number, Tom string osv.)
function trueLength(arr) {
    n = 0;
    for (var i = 0; i < arr.length; i++) {
        if (!!arr[i]) { n++ }
    }
    return n;
}

// Dark mode switch
function switchMode() {
    const body = document.body;
    const button = document.getElementById('toggleMode');

    // Toggle dark-mode class on the body
    body.classList.toggle('dark-mode');

    // Change button text depending on the mode
    if (body.classList.contains('dark-mode')) {
        button.textContent = 'Switch to Light Mode';
    } else {
        button.textContent = 'Switch to Dark Mode';
    }
}
