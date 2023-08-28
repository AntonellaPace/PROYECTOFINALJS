// peticion con async-await
const cargarPasteles = async () => {
    const res = await fetch("pasteles.json")
    const data = await res.json()
    console.log(data)
    for (let pastel of data) {
        let pastelData = new Pastel(pastel.id, pastel.tipo, pastel.precio, pastel.imagen)
        pastelesPush.push(pastelData)
    }
    console.log(pastelesPush)
    localStorage.setItem("pastelesPush", JSON.stringify(pastelesPush))
}


let pastelesDiv = document.getElementById("pasteles")
let btnGuardarPastelBtn = document.getElementById("guardarPastelBtn")
let botonCarrito = document.getElementById("botonCarrito")
let modalBodyCarrito = document.getElementById("modal-bodyCarrito")
let buscador = document.getElementById("buscador")
let botonFinCompra = document.getElementById("botonFinalizarCompra")


class Pastel {
    constructor(id, tipo, precio, imagen) {
        this.id = id,
            this.tipo = tipo,
            this.precio = precio,
            this.imagen = imagen
    }

    mostrarInfoPastel() {
        console.log(`Pastel ${this.tipo}, tiene un precio de ${this.precio}`)
    }

}

let pastelesPush = []

if (localStorage.getItem("pastelesPush")) {
    pastelesPush = JSON.parse(localStorage.getItem("pastelesPush"))
} else {
    cargarPasteles()
}

// array con productoss en carrito
let productosEnCarrito
if (localStorage.getItem("carrito")) {
    productosEnCarrito = JSON.parse(localStorage.getItem("carrito"))
} else {
    //no existe nada en el storage
    productosEnCarrito = []
    localStorage.setItem("carrito", productosEnCarrito)
}


function cargarProductosCarrito(array) {
    modalBodyCarrito.innerHTML = ``
    // primer for each imprimer  card
    array.forEach((productoCarrito) => {
        modalBodyCarrito.innerHTML += `
    
         <div class="card border-primary mb-3" id ="productoCarrito${productoCarrito.id}" style="max-width: 540px;">
                  <img class="card-img-top" src="${productoCarrito.imagen}" alt="">
                  <div class="card-body">
                         <h4 class="card-title">${productoCarrito.tipo}</h4>
                         <p class="card-text">$${productoCarrito.precio}</p> 
                          <button class= "btn btn-danger" id="botonEliminar${productoCarrito.id}"><i class="fas fa-trash-alt"></i></button>
                  </div>    
             </div>
       
    `
    })
    // segundo for each elimina
    array.forEach((productoCarrito) => {
        document.getElementById(`botonEliminar${productoCarrito.id}`).addEventListener("click", () => {
            console.log(`eliminar producto`)
            // borrar del dom
            let cartaproducto = document.getElementById(`productoCarrito${productoCarrito.id}`)
            cartaproducto.remove()
            // borrar del array
            let productoEliminar = array.find((pastel) => pastel.id == productoCarrito.id)
            console.log(productoEliminar)

            let posicion = array.indexOf(productoEliminar)
            console.log(productoEliminar)

            array.splice(posicion, 1)

            localStorage.setItem("carrito", JSON.stringify(array))
            calcularTotal(array)
        })
    })

    calcularTotal(array)
}

function finalizarCompra(array) {
    Swal.fire({
        title: 'Esta seguro de realizar la compra',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Si.',
        cancelButtonText: 'No.',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',

    }).then((result) => {
        if (result.isConfirmed) {
            let totalFinal = calcularTotal(array)
            Swal.fire({
                title: 'Compra realizada',
                icon: 'success',
                confirmButtonColor: 'green',
                text: `Muchas gracias, ha adquirido nuestros pasteles. Deber abonar ${totalFinal} `,
            })
            productosEnCarrito = []
            localStorage.removeItem("carrito")

        } else {
            Swal.fire({
                title: 'Compra no realizada',
                info: 'info',
                text: 'La compra no ha sido realizada, su carrito sigue intacto.',
                confirmButtonColor: 'green',
                timer: 2500
            })
        }
    })
}

function calcularTotal(array) {

    //DOS PARAMETROS: primero la function y segundo valor en el que quiero inicializar el acumulador
    let total = array.reduce((acc, productoCarrito) => acc + productoCarrito.precio, 0)
    // console.log(`El total es ${total}`)
    total == 0 ? precioTotal.innerHTML = `No hay productos en el carrito` : precioTotal.innerHTML = `El total es <strong>${total}</strong>`
return total
}


function mostrarCatalogo() {
    pastelesDiv.innerHTML = ``
    for (let pastel of pastelesPush) {

        let nuevoPastelDiv = document.createElement("div")
        nuevoPastelDiv.className = "col-12 col-md-4 col-lg-4 my-2"
        nuevoPastelDiv.innerHTML = `<div id="${pastel.id}" class="card">
    <img src="${pastel.imagen}" alt="${pastel.tipo}" class="card-img-top img-fluid">
        <div class="card-body">
            <h4 class="card-title">
                <p>${pastel.tipo}</p>
                <p>${pastel.precio}</p>
                <button id="agregarBtn${pastel.id}" class="btn btn-outline-success"> Agregar al carrito</button>
            </h4>
        </div>`
        pastelesDiv.appendChild(nuevoPastelDiv)

        let agregarBtn = document.getElementById(`agregarBtn${pastel.id}`)
        agregarBtn.addEventListener("click", () => {

            agregarAlCarrito(pastel)
        })
    }
}



function agregarAlCarrito(pastel) {
    //preguntar si existe ese pastel en el array
    let pastelAgregado = productosEnCarrito.find((elem) => elem.id == pastel.id)
    //me devuelve sino encuentra undefined, si encuenta el elemento
    if (pastelAgregado == undefined) {
        //código para sumar al array carrito
        productosEnCarrito.push(pastel)
        localStorage.setItem("carrito", JSON.stringify(productosEnCarrito))
        console.log(productosEnCarrito)
    } else {
        //sumar uno a cantidad
        console.log(`El pastel ${pastel.tipo} ya está en el carrito `)
    }
}

btnGuardarPastelBtn.addEventListener("click", function (event) {
    event.preventDefault()
    agregarPastel(pastelesPush)
    console.log(`${pastelesPush}`)
})

// AGREGAR PASTEL PARA DOM
function agregarPastel(array) {
    let tipoPastel = document.getElementById("tipoInput")
    let precioPastel = document.getElementById("precioInput")
    const pastelNuevo = new Pastel(array.length + 1, tipoPastel.value, parseInt(precioPastel.value), "multimedia/pastelnuevo.png")
    array.push(pastelNuevo)
    localStorage.setItem("pastelesPush", JSON.stringify(array))
    mostrarCatalogo(pastelesPush)
}

let stock = (localStorage.getItem("carrito") || `No existen pasteles en el carrito`)

botonCarrito.addEventListener("click", () => {
    cargarProductosCarrito(productosEnCarrito)
})

botonFinCompra.addEventListener("click", () => {
    finalizarCompra(productosEnCarrito)
})

let coincidencia = document.getElementById("coincidencia")
function buscarInfo(buscado, array) {
    let busqueda = array.filter(
        (dato) => dato.tipo.toLowerCase().includes(buscado.toLowerCase())
    ) || dato.id.toLowerCase().includes(buscado.toLowerCase())
    busqueda.length == 0 ?
        (coincidencia.innerHTML = `<h3>No hay coincidencias con la búsqueda ${buscado}</h3>`,
            mostrarCatalogo(busqueda)) :
        (coincidencia.innerHTML = "", mostrarCatalogo(busqueda))
}

buscador.addEventListener("input", () => {
    buscarInfo(buscador.value, pastelesPush)
})

mostrarCatalogo(pastelesPush)
