const internalStorage = false;
let listadoLibros = [];
let listadoClientes = [];
let listadoPrestamos = [];
let prestamoActual = null;

function esMasViejaQueUnaSemana(fecha) {
    const unaSemanaAtras = new Date();
    unaSemanaAtras.setDate(unaSemanaAtras.getDate() - 7);

    return fecha < unaSemanaAtras;
}

async function mostrarPrestamos() {
    let response = await fetch('http://localhost:3000/prestamos/');
    let prestamos = await response.json();
    let tablaPrestamos = document.getElementById('divPrestamos');
    var html = ""
    prestamos.forEach(prestamo => {
        html += `
        <tr>	
            <td class="${prestamo.fecha_devolucion ? 'bg-success' : (
                esMasViejaQueUnaSemana(new Date(prestamo.fecha_prestamo)) ? 'bg-danger' : 'bg-warning'
            )
            }">${prestamo.id}</td>
            <td>${prestamo.id_cliente}</td>
            <td>${prestamo.id_libro}</td>
            <td>${new Date(prestamo.fecha_prestamo).toLocaleDateString()}</td>
            <td>${prestamo.fecha_devolucion ?
                new Date(prestamo.fecha_devolucion).toLocaleDateString() :
                "No devuelto"
            }</td>
            <td>
                <button class="btn btn-sm" onclick="window.location.href = 'agregarPrestamo.html?idPrestamo=${prestamo.id}'">
                    <lord-icon
                        src="https://cdn.lordicon.com/ghhwiltn.json"
                        trigger="hover"
                        stroke="light"
                        colors="primary:#121331,secondary:#a866ee"
                        style="width:40px;height:40px">
                    </lord-icon>
                </button>
                <button class="btn btn-sm" onclick="eliminarPrestamo('${prestamo.id}')">
                    <lord-icon
                        src="https://cdn.lordicon.com/xekbkxul.json"
                        trigger="hover"
                        style="width:40;height:40px">
                    </lord-icon>
                </button>
                <button class="btn btn-sm" onclick="saldarPrestamo('${prestamo.id}')">
                    <lord-icon
                        src="https://cdn.lordicon.com/gkagksfn.json"
                        trigger="hover"
                        colors="primary:#66a1ee,secondary:#121331"
                        style="width:40px;height:40px">
                    </lord-icon>
                </button>
            </td> 
        </tr>
        `
    })
    tablaPrestamos.innerHTML = html
}

async function mostrarLibros() {
    let select = document.getElementById("selectLibros")
    let html = "";
    listadoLibros.forEach(libro => {
        html += `
            <option value="${libro.id}">${libro.titulo}</option>prestamo
        `
    });
    select.innerHTML = html
}

async function traerLibros() {
    if (!internalStorage) {
        let response = await fetch('http://localhost:3000/libros/');
        libros = await response.json()
        listadoLibros = libros
    } else {
        
    }
    console.log('termine de traer')
}

async function traerClientes() {
    if (!internalStorage) {
        let response = await fetch('http://localhost:3000/clientes/');
        clientes = await response.json()
        listadoClientes = clientes;
    } 
    console.log('termine de traer')
}

async function mostrarClientes() {
    let tablaClientes = document.getElementById('selectClientes')
    var html = ""
    listadoClientes.forEach(cliente => {
        html += `
            <option value=${cliente.id}>${cliente.dni_cliente} - ${cliente.nombres}</option>
        `
    })
    tablaClientes.innerHTML = html
}

async function agregarPrestamo() {
    let id_cliente = document.getElementById("selectClientes").value
    let id_libro = document.getElementById("selectLibros").value
    let fecha_prestamo = new Date().toISOString()
    let fecha_devolucion = null
    try {
        let response = await fetch('http://localhost:3000/prestamos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_cliente,
                id_libro,
                fecha_prestamo,
                fecha_devolucion
            }),
        });
        if (response.status !== 201) {
            throw Error('Error al agregar el prestamo');
        }

        Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'Exito al agregar el prestamo :)'
        });

        setTimeout(function () {
            window.location.href = 'prestamos.html';
        }, 2000);
    }

    catch {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al agregar el prestamo :('
        });
        ;
    }
}

async function traerPrestamo(id) {
    let response = await fetch('http://localhost:3000/prestamos/' + id);
    let prestamo = await response.json();
    if(document.getElementById('selectLibros')){
        document.getElementById('selectLibros').value = prestamo.id_libro;
        document.getElementById('selectClientes').value = prestamo.id_cliente;
    }
    prestamoActual = prestamo;
}

async function submitPrestamo(id) {
    if (id == null) {
        agregarPrestamo();
    } else {
        editarPrestamo(id);
    }
}

async function editarPrestamo(id) {
    try {
        let id_libro = document.getElementById('selectLibros').value;
        let id_cliente = document.getElementById('selectClientes').value;
        let fecha_prestamo = prestamoActual.fecha_prestamo
        let fecha_devolucion = prestamoActual.fecha_devolucion
        let response = await fetch(`http://localhost:3000/prestamos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_libro,
                id_cliente,
                fecha_prestamo,
                fecha_devolucion,
            })
        });
        Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'Exito al editar el prestamo :)'
        });

        setTimeout(function () {
            window.location.href = 'prestamos.html';
        }, 2000);
    } catch (e) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al editar Prestamo :('
        });
    }
}
async function eliminarPrestamo(id){
    try {
        let response = await fetch(`http://localhost:3000/prestamos/${id}`, {
            method: 'DELETE'
        });

        if (response.status !== 200) {
            throw 'error'
        }
        Swal.fire({
            icon: 'success',
            title: 'EXITO',
            text: 'El prestamo ha sido eliminado correctamente'
        });
        mostrarPrestamos();
    }
    catch {
        Swal.fire('Error', 'No se pudo eliminar el prestamo', 'error');
    }
}
async function saldarPrestamo(id){
    await traerPrestamo(id);
    let prestamo = prestamoActual;
    try {
        let id_libro = prestamo.id_libro;
        let id_cliente = prestamo.id_cliente;
        let fecha_prestamo = prestamo.fecha_prestamo
        let fecha_devolucion = new Date().toISOString()
        let response = await fetch(`http://localhost:3000/prestamos/${prestamo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_libro,
                id_cliente,
                fecha_prestamo,
                fecha_devolucion,
            })
        });
        Swal.fire({
            icon: 'success',
            title: 'Exito!',
            text: 'este cliente ya hizo la devolucion :)'
        });

        mostrarPrestamos()
    } catch (e) {
        console.error(e)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al editar Prestamo :('
        });
    }
}