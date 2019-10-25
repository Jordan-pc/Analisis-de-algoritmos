var minimo = 1;
var maximo = 300;
var abajo = {x: 0, y:-1};
var arriba = {x: 0, y: 500};
var derecha = {x: -1, y:0};
var izquierda = {x:500, y:0};
var last = {x:0, y:0}

//Funcion que genera los puntos aleatorios
function numerosAleatorios(){
    puntos = new Array();
    let CantidadNumeros = document.getElementById("cantidad_puntos").value;
    for (let i = 0; i<CantidadNumeros; i++){
        let punto = {x: minimo + Math.floor(Math.random()*(maximo-minimo)), y: minimo + Math.floor(Math.random()*(maximo-minimo))}
        last = punto;
        puntos.push(punto);
        if (punto.x===izquierda.x && punto.y<izquierda.y) {
            izquierda = punto;
        }
        if (punto.x < izquierda.x) {
            izquierda = punto;
        }
        if (punto.x===derecha.x && punto.y>derecha.y) {
            derecha = punto;
        }
        if (punto.x > derecha.x) {
            derecha = punto;
        }
        if (punto.y===arriba.y && punto.x>arriba.y) {
            arriba = punto;
        }
        if (punto.y < arriba.y) {
            arriba = punto;
        }
        if (punto.y===abajo.y && punto.x<abajo.y) {
            abajo = punto;
        }
        if (punto.y > abajo.y) {
            abajo = punto;
        }
    }
    console.log(arriba,abajo,izquierda,derecha,last);
}
//funcion para dibujar puntos
function dibujar_punto(dibujo, punto, color) {
	dibujo.save();
	dibujo.fillStyle = color;
	dibujo.beginPath();
	dibujo.arc(punto.x, punto.y, 2, 0, Math.PI*2, true); 
	dibujo.closePath();
	dibujo.fill();
	dibujo.restore();
}
//funcion para crear el cuadro y modificarlo
function dibujar(can){
    let canvas = document.getElementById(can);
    let dibujo = canvas.getContext("2d");
    dibujo.save();
    dibujo.setTransform(1, 0, 0, 1, 0, 0); //crear cuadro 
    dibujo.clearRect(0, 0, canvas.width, canvas.height); // limpiar cuadro
    dibujo.restore();
    for (let i=0; i<puntos.length; i++) {
		dibujar_punto(dibujo, puntos[i], "rgba(0,0,255,255)");
	}
}
// toma el botón generar y dibuja los cuadros con los puntos generados
let boton_generar = document.getElementById("generar");
boton_generar.addEventListener('click',()=>{
    abajo = {x: 0, y:-1};
    arriba = {x: 0, y: 500};
    derecha = {x: -1, y:0};
    izquierda = {x:500, y:0};

    numerosAleatorios();
    dibujar("canvas");
    dibujar("canvas1");
    dibujar("canvas2");
});

//Graham - Método de graham
let Graham = function(){
    this.comparar = function (primero,segundo){
        if (primero.x < segundo.x) {
            return -1;
        }
        else if (primero.x > segundo.x) {
            return 1;
        }
        else if (primero.y < segundo.y) {
            return -1;
        }
        else{
            return 1;
        }
    }
    this.ordenar = function (puntos){
        let nuevos_puntos = puntos.slice();
        nuevos_puntos.sort(this.comparar);
        return this.realizar(nuevos_puntos);
    }
    this.realizar = function (puntos){
        if(puntos.length<3){
            return;
        }
        let rutasuperior = new Array(); //calculo de ruta superior
        for(let i = 0; i<puntos.length; i++){
            let a = puntos[i];
            while(rutasuperior.length >= 2){
                let b = rutasuperior[rutasuperior.length-1];
                let c = rutasuperior[rutasuperior.length-2];
                if ((b.x - c.x)*(a.y - c.y) >= (b.y - c.y)*(a.x - c.x)) {  //determinante
                    rutasuperior.pop();
                }
                else{
                    break;
                }
            }
            rutasuperior.push(a);
        }
        rutasuperior.pop();
        let rutainferior = new Array(); //calculo ruta inferior
        for(let i = puntos.length - 1; i >= 0; i--){
            let a = puntos[i];
            while(rutainferior.length >= 2){
                let b = rutainferior[rutainferior.length-1];
                let c = rutainferior[rutainferior.length-2];
                if ((b.x - c.x)*(a.y - c.y) >= (b.y - c.y)*(a.x - c.x)) {  //determinante
                    rutainferior.pop();
                }
                else{
                    break;
                }
            }
            rutainferior.push(a);
        }
        rutainferior.pop();
        return rutasuperior.concat(rutainferior);
    }
}
//fin graham

// funcion que dibuja el resultado del método de graham
function dibujar_graham(){
    let canvas = document.getElementById("canvas");
    let dibujo = canvas.getContext("2d");
    let grah = new Graham();
    let pts = grah.ordenar(puntos);
    console.log(pts);
    if(pts.length > 2){
        dibujo.beginPath();
        dibujo.moveTo(pts[0].x,pts[0].y);
        for(let i = 0; i<pts.length; i++){
            dibujo.lineTo(pts[i].x, pts[i].y);
        }
        dibujo.closePath();
        dibujo.fillStyle = "rgba(200, 0, 0, 0.2)";
        dibujo.strokeStyle = "rgba(0, 0, 0, 0.5)";
        dibujo.fill();
        dibujo.stroke();
        for (let i=0; i<pts.length; i++) {
			dibujar_punto(dibujo, pts[i], "rgba(200, 0, 0, 0.8)");
		}
    }
}
//hace que el botón del método graham llame al objeto que realiza los calculos
let boton_graham = document.getElementById("graham");
boton_graham.addEventListener('click',()=>{
    dibujar_graham();
});

//Envolvente - Realiza el método envolvente
envolvente = function(){
    this.pendiente = function(primero,segundo){ //pendiente
        return (segundo.y-primero.y)/(segundo.x-primero.x);
    }
    this.comparar_eje1= function (primero,segundo){
        if (primero.x < segundo.x) {
            return -1;
        }
        else if (primero.x > segundo.x) {
            return 1;
        }
        else if (primero.y < segundo.y) {
            return -1;
        }
        else{
            return 1;
        }
    }
    this.comparar_eje2= function (primero,segundo){
        if (primero.x < segundo.x) {
            return -1;
        }
        else if (primero.x > segundo.x) {
            return 1;
        }
        else if (primero.y < segundo.y) {
            return -1;
        }
        else{
            return 1;
        }
    }
    this.ordenar = function(puntos,eje){
        return puntos.sort(eje);
    }
    this.realizar = function(puntos){
        if (puntos.length<3) {
            return;
        }
        let rutaizq_arrib = new Array();
        rutaizq_arrib.push(izquierda);
        let rutaarr_der = new Array();
        rutaarr_der.push(arriba);
        let rutader_abaj = new Array();
        rutader_abaj.push(derecha);
        let rutaabaj_izq = new Array();
        rutaabaj_izq.push(abajo);
        for(let i = 0; i<puntos.length; i++){
            if ((this.pendiente(izquierda,puntos[i])<this.pendiente(izquierda,arriba)) && izquierda.y>puntos[i].y && arriba.x>puntos[i].x) {
                rutaizq_arrib.push(puntos[i]);
            }
            if ((this.pendiente(arriba,puntos[i])<this.pendiente(arriba,derecha)) && derecha.y>puntos[i].y && arriba.x<puntos[i].x) {
                rutaarr_der.push(puntos[i]);
            }
            if ((this.pendiente(derecha,puntos[i])<this.pendiente(derecha,abajo)) && derecha.y<puntos[i].y && abajo.x<puntos[i].x) {
                rutader_abaj.push(puntos[i]);
            }
            if ((this.pendiente(abajo,puntos[i])<this.pendiente(abajo,izquierda)) && izquierda.y<puntos[i].y && abajo.x>puntos[i].x) {
                rutaabaj_izq.push(puntos[i]);
            }
        }
        rutaizq_arrib.push(arriba);
        rutaarr_der.push(derecha);
        rutader_abaj.push(abajo);
        rutaabaj_izq.push(izquierda);
        this.ordenar(rutaizq_arrib,this.comparar_eje1);
        let ruta = new Array();
        let ruta2 = new Array();
        let ruta3 = new Array();
        let ruta4 = new Array();
        for(let i = 0; i<rutaizq_arrib.length; i++){ //calcula la ruta del eje 1
            let a = rutaizq_arrib[i];
            while(ruta.length >= 2){
                let b = ruta[ruta.length-1];
                let c = ruta[ruta.length-2];
                if ((b.x - c.x)*(a.y - c.y) <= (b.y - c.y)*(a.x - c.x)) {  //determinante
                    ruta.pop();
                }
                else{
                    break;
                }
            }
            ruta.push(a);
        }
        this.ordenar(rutaarr_der,this.comparar_eje2);
        for(let i = 0; i<rutaarr_der.length; i++){ //calcula la ruta del eje 2
            let a = rutaarr_der[i];
            while(ruta2.length >= 2){
                let b = ruta2[ruta2.length-1];
                let c = ruta2[ruta2.length-2];
                if ((b.x - c.x)*(a.y - c.y) <= (b.y - c.y)*(a.x - c.x)) {  //determinante
                    ruta2.pop();
                }
                else{
                    break;
                }
            }
            ruta2.push(a);
        }
        this.ordenar(rutader_abaj,this.comparar_eje2);
        for(let i = 0; i<rutader_abaj.length; i++){ //calcula la ruta del eje 3
            let a = rutader_abaj[i];
            while(ruta3.length >= 2){
                let b = ruta3[ruta3.length-1];
                let c = ruta3[ruta3.length-2];
                if ((b.x - c.x)*(a.y - c.y) >= (b.y - c.y)*(a.x - c.x)) {  //determinante
                    ruta3.pop();

                }
                else{
                    break;
                }
            }
            ruta3.push(a);
        }
        this.ordenar(rutaabaj_izq,this.comparar_eje1);
        for(let i = 0; i<rutaabaj_izq.length; i++){ //calcula la ruta del eje 4
            let a = rutaabaj_izq[i];
            while(ruta4.length >= 2){
                let b = ruta4[ruta4.length-1];
                let c = ruta4[ruta4.length-2];
                if ((b.x - c.x)*(a.y - c.y) >= (b.y - c.y)*(a.x - c.x)) {  //determinante
                    ruta4.pop();
                }
                else{
                    break;
                }
            }
            ruta4.push(a);
        }

        let rev1 = ruta3.reverse();
        let rev2 = ruta4.reverse();
        return ruta.concat(ruta2.concat(rev1.concat(rev2)));
    }
}
//fin envolvente
//funcion que dibuja el resultado final del método envolvente
function dibujar_envolvente(){
    let canvas = document.getElementById("canvas1");
    let dibujo = canvas.getContext("2d");
    let env = new envolvente();
    let pts = env.realizar(puntos);
    console.log(pts);
    if(pts.length > 2){
        dibujo.beginPath();
        dibujo.moveTo(pts[0].x,pts[0].y);
        for(let i = 0; i<pts.length; i++){
            dibujo.lineTo(pts[i].x, pts[i].y);
        }
        dibujo.closePath();
        dibujo.fillStyle = "rgba(200, 0, 0, 0.2)";
        dibujo.strokeStyle = "rgba(0, 0, 0, 0.5)";
        dibujo.fill();
        dibujo.stroke();
        for (let i=0; i<pts.length; i++) {
			dibujar_punto(dibujo, pts[i], "rgba(200, 0, 0, 0.8)");
		}
    }
}
//botón que llama al metodo envolvente
let boton_envolvente = document.getElementById("envolvente");
boton_envolvente.addEventListener('click',()=>{
    dibujar_envolvente();
});
//Péndulo - método del péndulo
pendulo = function(){
    this.pendiente = function(primero,segundo){ //calculo de la pendiente
        return (segundo.y-primero.y)/(segundo.x-primero.x);
    }
    this.realizar = function(puntos){
        if (puntos.length<3) {
            return;
        }
        let ruta = new Array();
        //ruta.push(last);
        let eje1 = 0;
        let punto = last;
        while(eje1<puntos.length){ //péndulo desde punto aleatorio hasta punto más alto
            eje1 = 0;
            let añadir = Infinity;
            for (let i = 0; i<puntos.length; i++){
                if (this.pendiente(last,puntos[i])<=añadir && puntos[i].x >= last.x && puntos[i].y <= last.y) {
                    añadir = this.pendiente(last,puntos[i]);
                    punto = puntos[i];
                    eje1--;
                }
                eje1++;
            }
            //ruta.push(punto);
            last = punto;
            añadir = Infinity;
        }
        //ruta.push(last);
        let eje2  = 0;
        while(eje2<puntos.length){ //péndulo desde punto aleatorio hasta punto más a la derecha
            eje2 = 0;
            let añadir = Infinity;
            for (let i = 0; i<puntos.length; i++){
                if (this.pendiente(last,puntos[i])<=añadir && puntos[i].x >= last.x && puntos[i].y >= last.y) {
                    añadir = this.pendiente(last,puntos[i]);
                    punto = puntos[i];
                    eje2--;
                }
                eje2++;
            }
            //ruta.push(punto);
            last = punto;
            añadir = Infinity;
        }
        ruta.push(last);
        let eje3 = 0;
        while(eje3<puntos.length){ //péndulo desde la derecha hasta abajo - eje 3
            eje3 = 0;
            let añadir = Infinity;
            for (let i = 0; i<puntos.length; i++){
                if (this.pendiente(last,puntos[i])<=añadir && puntos[i].x <= last.x && puntos[i].y >= last.y) {
                    añadir = this.pendiente(last,puntos[i]);
                    punto = puntos[i];
                    eje3--;
                }
                eje3++;
            }
            ruta.push(punto);
            last = punto;
            añadir = Infinity;
        }
        let eje4 = 0;
        while(eje4<puntos.length){ //péndulo desde abajo hasta la izquierda - eje 4
            eje4 = 0;
            let añadir = Infinity;
            for (let i = 0; i<puntos.length; i++){
                if (this.pendiente(last,puntos[i])<=añadir && puntos[i].x <= last.x && puntos[i].y <= last.y) {
                    añadir = this.pendiente(last,puntos[i]);
                    punto = puntos[i];
                    eje4--;
                    //console.log(añadir , 'menos',punto);
                    if (añadir === -Infinity && punto.x !== izquierda.x && repetir < 5) {
                        añadir = auxiliar2
                        punto = auxiliar1
                        eje4--;
                        //console.log('bugfix',añadir,punto);
                        repetir++;
                    }
                }
                var auxiliar1 = punto;
                var auxiliar2 = añadir;
                eje4++;
            }
            repetir = 0;
            ruta.push(punto);
            last = punto;
            añadir = Infinity;
        }
        let rectificar = 0;
        while(rectificar<puntos.length){ //rectificación del eje 1
            rectificar = 0;
            let añadir = Infinity;
            for (let i = 0; i<puntos.length; i++){
                if (this.pendiente(last,puntos[i])<=añadir && puntos[i].x >= last.x && puntos[i].y <= last.y) {
                    añadir = this.pendiente(last,puntos[i]);
                    punto = puntos[i];
                    rectificar--;
                }
                rectificar++;
            }
            ruta.push(punto);
            last = punto;
            añadir = Infinity;
        }
        rectificar = 0;
        while(rectificar<puntos.length){ //rectificación del eje 2
            rectificar = 0;
            let añadir = Infinity;
            for (let i = 0; i<puntos.length; i++){
                if (this.pendiente(last,puntos[i])<=añadir && puntos[i].x >= last.x && puntos[i].y >= last.y) {
                    añadir = this.pendiente(last,puntos[i]);
                    punto = puntos[i];
                    rectificar--;
                }
                rectificar++;
            }
            ruta.push(punto);
            last = punto;
            añadir = Infinity;
        }
        return ruta;
    }
}
// fin péndulo
// función que dibuja el método péndulo
function dibujar_pendulo(){
    let canvas = document.getElementById("canvas2");
    let dibujo = canvas.getContext("2d");
    let env = new pendulo();
    let pts = env.realizar(puntos);
    console.log(pts);
    if(pts.length > 2){
        dibujo.beginPath();
        dibujo.moveTo(pts[0].x,pts[0].y);
        for(let i = 0; i<pts.length; i++){
            dibujo.lineTo(pts[i].x, pts[i].y);
        }
        dibujo.closePath();
        dibujo.fillStyle = "rgba(200, 0, 0, 0.2)";
        dibujo.strokeStyle = "rgba(0, 0, 0, 0.5)";
        dibujo.fill();
        dibujo.stroke();
        for (let i=0; i<pts.length; i++) {
			dibujar_punto(dibujo, pts[i], "rgba(200, 0, 0, 0.8)");
		}
    }
}
//botón que llama a la función que dibuja el resultado del método péndulo
let boton_pendulo = document.getElementById("pendulo");
boton_pendulo.addEventListener('click',()=>{
    dibujar_pendulo();
});