//Modelo del trablero del juego, empieza una T mayus para identificar clases y no una variable.
class Tablero {
    constructor() {
        this.columnas = 10 //ancho
        this.filas = 20 //largo
        this.lado_celda = 25 //pixeles
        this.ancho = this.columnas*this.lado_celda
        this.alto = this.filas*this.lado_celda
        this.posicion = createVector(margenTablero,margenTablero+this.lado_celda)//cambia la posicion del tablero
    }
    
    //Transformacion no lineal, donde se aplica un escalamiento (multiplicacion) para el ajuste de las medidas y una translacion (suma) para el ajuste de las posiciones
    coordenada(x,y) {
        return createVector(x,y).mult(this.lado_celda).add(this.posicion)
    }

    //Se encarga del procesamiento logico, para detectar las posiciones del tablero
    dibujar() {
        push() //guarda el estado grafico y permite modificarlo
        noStroke() //no dibuja el borde de los rectangulos
        for (let columna = 0; columna < this.columnas; columna++) {
            for (let fila = 0; fila < this.filas; fila++){
                if ((columna+fila)%2==0){
                    fill('Teal')
                }
                else {
                    fill('Aqua')
                }
                let c = this.coordenada(columna, fila)
                rect(c.x, c.y, this.lado_celda)
            }
        }
        pop()
    }
}