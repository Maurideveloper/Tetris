
const margenTablero = 20
let regulador_velocidad_teclas = 0

//Setup sale de p5.js (libreria). Sirve para ajustar las propiedades iniciales de nuestros objetos y variables
function setup (){
    createCanvas(900,600) // (eje y , eje x) al revez, matriz de pixeles
    tablero = new Tablero()
    crearMapeoBaseTretriminos()
    tetrimino = new Tetrimino()
     //es importante que no le pongan let, ni var, ni const
    resizeCanvas(
        tablero.ancho+2*margenTablero, 
        tablero.alto+2*margenTablero + tablero.lado_celda
        )
}

//movimiento tetrimino
function keyEventsTetris() {
    //regula la velocidad reiniciando constantemente (return)
    if(millis() - regulador_velocidad_teclas < 200) {
        return
    }
    regulador_velocidad_teclas = millis()
    if(keyIsDown(RIGHT_ARROW)){
        tetrimino.moverDerecha()
    }
    if(keyIsDown(LEFT_ARROW)){
        tetrimino.moverIzquierda()
    }
    if(keyIsDown(DOWN_ARROW)){
        tetrimino.moverAbajo()
    }
    if(keyIsDown(UP_ARROW)){
        tetrimino.girar()
    }
}

//Draw sale de p5.js (libreria). Sirve para bibujos del canvas
function draw (){
    background("lightgray")
    tablero.dibujar()
    tetrimino.dibujar()
    keyEventsTetris()
}

//Dibujo figuras
class Tetrimino {
    //se elige cualquier figura
    constructor (nombre = random(["Z","S","J","L","T","O","I"])) {
        this.nombre = nombre
        let base = tetriminosBase[nombre]
        this.color = base.color
        this.mapa = []
        //posicion del mino - for of
        for (const pmino of base.mapa) {
             //reinicia la posicion del tetrimino, sino hace que el tetrimino agarre el ultimo giro tomado si llega a salir de vuelta. Para esto la copia del mapa
            this.mapa.push(pmino.copy())
            
        }
        this.posicion = createVector(tablero.columnas/2,0)
    }

    moverDerecha(){
        this.posicion.x++
        if (this.movimientoErroneo){
            this.moverIzquierda()
        }
    }

    moverIzquierda(){
        this.posicion.x--
        if (this.movimientoErroneo){
            this.moverDerecha()
        }
    }

    moverArriba(){
        this.posicion.y--
    }

    moverAbajo(){
        this.posicion.y++
        if (this.movimientoErroneo){
            this.moverArriba()
        }
    }

    

    //para hacer girar un vector tenes que multiplicarlo por 90 grados. De esta manera gira de las 4 maneras.
    girar(){
        //La sentencia sentencia for...of ejecuta un bloque de código para cada elemento de un objeto iterable (en-US), como lo son: String , Array , objetos similares a array (por ejemplo, arguments or NodeList ), TypedArray , Map (en-US), Set e iterables definidos por el usuario.5 ago 2023
        //for - recorre un bloque de código varias veces. for/in - recorre las propiedades de un objeto. for/of - recorre los valores de un objeto iterable. while - recorre un bloque de código mientras se cumple una condición específica.
        for (const pmino of this.mapa) {
            pmino.set(pmino.y,-pmino.x)
            
            if (this.movimientoErroneo){
                this.desgirar()
            }
        }
    }

    desgirar(){
        for (const pmino of this.mapa) {
            pmino.set(-pmino.y,pmino.x)
        }
    }

    get movimientoErroneo () {
        let salioDelTablero = !this.estaDentroDelTablero
        return salioDelTablero
    }

    //get – una función sin argumentos, que funciona cuando se lee una propiedad, set – una función con un argumento, que se llama cuando se establece la propiedad, enumerable – lo mismo que para las propiedades de datos, configurable – lo mismo que para las propiedades de datos.

    get estaDentroDelTablero() {
        for (const pmino of this.mapaTablero) {
            if (pmino.x<0) { //evita por izquierda
                return false
            }
            if (pmino.x >= tablero.columnas) { //evita por izquierda
                return false
            }
            if (pmino.y >= tablero.filas) { //evita por abajo
                return false
            }
        }
        return true
    }

    //posicion de la figura
    get mapaTablero() {
        let retorno = []
        for (const pmino of this.mapa) {
            let copy = pmino.copy().add(this.posicion)
            retorno.push(copy)
        }
        return retorno
    }


    get mapaCanvas() {
        let retorno = []
        for (const pmino of this.mapa) {
            let copy = pmino.copy().add(this.posicion)
            retorno.push(tablero.coordenada(copy.x,copy.y))
        }
        return retorno
    }


    //Se encarga del porcesamiento logico del dibujo de este objeto
    dibujar() {
        push()
        fill(this.color)
        for (const pmino of this.mapaCanvas) {
            rect (pmino.x, pmino.y, tablero.lado_celda)
            //Efecto de brillo en diagonal. Optimiza
            push()
            noStroke()
            fill(255,255,255,110)
            beginShape()
            vertex(pmino.x, pmino.y)
            vertex(pmino.x+tablero.lado_celda, pmino.y)
            vertex(pmino.x+tablero.lado_celda, pmino.y+tablero.lado_celda)
            endShape(CLOSE)
            pop()
        }
        pop()
    }
}