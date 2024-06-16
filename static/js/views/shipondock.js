'use strict'

const shipondockModel = new ShipOnDock() // eslint-disable-line no-undef

function initAddForm () {
  const form = window.document.querySelector('#shipondock-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const shipondockData = {}
    formData.forEach((value, key) => {
      shipondockData[key] = value
    })

    shipondockModel.Create(shipondockData)

    e.target.reset()
  })
}

function initDeleteForm () {
  const form = window.document.querySelector('#shipondock-list')
  form.addEventListener('delete', function (e) {
    e.preventDefault()
    e.target.reset()
  })
}

function initEditForm() {
  const form = window.document.querySelector('#shipondock-list')
  form.addEventListener('edit', function (e) {
    e.preventDefault()
    e.target.reset()
  })
}

function initList () {
  window.jQuery('#shipondock-list').DataTable({
    data: shipondockModel.Select(),
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'Dock', data: 'dock' },
      { title: 'Ship', data: 'ship' },
      {data: null, render: function(data, type, row) {
        return '<button class="btn btn-danger btn-sm delete-btn">Delete</button>';
      }},
      {data: null, render: function(data, type, row) {
        return '<button class="btn btn-success btn-sm edit-btn">Edit</button>';
      }}
    ]
  })
}

$('#shipondock-list').on('click', '.delete-btn, .edit-btn, .cancel-btn, .save-btn', function() {
  var row = $(this).closest('tr');
  var data = $('#shipondock-list').DataTable().row(row).data();

  if ($(this).hasClass('delete-btn')) {
    shipondockModel.Delete(data['id']);
  } else if ($(this).hasClass('edit-btn')) {
    row.hide();
    const editRow = `
          <tr class="edit-row">
            <td><a class=""/>${data.id}</a>
            <td><input class="form-control" value="${data.dock}" /></td>
            <td><input class="form-control" value="${data.ship}" /></td>
            <td><a class="btn btn-danger cancel-btn">Cancel</a></td>
            <td><a class="btn btn-primary save-btn">Save</a></td>
          </tr>
       `;
      row.after(editRow);
  } else if ($(this).hasClass('cancel-btn')) {
    row.prev().show();
    row.remove();
  } else if ($(this).hasClass('save-btn')) {
       const data = $('#shipondock-list').DataTable().row(row.prev()).data();
       const dock = $(row).find('input').eq(0).val()
       const ship = $(row).find('input').eq(1).val()
     
       const updatedShipOnDock = {
         id: data.id,
         dock: dock,
         ship: ship
       }
     
       shipondockModel.Edit(data.id, updatedShipOnDock)
       const shipsondocks = JSON.parse(localStorage.getItem('shipsondocks'))
       const index = ships.findIndex(shipondock => shipondock.id === updatedShipOnDock.id)
       ships[index] = updatedShipOnDock
       localStorage.setItem('shipsondocks', JSON.stringify(ships))
     
       $('#shipondock-list').DataTable().row(row.prev()).data([
         updatedShipOnDock.id,
         updatedShipOnDock.dock,
         updatedShipOnDock.ship,
         '<button class="btn btn-danger delete-btn">Delete</button>',
         '<button class="btn btn-success edit-btn">Edit</button>'
       ]).draw()
    }
});

function initListEvents () {
  document.addEventListener('shipsondocksListDataChanged', function (e) {
    const dataTable = window.jQuery('#shipondock-list').DataTable()

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
