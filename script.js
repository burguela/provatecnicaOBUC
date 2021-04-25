"use strict";

const btnAddTabelaEl = document.querySelector(".btn-add-table");
const arrLocaisTrabalho = {
  predio: [],
  localTrab: [],
};
const formEl = document.querySelector("form");
const tbodyEl = document.querySelector("tbody");
const tableEl = document.querySelector("table");
let statusEdit = false;

eraseTable();
updateTable();

//GERANDO DADOS PARA TABELA UTILIZANDO sessionStorage, se não tiver dados
if (sessionStorage.length === 0) {
  console.log(`session esta vazio`, sessionStorage.length);
  for (let i = 0; i < 6; i++) {
    sessionStorage.setItem(`Row${i}`, [
      `Prédio ${i}`,
      `Local ${Math.trunc(Math.random() * 20) + 1}`,
    ]);
  }
}

eraseTable();
updateTable();

//CARREGANDO STORAGE

function updateTable() {
  organizaSessionStorage();

  updateArrLocaisTrabalho();

  eraseTable();
  for (let i = 0; i < arrLocaisTrabalho.predio.length; i++) {
    tbodyEl.innerHTML += `
  <tr class="table-row-${i}">
  <td class="table-col-0">${arrLocaisTrabalho.predio[i]}</td>
  <td class="table-col-1">${arrLocaisTrabalho.localTrab[i]}</td>
  <td class="table-col-2">
  <button class="btn-edit-row"><i class="bi bi-pencil-square"></i></button>
  <button class="btn-delete-row"><i class="bi bi-trash"></i></button>
  </td>
  </tr>
  `;
  }
}

function eraseTable() {
  while (tbodyEl.childElementCount > 0) {
    tbodyEl.firstChild.remove();
  }
}

function updateArrLocaisTrabalho() {
  arrLocaisTrabalho.predio = [];
  arrLocaisTrabalho.localTrab = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const filtroArray = sessionStorage.getItem(`Row${i}`).split(",");
    arrLocaisTrabalho.predio[i] = filtroArray[0];
    arrLocaisTrabalho.localTrab[i] = filtroArray[1];
  }
}

function addToSessionStorage() {
  const selectPredioEl = document.getElementById("select-predio");
  const localTrabAdd = document.getElementById("select-localtrab").value;
  const predioAdd = selectPredioEl.options[selectPredioEl.selectedIndex].text;
  const rowNumber = sessionStorage.length;
  sessionStorage.setItem(`Row${rowNumber}`, [predioAdd, localTrabAdd]);
}

function organizaSessionStorage() {
  for (let i = 0; i < sessionStorage.length; i++) {
    if (!sessionStorage.getItem(`Row${i}`)) {
      sessionStorage.setItem(`Row${i}`, sessionStorage.getItem(`Row${i + 1}`));
      sessionStorage.removeItem(`Row${i + 1}`);
    }
  }
}

function onAddWebsite(event) {
  event.preventDefault();
  addToSessionStorage();
  updateTable();
  document.getElementById("select-localtrab").value = "";
}

function onDeleteRow(event) {
  if (
    !event.target.classList.contains("bi-trash") &&
    !event.target.classList.contains("btn-delete-row")
  ) {
    return;
  }
  //   event.target.closest("tr").remove();
  const rowNumber = Number(
    event.target.closest("tr").classList.value.replace(/\D/g, "")
  );
  sessionStorage.removeItem(`Row${rowNumber}`);
  updateTable();
}

function onEditRow(event) {
  statusEdit = true;
  if (
    !event.target.classList.contains("bi-pencil-square") &&
    !event.target.classList.contains("btn-edit-row")
  ) {
    return;
  }
  //   event.target.closest("tr").remove();
  const rowNumber = Number(
    event.target.closest("tr").classList.value.replace(/\D/g, "")
  );

  const firstCol = document.querySelector(
    `.table-row-${rowNumber} .table-col-0`
  );

  const secondCol = document.querySelector(
    `.table-row-${rowNumber} .table-col-1`
  );

  const thirdCol = document.querySelector(
    `.table-row-${rowNumber} .table-col-2`
  );

  firstCol.innerHTML = `
  <div class="select-predio-row-edit">
  <select name="select-predio-edit" id="select-predio-edit" required>
  <option hidden disabled selected value>
  </option>
  <option value="predio1">Prédio 1</option>
  <option value="predio2">Prédio 2</option>
  <option value="predio3">Prédio 3</option>
  <option value="predio4">Prédio 4</option>
  <option value="predio5">Prédio 5</option>
    </select>
    </div>
    `;

  secondCol.innerHTML = `
  <div class="select-localtrab-edit">
  <input type="text" name="select-localtrab-edit" id="select-localtrab-edit" required>
  </div>`;

  thirdCol.innerHTML = `
    <button class="btn-confirm-row"><i class="bi bi-check"></i></button>
    <button class="btn-cancel-row"><i class="bi bi-x"></i></button>`;
}

function onConfirmEditRow(event) {
  if (
    !event.target.classList.contains("bi-check") &&
    !event.target.classList.contains("btn-confirm-row")
  ) {
    return;
  }
  const selectPredioEl = document.getElementById("select-predio-edit");
  const localTrabAdd = document.getElementById("select-localtrab-edit").value;
  const predioAdd = selectPredioEl.options[selectPredioEl.selectedIndex].text;
  const rowNumber = Number(
    event.target.closest("tr").classList.value.replace(/\D/g, "")
  );
  //   console.log(sessionStorage);
  //   updateArrLocaisTrabalho();
  sessionStorage.setItem(`Row${rowNumber}`, [predioAdd, localTrabAdd]);
  updateTable();
}

function onCancelEditRow(event) {
  if (
    !event.target.classList.contains("bi-x") &&
    !event.target.classList.contains("btn-cancel-row")
  ) {
    return;
  }
  updateTable();
}

//EVENTOS

formEl.addEventListener("submit", onAddWebsite);
tableEl.addEventListener("click", onDeleteRow);
tableEl.addEventListener("click", onConfirmEditRow);
tableEl.addEventListener("click", onCancelEditRow);

if (!statusEdit) {
  tableEl.addEventListener("click", onEditRow);
} else if (statusEdit) {
  tableEl.removeEventListener("click", onEditRow);
}
