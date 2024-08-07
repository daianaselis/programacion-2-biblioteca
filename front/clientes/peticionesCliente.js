

async function eliminarCliente(id) {
    try {
        let response = await fetch(`http://localhost:3000/clientes/${id}`, {
            method: 'DELETE'
        });

        if (response.status !== 200) {
            throw 'error'
        }
        Swal.fire({
            icon: 'success',
            title: 'Cliente Eliminado',
            text: 'El cliente ha sido eliminado correctamente'
        });
        mostrarClientes();
    }
    catch {
        Swal.fire('Error', 'No se pudo eliminar al cliente', 'error');
    }
}

async function editarCliente(id) {
    try{
        let nombres = document.getElementById('nombres').value;
        let dni_cliente = document.getElementById('dni_cliente').value;
        let direccion = document.getElementById('direccion').value;
        let telefono = document.getElementById('telefono').value;
        let response = await fetch(`http://localhost:3000/clientes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombres: nombres,
                dni_cliente: dni_cliente,
                direccion: direccion,
                telefono: telefono
            })
        });

        setTimeout(function () {
            window.location.href = 'clientes.html';
        }, 2000);
    }catch(e){
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al editar Cliente :('
        });
    }
    
}

async function submitCliente(id){
    if(!id){
        agregarCliente();
    }else{
        editarCliente(id);
    }
}

async function verificarCliente(cliente){
    let response = await fetch('http://localhost:3000/clientes/')
    let listaClientes = await response.json();
    console.log(listaClientes)
    if(listaClientes.filter(c => c.dni_cliente == cliente.dni_cliente).length > 0){
        return false;
    }
    return true;
}

async function agregarCliente() {
    try {
        let nombres = document.getElementById('nombres').value;
        let dni_cliente = document.getElementById('dni_cliente').value;
        let direccion = document.getElementById('direccion').value;
        let telefono = document.getElementById('telefono').value;
        let clienteVerificado = await verificarCliente({
            nombres: nombres,
            dni_cliente: dni_cliente,
            direccion: direccion,
            telefono: telefono
        })
        if(!clienteVerificado){
            Swal.fire({
                icon: 'warning',
                title: 'Esta persona no pasa la verificacion',
                text: 'Vuelve a intentar :('
            });
            return;
        }
        let response = await fetch('http://localhost:3000/clientes/', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombres: nombres,
                dni_cliente: dni_cliente,
                direccion: direccion,
                telefono: telefono
            })
        });
      
        if (response.status !== 201) {
            throw Error('Error al agregar el cliente');
        }

        Swal.fire({
            icon: 'success',
            title: 'Cliente Agregado',
            text: 'Cliente agregado :)'
        });

        setTimeout(function () {
            window.location.href = 'clientes.html';
        }, 2000);
    }

    catch {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error  agregar Cliente :('
        });
        setTimeout(function () {
            window.location.alhref = 'clientes.html';
        }, 2000);
    }
}

async function traerCliente(id){
    let response = await fetch('http://localhost:3000/clientes/'+id);
    let cliente = await response.json();
    document.getElementById('nombres').value=cliente.nombres;
    document.getElementById('dni_cliente').value=cliente.dni_cliente;
    document.getElementById('direccion').value=cliente.direccion;
    document.getElementById('telefono').value = cliente.telefono; 
}


async function mostrarClientes() {
    let response = await fetch('http://localhost:3000/clientes/');
    let clientes = await response.json();
    let tablaClientes = document.getElementById('containerClientes')
    var html = ""
    clientes.forEach(cliente => {
        html += `
        <tr>
            <td>${cliente.id}</td>
            <td>${cliente.nombres}</td>
            <td>${cliente.dni_cliente}</td>
            <td>${cliente.direccion}</td>
            <td>${cliente.telefono}</td>
            <td>
                <button class="btn btn-sm" onclick="window.location.href = 'agregarCliente.html?idCliente=${cliente.id}'">
                    <lord-icon
                        src="https://cdn.lordicon.com/ghhwiltn.json"
                        trigger="hover"
                        stroke="light"
                        colors="primary:#121331,secondary:#a866ee"
                        style="width:40px;height:40px">
                    </lord-icon>
                </button>
                <button class="btn btn-sm" onclick="eliminarCliente('${cliente.id}')">
                    <lord-icon
                        src="https://cdn.lordicon.com/xekbkxul.json"
                        trigger="hover"
                        style="width:40;height:40px">
                    </lord-icon>
                </button>
            </td>
        </tr>
        `
    })
    tablaClientes.innerHTML = html
}
