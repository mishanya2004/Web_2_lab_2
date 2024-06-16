'use strict'

const portModel = new Port() // eslint-disable-line no-undef

function initAddForm () {
  const form = window.document.querySelector('#port-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const portData = {}
    formData.forEach((value, key) => {
      portData[key] = value
    })

    portModel.Create(portData)

    e.target.reset()
  })
}

function initDeleteForm () {
  const form = window.document.querySelector('#port-list')
  form.addEventListener('delete', function (e) {
    e.preventDefault()
    e.target.reset()
  })
}

function initEditForm() {
  const form = window.document.querySelector('#port-list')
  form.addEventListener('edit', function (e) {
    e.preventDefault()
    e.target.reset()
  })
}

function initList () {
  window.jQuery('#port-list').DataTable({
    data: portModel.Select(),
    columns: [
      { title: 'EDRPOU Number', data: 'id' },
      { title: 'Name', data: 'name' },
      { title: 'Country', data: 'country' },
      { title: 'Address', data: 'address'},
      {data: null, render: function(data, type, row) {
        return '<button class="btn btn-danger btn-sm delete-btn">Delete</button>';
      }},
      {data: null, render: function(data, type, row) {
        return '<button class="btn btn-success btn-sm edit-btn">Edit</button>';
      }}
    ]
  })
}

$('#port-list').on('click', '.delete-btn, .edit-btn, .cancel-btn, .save-btn', function() {
  var row = $(this).closest('tr');
  var data = $('#port-list').DataTable().row(row).data();

  if ($(this).hasClass('delete-btn')) {
    portModel.Delete(data['id']);
  } else if ($(this).hasClass('edit-btn')) {
    row.hide();
    const editRow = `
          <tr class="edit-row">
            <td><a class=""/>${data.id}</a>
            <td><input class="form-control" value="${data.name}" /></td>
            <td><input class="form-control" value="${data.country}" /></td>
            <td><input class="form-control" value="${data.address}" /></td>
            <td><a class="btn btn-danger cancel-btn">Cancel</a></td>
            <td><a class="btn btn-primary save-btn">Save</a></td>
          </tr>
       `;
      row.after(editRow);
  } else if ($(this).hasClass('cancel-btn')) {
    row.prev().show();
    row.remove();
  } else if ($(this).hasClass('save-btn')) {
       const data = $('#port-list').DataTable().row(row.prev()).data();
       const name = $(row).find('input').eq(0).val()
       const country = $(row).find('input').eq(1).val()
       const address = $(row).find('input').eq(2).val()
     
       const updatedPort = {
         id: data.id,
         name: name,
         country: country,
         address: address
       }
     
       portModel.Edit(data.id, updatedPort)
       const ports = JSON.parse(localStorage.getItem('ports'))
       const index = ports.findIndex(port => port.id === updatedPort.id)
       ports[index] = updatedPort
       localStorage.setItem('ports', JSON.stringify(ports))
     
       $('#port-list').DataTable().row(row.prev()).data([
         updatedPort.id,
         updatedPort.name,
         updatedPort.country,
         updatedPort.address,
         '<button class="btn btn-danger delete-btn">Delete</button>',
         '<button class="btn btn-success edit-btn">Edit</button>'
       ]).draw()
    }
});

function initListEvents () {
  document.addEventListener('portsListDataChanged', function (e) {
    const dataTable = window.jQuery('#port-list').DataTable()
    dataTable.clear()
    dataTable.rows.add(e.detail)
    dataTable.draw()
  }, false)
}

window.addEventListener('DOMContentLoaded', e => {
  initAddForm()
  initDeleteForm()
  initEditForm()
  initList()
  initListEvents()
})
