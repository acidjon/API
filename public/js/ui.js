

function limpiarForm(){
    document.getElementById("form-order").reset();
    document.getElementById("order-id").value="";
    const btnEdit= document.getElementById("btn-add");
    btnEdit.innerText="Agregar orden";
    document.getElementById("task-tittle").innerText="Agregar tarea"
}

function toogleForm(formId){
    // limpiarForm();
    const form = document.getElementById(formId);
    
    if(!form){
        console.warn(`Formulario no encontrado: ${formId}`);
        return;
    }
    // cambiar visibilidad del formulario
    form.classList.toggle("hidden");

    
    // cerrar formulario al hacer click fuera
    
    form.addEventListener("click",(e)=>{
        if(e.target == form){
            form.classList.add("hidden");
        }
    });
}

function deletetask(id) {
    if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
        window.location.href = `/deletetask/${id}`;
    }
}

function updateTask(id) {
    const nuevoEstado = prompt("Cambiar estado de la tarea:\nEscribe 'Pendiente' o 'Listo'");
    
    if (nuevoEstado === "Pendiente" || nuevoEstado === "Listo") {
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/updatetask/${id}`;

        const inputStatus = document.createElement('input');
        inputStatus.type = 'hidden';
        inputStatus.name = 'status';
        inputStatus.value = nuevoEstado;

        form.appendChild(inputStatus);
        document.body.appendChild(form);
        form.submit();
    } else if (nuevoEstado !== null) {
        alert("Opción no válida. Debes escribir exactamente 'Pendiente' o 'Listo'.");
    }
}

function cambiarEstado(id, nuevoEstado) {
    // Creamos un formulario virtual rápido
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `/updatetask/${id}`;

    // Le inyectamos el valor seleccionado del menú ('Pendiente' o 'Listo')
    const inputStatus = document.createElement('input');
    inputStatus.type = 'hidden';
    inputStatus.name = 'status';
    inputStatus.value = nuevoEstado;

    form.appendChild(inputStatus);
    document.body.appendChild(form);
    
    // Enviamos los datos al backend y refrescamos la pantalla
    form.submit();
} 