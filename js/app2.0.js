// Variables
      // UI
      const formulario = document.querySelector('#nueva-cita'),
      contenedorCitas = document.querySelector('#citas'),
      // Inputs
      mascotaInput = document.querySelector('#mascota'),
      propietarioInput = document.querySelector('#propietario'),
      telefonoInput = document.querySelector('#telefono'),
      fechaInput = document.querySelector('#fecha'),
      horaInput = document.querySelector('#hora'),
      sintomasInput = document.querySelector('#sintomas');
let editando;
// Objetos 
const citaObj = {/* Informacion de la cita */
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}
document.addEventListener('DOMContentLoaded', () => {
    ui.imprimirCitas(administrarCitas);
})

// Clases
// Citas
class Citas {
    constructor() {
        this.citas = JSON.parse(localStorage.getItem('arregloCitas')) || [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
        /* Agregar cita a localStorage */
        sincronizarLocalStorage(this.citas);
    }
    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
        sincronizarLocalStorage(this.citas);
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita);
        sincronizarLocalStorage(this.citas);
    }

}   
// UI
class UI {
    imprimirAlerta(mensaje, tipo) {
        /* Crear el div */
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12', 'mensaje');

        /* Agregar clase en base al tipo error */
        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        /* Mensaje de error */
        divMensaje.textContent = mensaje;
        /* Agregar al DOM */
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        /* Quitar la alerta */
        setTimeout(() => {
            divMensaje.remove();
        }, 2000); 
    }
    imprimirCitas({citas}) {
        while(contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas,id} = cita;
            
            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            /* Scripting de los elementos de la cita */
            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
            <span class="font-weight-bolder">Propietario:</span> ${propietario} 
            `;
            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
            <span class="font-weight-bolder">Telefono:</span> ${telefono} 
            `;
            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
            <span class="font-weight-bolder">Fecha:</span> ${fecha} 
            `;
            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
            <span class="font-weight-bolder">Hora:</span> ${hora} 
            `;
            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
            <span class="font-weight-bolder">Sintomas:</span> ${sintomas} 
            `;
            // Boton para eliminar esta cita
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`;
            /* Agregar el evento al btnEliminar */
            btnEliminar.onclick = () => eliminarCita(id);
            /* Boton para editar la cita */
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn','btn-info','mr-2');
            btnEditar.innerHTML = `Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>`;
            /* Agregar evento al btnEditar */
            btnEditar.onclick = () => editarCita(cita);

            /* Agregar los parrafos al divCita */
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);
            /* Agregar las citas al HTML */
            contenedorCitas.appendChild(divCita);
        });
    }
}
const ui = new UI();
const administrarCitas = new Citas();
// Eventos
Eventos();
function Eventos() {
    formulario.addEventListener('submit', nuevaCita);

    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);
}
// Funciones
function datosCita(e) {
    citaObj[e.target.name] = e.target.value
}
function nuevaCita(e) { /* Valida y agrega una nueva cita */
    e.preventDefault();
        /* Extraer informacion del objeto de cita */
        const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;
        /* Validar */
        if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
            ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }
        if(editando) {
            ui.imprimirAlerta('Se edito correctamente');
            /* Pasar el objeto de la cita a edicion */
            administrarCitas.editarCita({...citaObj});
            /* Regresar el texto del boton a su estado original */
            formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';/* Seleccionar un elemento hijo desde el padre*/
            /* Quitar modo edicion */
            editando = false;
        } else {
        /* Generar un id unico */
        citaObj.id = Date.now();
    
        /* Creando una nueva cita */
        administrarCitas.agregarCita({...citaObj});
        /* Agregado correctamente */
        ui.imprimirAlerta('Se agrego correctamente');
            
        }
    
        /* Reinicia el formulario */
        formulario.reset();
        /* Reinicar objeto para la validadcion */
        reiniciarObjeto();
        /* Mostrar el HTML */
        ui.imprimirCitas(administrarCitas);
}

    


function reiniciarObjeto() {
    citaObj.mascota = '';
    citaObj.propietario = '';
    citaObj.telefono = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id) {
    /* Eliminar la cita */
    administrarCitas.eliminarCita(id);
    /* Muestra mensaje */
    ui.imprimirAlerta('La cita se elimino correctamente');
    /* Refrescar citas */
    ui.imprimirCitas(administrarCitas);
}

function editarCita(cita) {
    /* Editar la cita */
    administrarCitas.editarCita(cita);
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    /* Llenar los inputs */
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;
    /* Llenar el objeto */
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    /* Cambiar el texto del boton */
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';/* Seleccionar un elemento hijo desde el padre*/
    editando = true;
}
function sincronizarLocalStorage (thisCitas) {
    localStorage.setItem('arregloCitas', JSON.stringify(thisCitas))
}
