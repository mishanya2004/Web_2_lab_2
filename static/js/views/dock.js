'use strict'

const dockModel = new Dock() // eslint-disable-line no-undef

function initAddForm () {
  const form = window.document.querySelector('#dock-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    console.log("hello pretty")
    const formData = new FormData(e.target)
    const dockData = {}
    formData.forEach((value, key) => {
      dockData[key] = value
    })

    dockModel.Create(dockData)

    e.target.reset()
  })
}

function initDeleteForm () {
  const form = window.document.querySelector('#dock-list')
  form.addEventListener('delete', function (e) {
    e.preventDefault()
    e.target.reset()
  })
}

function initEditForm() {
  const form = window.document.querySelector('#dock-list')
  form.addEventListener('edit', function (e) {
    e.preventDefault()
    e.target.reset()
  })
}

function initList () {
  window.jQuery('#dock-list').DataTable({
    data: dockModel.Select(),
    columns: [
      { title: 'Number', data: 'id' },
      { title: 'Port', data: 'port' },
      { title: 'Capacity', data: 'capacity' },
      {data: null, render: function(data, type, row) {
        return '<button class="btn btn-danger btn-sm delete-btn">Delete</button>';
      }},
      {data: null, render: function(data, type, row) {
        return '<button class="btn btn-success btn-sm edit-btn">Edit</button>';
      }}
    ]
  })
}

$('#dock-list').on('click', '.delete-btn, .edit-btn, .cancel-btn, .save-btn', function() {
  var row = $(this).closest('tr');
  var data = $('#dock-list').DataTable().row(row).data();

  if ($(this).hasClass('delete-btn')) {
    dockModel.Delete(data['id']);
  } else if ($(this).hasClass('edit-btn')) {
    row.hide();
    const editRow = `
          <tr class="edit-row">
            <td><a class=""/>${data.id}</a>
            <td><input class="form-control" value="${data.port}" /></td>
            <td><input class="form-control" value="${data.capacity}" /></td>
            <td><a class="btn btn-danger cancel-btn">Cancel</a></td>
            <td><a class="btn btn-primary save-btn">Save</a></td>
          </tr>
       `;
      row.after(editRow);
  } else if ($(this).hasClass('cancel-btn')) {
    row.prev().show();
    row.remove();
  } else if ($(this).hasClass('save-btn')) {
       const data = $('#dock-list').DataTable().row(row.prev()).data();
       const port = $(row).find('input').eq(0).val()
       const capacity = $(row).find('input').eq(1).val()
     
       const updatedDock = {
         id: data.id,
         port: port,
         capacity: capacity
       }
     
       dockModel.Edit(data.id, updatedDock)
       const docks = JSON.parse(localStorage.getItem('docks'))
       const index = docks.findIndex(dock => dock.id === updatedDock.id)
       docks[index] = updatedDock
       localStorage.setItem('docks', JSON.stringify(docks))
     
       $('#dock-list').DataTable().row(row.prev()).data([
         updatedDock.id,
         updatedDock.port,
         updatedDock.capacity,
         '<button class="btn btn-danger delete-btn">Delete</button>',
         '<button class="btn btn-success edit-btn">Edit</button>'
       ]).draw()
    }
});

function initListEvents () {
  document.addEventListener('docksListDataChanged', function (e) {
    const dataTable = window.jQuery('#dock-list').DataTable()
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
