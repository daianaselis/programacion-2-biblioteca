async function login() {
    try {
        let email = document.getElementById("inputEmail").value;
        let password = document.getElementById("inputPassword").value;

        let response = await fetch('http://localhost:3000/usuarios/' + email);
        if (response.status != 200) {
            console.log(response)
            throw 'error';
        }
        let usuario = await response.json()
        if (usuario.password == password && usuario.id == email) {
            window.location = "inicio.html";
        }
        else {
            console.log(usuario)
            throw 'error';
        }
    }
    catch (e) {
        console.error(e)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'USUARIO INVALIDO :('
        });
        
    }
}



