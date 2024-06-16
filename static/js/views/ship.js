'use strict'

const shipModel = new Ship() // eslint-disable-line no-undef

function initAddForm () {
  const form = window.document.querySelector('#ship-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const shipData = {}
    formData.forEach((value, key) => {
      shipData[key] = value
    })

    shipModel.Create(shipData)

    e.target.reset()
  })
}

function initDeleteForm () {
  const form = window.document.querySelector('#ship-list')
  form.addEventListener('delete', function (e) {
    e.preventDefault()
    e.target.reset()
  })
}

function initEditForm() {
  const form = window.document.querySelector('#ship-list')
  form.addEventListener('edit', function (e) {
    e.preventDefault()
    e.target.reset()
  })
}

function initList () {
  window.jQuery('#ship-list').DataTable({
    data: shipModel.Select(),
    columns: [
      { title: 'Board number', data: 'id' },
      { title: 'Name', data: 'name' },
      { title: 'Country', data: 'country' },
      { title: 'Tonnage', data: 'tonnage'},
      {data: null, render: function(data, type, row) {
        return '<button class="btn btn-danger btn-sm delete-btn">Delete</button>';
      }},
      {data: null, render: function(data, type, row) {
        return '<button class="btn btn-success btn-sm edit-btn">Edit</button>';
      }}
    ]
  })
}

$('#ship-list').on('click', '.delete-btn, .edit-btn, .cancel-btn, .save-btn', function() {
  var row = $(this).closest('tr');
  var data = $('#ship-list').DataTable().row(row).data();

  if ($(this).hasClass('delete-btn')) {
    shipModel.Delete(data['id']);
  } else if ($(this).hasClass('edit-btn')) {
    row.hide();
    const editRow = `
          <tr class="edit-row">
            <td><a class=""/>${data.id}</a>
            <td><input class="form-control" value="${data.name}" /></td>
            <td><input class="form-control" value="${data.country}" /></td>
            <td><input class="form-control" value="${data.tonnage}" /></td>
            <td><a class="btn btn-danger cancel-btn">Cancel</a></td>
            <td><a class="btn btn-primary save-btn">Save</a></td>
          </tr>
       `;
      row.after(editRow);
  } else if ($(this).hasClass('cancel-btn')) {
    row.prev().show();
    row.remove();
  } else if ($(this).hasClass('save-btn')) {
       const data = $('#ship-list').DataTable().row(row.prev()).data();
       const name = $(row).find('input').eq(0).val()
       const country = $(row).find('input').eq(1).val()
       const tonnage = $(row).find('input').eq(2).val()
     
       const updatedShip = {
         id: data.id,
         name: name,
         country: country,
         tonnage: tonnage
       }
     
       shipModel.Edit(data.id, updatedShip)
       const ships = JSON.parse(localStorage.getItem('ships'))
       const index = ships.findIndex(ship => ship.id === updatedShip.id)
       ships[index] = updatedShip
       localStorage.setItem('ships', JSON.stringify(ships))
     
       $('#ship-list').DataTable().row(row.prev()).data([
         updatedShip.id,
         updatedShip.name,
         updatedShip.country,
         updatedShip.tonnage,
         '<button class="btn btn-danger delete-btn">Delete</button>',
         '<button class="btn btn-success edit-btn">Edit</button>'
       ]).draw()
    }
});

// $('#ship-list').on('click', '.delete-btn', function() {
//   var row = $(this).closest('tr');
//   var data = $('#ship-list').DataTable().row(row).data();
//   //console.log(data.id)
//   shipModel.Delete(data['id']);
// });

// $('#ship-list').on('click', '.edit-btn', function () {
// //   const table = window.jQuery('#ship-list').DataTable()
// // table.on('click', '.edit-btn', function () {
//   const row = $(this).closest('tr')
//   const data = $('#ship-list').DataTable().row(row).data();

//   row.hide()

//   const newRow = window.jQuery('#ship-list').DataTable({
//     data: shipModel.Select(),
//     columns: [
//       { title: 'ID', data: 'id' },
//       {data: null, render: function(data, type, row) {
//         return `<input id="name" class="form-control" value="${data.name}">`;
//       }},
//       {data: null, render: function(data, type, row) {
//         return `<input id="country" class="form-control" value="${data.country}">`;
//       }},
//       {data: null, render: function(data, type, row) {
//         return `<input id="tonnage" class="form-control" value="${data.tonnage}">`;
//       }},
//       {data: null, render: function(data, type, row) {
//         return '<button class="btn btn-danger btn-sm cancel-btn">Cancel</button>';
//       }},
//       {data: null, render: function(data, type, row) {
//         return '<button class="btn btn-success btn-sm save-btn">Edit</button>';
//       }}
//     ]
//   })
//   const editRow = `
//       <tr class="edit-row">
//         <td><a id="nam" class=""/>${data.id}</a>
//         <td><input id="nam" class="form-control" value="${data.name}" /></td>
//         <td><input id="npas" class="form-control" value="${data.country}" /></td>
//         <td><input id="ton" class="form-control" value="${data.tonnage}" /></td>
//         <td><a class="btn btn-danger cancel-btn">Cancel</a></td>
//         <td><a class="btn btn-primary save-btn">Save</a></td>
//       </tr>
//    `;
//   row.after(editRow);
// });

// $('#ship-list').on('click', '.cancel-btn', function () {
//   // table.on('click', '.cancel-btn', function() {
//   const row = $(this).closest('tr')
//   const data = $('#ship-list').DataTable().row(row).data()

//   row.prev().show();
//   row.remove();
// });
// });

// $('#ship-list').on('click', '.save-btn', function () {
//   const row = $(this).closest('tr')
//   const data = $('#ship-list').DataTable().row(row.prev()).data();
//   const name = $(row).find('input').eq(0).val()
//   const country = $(row).find('input').eq(1).val()
//   const tonnage = $(row).find('input').eq(2).val()

//   const updatedShip = {
//     id: data.id,
//     name: name,
//     country: country,
//     tonnage: tonnage
//   }

//   shipModel.Edit(updatedShip)
//   const ships = JSON.parse(localStorage.getItem('ships'))
//   const index = ships.findIndex(ship => ship.id === updatedShip.id)
//   ships[index] = updatedShip
//   localStorage.setItem('ships', JSON.stringify(ships))

//   $('#ship-list').DataTable().row(row.prev()).data([
//     updatedShip.id,
//     updatedShip.name,
//     updatedShip.country,
//     updatedShip.tonnage,
//     '<button class="btn btn-danger delete-btn">Delete</button>',
//     '<button class="btn btn-success edit-btn">Edit</button>'
//   ]).draw()
 
// //})
// });

// $('#ship-list').on('click', '.edit-btn', function () {
//   const table = window.jQuery('#ship-list').DataTable();
//   const button = $(this);
//   const cell = button.closest('td');
//   cell.find('.edit-btn').hide();
//   const row = table.row(button.closest('tr'));
//   const data = row.data();
//   const editRow = `
//     <tr class="edit-row">
//       <td><input id="nam" class="form-control" value="${data.name}" /></td>
//       <td><input id="npas" class="form-control" value="${data.country}" /></td>
//       <td><input id="ton" class="form-control" value="${data.tonnage}" /></td>
//       <td><a class="btn btn-secondary save-btn">Save</a></td>
//     </tr>
//   `;
//   row.after(editRow);
// });

// $('#ship-list').on('click', '.btn-secondary', function () {
//   const button = $(this);
//   const row = button.closest('tr');
//   const cell = button.closest('td');
//   const name = table.row(row).data().id;
//   const i = shipModel.FindIndexById(name);
//   const ships = shipModel.Select();
//   const eln = row.find('#nam').val();
//   const elp = row.find('#npas').val();
//   ships[i].name = eln;
//   ships[i].country = elp;
//   shipModel.Update(name, ships[i]);
//   table.cell(row, 1).data(eln).cell(row, 2).data(elp).draw();
//   cell.find('.edit-btn').show();
//   row.find('.edit-row').remove();
// });

// $('#ship-list').on('click', '.edit-btn', function () {
//   const table = window.jQuery('#ship-list').DataTable()
//   let row1 = $(this).closest('td');
//   let row2 = $(this).closest('tr');
//   row1.find('.btn-success').hide();
//   let block = `<tr><td>Name<input id="nam" class="form-control" value="${table.row(row2).data().name}"/></td><td>Budget<input id="npas" class="form-control" value="${table.row(row2).data().country}"/></td><td>Name<input id="nam" class="form-control" value="${table.row(row2).data().tonnage}"/></td><td><a id="save-btn" class= "btn btn-secondary">Save</a></td></tr>`
//   row1.append(block);
// });

// $('#ship-list').on('click', '.btn-secondary', function () {
//   let blc = $(this).closest('tr')
//   let name = table.row(row2).data().id;
//   let i = clientModel.FindIndexById(name);
//   let clients = JSON.parse(localStorage.getItem('ships'));
//   let eln = document.getElementById('nam');
//   clients[i].name = eln.value;
//   let elp = document.getElementById('npas');
//   clients[i].country = elp.value;
//   localStorage.setItem('ships', JSON.stringify(clients));
//   table.cell(row2, 0).data(eln.value).cell(row2, 2).data(elp.value).draw();

//   blc.remove();
//   row1.find('.edit-btn').show();
// });

function initListEvents () {
  document.addEventListener('shipsListDataChanged', function (e) {
    const dataTable = window.jQuery('#ship-list').DataTable()
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
