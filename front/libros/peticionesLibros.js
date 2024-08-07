let listadoLibros = [];
let filtro = "";


async function mostrarLibros() {
    console.log('comenze a mostrar');
    let divLibros = document.getElementById("divLibros");
    let html = '';
    listadoLibros.filter(libro =>
        libro.autor.toLowerCase().includes(filtro.toLowerCase()) ||
        libro.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
        libro.genero.toLowerCase().includes(filtro.toLowerCase()) ||
        libro.editorial.toLowerCase().includes(filtro.toLowerCase()) || 
        libro.año_publicacion.toString().toLowerCase().includes(filtro.toLowerCase())
    ).forEach(libro => {
        html += `
        <div class="col-md-4 mb-4">
            <div class="card">
                <img src="${libro.urlPortada}" class="card-img-top" alt="${libro.titulo}" height="400px">
                <div class="card-body">
                    <h5 class="card-title">${libro.titulo}</h5>
                    <p class="card-text">Autor: ${libro.autor} </p>
                    <p>Editorial: ${libro.editorial}</p>
                    <p>Año de publicacion: ${libro.año_publicacion} </p>
                    <p>Genero: ${libro.genero}</p>
                   
                </div>
            </div>
        </div>
        `
    });
    divLibros.innerHTML = html
    
}
async function traerLibros(){
    if(!internalStorage){
        let response = await fetch('http://localhost:3000/libros/');
        libros = await response.json()
        listadoLibros = libros
    }
}

async function buscarLibros(stringBusqueda) {
    filtro = stringBusqueda;
    await mostrarLibros();
}