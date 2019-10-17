var minimo = 1;
var maximo = 300;
var abajo = {x: 0, y:-1};
var arriba = {x: 0, y: 500};
var derecha = {x: -1, y:0};
var izquierda = {x:500, y:0};


function numerosAleatorios(){
    puntos = new Array();
    let CantidadNumeros = document.getElementById("cantidad_puntos").value;
    for (let i = 0; i<CantidadNumeros; i++){
        let punto = {x: minimo + Math.floor(Math.random()*(maximo-minimo)), y: minimo + Math.floor(Math.random()*(maximo-minimo))}
        puntos.push(punto);
        if (punto.x < izquierda.x) {
            izquierda = punto;
        }
        if (punto.x > derecha.x) {
            derecha = punto;
        }
        if (punto.y < arriba.y) {
            arriba = punto;
        }
        if (punto.y > abajo.y) {
            abajo = punto;
        }
    }
    console.log(arriba,abajo,izquierda,derecha);
}

function dibujar_punto(dibujo, punto, color) {
	dibujo.save();
	dibujo.fillStyle = color;
	dibujo.beginPath();
	dibujo.arc(punto.x, punto.y, 2, 0, Math.PI*2, true); 
	dibujo.closePath();
	dibujo.fill();
	dibujo.restore();
}

function dibujar(can){
    let canvas = document.getElementById(can);
    let dibujo = canvas.getContext("2d");
    dibujo.save();
    dibujo.setTransform(1, 0, 0, 1, 0, 0); //crear cuadro ?
    dibujo.clearRect(0, 0, canvas.width, canvas.height); // limpiar cuadro
    dibujo.restore();
    for (let i=0; i<puntos.length; i++) {
		dibujar_punto(dibujo, puntos[i], "rgba(0,0,255,255)");
	}
}

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

//Graham

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


function dibujar_graham(){
    let canvas = document.getElementById("canvas");
    let dibujo = canvas.getContext("2d");
    let grah = new Graham();
    let pts = grah.ordenar(puntos);
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

let boton_graham = document.getElementById("graham");
boton_graham.addEventListener('click',()=>{
    dibujar_graham();
});

//envolvente
envolvente = function(){
    this.pendiente = function(primero,segundo){
        return (segundo.y-primero.y)/(segundo.x-primero.x);
    }
    this.realizar = function(puntos){
        if (puntos.length<3) {
            return;
        }
        let rutaizq_arrib = new Array();
        let rutaarr_der = new Array();
        let rutader_abaj = new Array();
        let rutaabaj_izq = new Array();
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
        console.log(rutaizq_arrib);
        console.log(rutaarr_der);
        console.log(rutader_abaj);
        console.log(rutaabaj_izq);
        return rutaabaj_izq;
    }
}

let boton_envolvente = document.getElementById("envolvente");
boton_envolvente.addEventListener('click',()=>{
    let env = new envolvente();
    let point = env.realizar(puntos);
    console.log(point);
});