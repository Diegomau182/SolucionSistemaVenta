﻿const MODELO_BASE = {
    idCategoria: 0,
    descripcion: "",
    esActivo: 1
}

let tablaData;

$(document).ready(function () {

    //mostrar los datos de la tabla
    tablaData = $('#tbdata').DataTable({
        responsive: true,

        "ajax": {
            //url del controlador
            "url": '/Categoria/Lista',
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            //rellenar con los datos que trae la lista
            { "data": "idCategoria", "visible": false, "searchable": false },
            { "data": "descripcion" },
            {
                "data": "esActivo", render: function (data) {
                    if (data == 1)
                        return '<span class="badge badge-info">Activo</span>';
                    else
                        return '<span class="badge badge-danger">No Activo</span>';
                }
            },
            {
                "defaultContent": '<button class="btn btn-primary btn-editar btn-sm mr-2"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-danger btn-eliminar btn-sm"><i class="fas fa-trash-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "width": "80px"
            }
        ],
        //como se ordena los datos

        order: [[0, "desc"]],
        dom: "Bfrtip",
        buttons: [
            {
                text: 'Exportar Excel',
                extend: 'excelHtml5',
                title: '',
                filename: 'Reporte Categoria',
                exportOptions: {
                    columns: [0,1,2,3]
                }
            }, 'pageLength'
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        },
    });

})

function mostrarModal(modelo = MODELO_BASE) {
    $("#txtId").val(modelo.idCategoria)
    $("#txtDescripcion").val(modelo.descripcion)
    $("#cboEstado").val(modelo.esActivo)

    $("#modalData").modal("show")
}
//modal para guardar 
$("#btnNuevo").click(function () { mostrarModal() })


//Metodo guardar
$("#btnGuardar").click(function () {
    //vsalidacion de los inputs
    const inputs = $("input.input-validar").serializeArray();
    const inputs_sin_valor = inputs.filter((item) => item.value.trim() == "");

    if (inputs_sin_valor.length > 0) {
        const mensaje = `Debe completar el campo :"${inputs_sin_valor[0].name}"`;
        toastr.warning("", mensaje)
        $(`input[name]="${inputs_sin_valor[0].name}"`).focus()
        return;
    }

    //guardar 
    const modelo = structuredClone(MODELO_BASE);
    modelo["idCategoria"] = parseInt($("#txtId").val())
    modelo["descripcion"] = $("#txtDescripcion").val()
    modelo["esActivo"] = parseInt($("#cboEstado").val())


    $("#modalData").find("div.modal-content").LoadingOverlay("show");

    if (modelo.idCategoria == 0) {
        fetch('/Categoria/Crear', {
            method: "POST",
            headers: {"Content-Type":"application/json;  charset=uft-8"},
            body: JSON.stringify(modelo)
        })
            .then(response => {
                $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                return response.ok ? response.json() : Promise.reject(response)
            })
            //agrega el usuario creado a la tabla
            .then(responseJson => {
                if (responseJson.estado) {

                    tablaData.row.add(responseJson.objeto).draw(false)
                    $("#modalData").modal("hide")
                    swal("Listo!", "La Categoria fue creada", "success")
                } else {
                    swal("Fallo", responseJson.mensaje, "error")
                }
            })

    } else {
        //Metodo editar
        fetch('/Categoria/Editar', {
            method: "PUT",
            headers: { "Content-Type": "application/json;  charset=uft-8" },
            body: JSON.stringify(modelo)
        })
            .then(response => {
                $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                return response.ok ? response.json() : Promise.reject(response)
            })
            //agrega el usuario creado a la tabla
            .then(responseJson => {
                if (responseJson.estado) {

                    tablaData.row(filaSelecionada).data(responseJson.objeto).draw(false)
                    filaSelecionada = null;
                    $("#modalData").modal("hide")
                    swal("Listo!", "La Categoria fue Modificada", "success")
                } else {
                    swal("Fallo", responseJson.mensaje, "error")
                }
            })
    }

})


//editar

let filaSelecionada;
$("#tbdata tbody").on("click", ".btn-editar", function () {

    if ($(this).closest("tr").hasClass("child")) {
        fila = $(this).closest("tr").prev();
    } else {
        fila = $(this).closest("tr")
    }

    const data = tablaData.row(filaSelecionada).data()

    mostrarModal(data);
})

//eliminar
$("#tbdata tbody").on("click", ".btn-eliminar", function () {
    let fila;
    if ($(this).closest("tr").hasClass("child")) {
        fila = $(this).closest("tr").prev();
    } else {
        fila = $(this).closest("tr")
    }

    const data = tablaData.row(fila).data()

    swal({
        title: "¿Está Seguro?",
        Text: `Eliminar la Categoria "${data.descripcion}"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Si, Eliminar",
        cancelButtonText: "No, Cancelar",
        closeOnConfirm: false,
        closeOnCancel: true,
    },
        function (respuesta) {

            if (respuesta) {

                $(".showSweetAlert").LoadingOverlay("show");
                fetch(`/Categoria/Eliminar?idCategoria=${data.iCategoria}`, {
                    method: "DELETE"
                })
                    .then(response => {
                        $(".showSweetAlert").LoadingOverlay("hide");
                        return response.ok ? response.json() : Promise.reject(response)
                    })
                    //agrega el usuario creado a la tabla
                    .then(responseJson => {
                        if (responseJson.estado) {

                            tablaData.row(fila).remove().draw()
                            swal("Listo!", "La Categoria fue Eliminada", "success")
                        } else {
                            swal("Fallo", responseJson.mensaje, "error")
                        }
                    })
            }
        }
    )
})