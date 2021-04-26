"use strict";

const btnAddTabelaEl = document.querySelector(".btn-add-table");
const arrLocaisTrabalho = {
  predio: [],
  localTrab: [],
};
const formEl = document.querySelector("form");
const tbodyEl = document.querySelector("tbody");
const tableEl = document.querySelector("table");
const sideBarEl = document.querySelector(".side-bar-ul");
let sideBarOptSelected = document.querySelector("#li-locais-trab");

//GERANDO DADOS PARA TABELA UTILIZANDO sessionStorage, se não tiver dados
// if (sessionStorage.length === 0) {
//   console.log(`session esta vazio`, sessionStorage.length);
//   for (let i = 0; i < 6; i++) {
//     sessionStorage.setItem(`Row${i}`, [
//       `Prédio ${i}`,
//       `Local ${Math.trunc(Math.random() * 20) + 1}`,
//     ]);
//   }
// }

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
  // statusEdit = true;
  if (
    !event.target.classList.contains("bi-pencil-square") &&
    !event.target.classList.contains("btn-edit-row")
  ) {
    return;
  }
  //   event.target.closest("tr").remove();
  const arrRow = getRow(event);

  arrRow[1].innerHTML = `
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

  arrRow[2].innerHTML = `
  <div class="select-localtrab-edit">
  <input type="text" name="select-localtrab-edit" id="select-localtrab-edit" required>
  </div>`;

  arrRow[3].innerHTML = `
    <button type="submit" class="btn-confirm-row"><i class="bi bi-check"></i></button>
    <button type="submit" class="btn-cancel-row"><i class="bi bi-x"></i></button>`;
}

function onConfirmEditRow(event) {
  if (
    !event.target.classList.contains("bi-check") &&
    !event.target.classList.contains("btn-confirm-row")
  ) {
    return;
  }

  const arrRow = getRow(event);

  const selectPredioEl = document
    .querySelector(`.table-row-${arrRow[0]}`)
    .querySelector("#select-predio-edit");
  const localTrabAdd = document
    .querySelector(`.table-row-${arrRow[0]}`)
    .querySelector("#select-localtrab-edit").value;
  const predioAdd = selectPredioEl.options[selectPredioEl.selectedIndex].text;

  sessionStorage.setItem(`Row${arrRow[0]}`, [predioAdd, localTrabAdd]);

  updateArrLocaisTrabalho();

  arrRow[1].textContent = predioAdd;
  arrRow[2].textContent = localTrabAdd;

  arrRow[3].innerHTML = `
  <button class="btn-edit-row"><i class="bi bi-pencil-square"></i></button>
  <button class="btn-delete-row"><i class="bi bi-trash"></i></button>
  `;
}

function onCancelEditRow(event) {
  if (
    !event.target.classList.contains("bi-x") &&
    !event.target.classList.contains("btn-cancel-row")
  ) {
    return;
  }

  const arrRow = getRow(event);

  arrRow[1].textContent = arrLocaisTrabalho.predio[arrRow[0]];
  arrRow[2].textContent = arrLocaisTrabalho.localTrab[arrRow[0]];

  arrRow[3].innerHTML = `
  <button class="btn-edit-row"><i class="bi bi-pencil-square"></i></button>
  <button class="btn-delete-row"><i class="bi bi-trash"></i></button>
  `;
}

function getRow(event) {
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

  return [rowNumber, firstCol, secondCol, thirdCol];
}

function onSelectOptions(event) {
  console.log("clicou");
  const liSelect = event.target.closest("li").textContent;
  console.log(liSelect);
  console.log(event.target.closest("li"));
  document
    .querySelector(".show-selected")
    .querySelector("h3").textContent = liSelect;
  if (liSelect !== "Locais de Trabalho") {
    document
      .querySelector(".form-table-space")
      .querySelector("form")
      .classList.add("hidden");
    document
      .querySelector(".form-table-space")
      .querySelector("table")
      .classList.add("hidden");
  } else {
    document
      .querySelector(".form-table-space")
      .querySelector("form")
      .classList.remove("hidden");
    document
      .querySelector(".form-table-space")
      .querySelector("table")
      .classList.remove("hidden");
  }
  event.target.closest("li").classList.add("selected");
  sideBarOptSelected.classList.remove("selected");
  sideBarOptSelected = event.target.closest("li");
}

//EVENTOS TABELA
formEl.addEventListener("submit", onAddWebsite);
tableEl.addEventListener("click", onDeleteRow);
tableEl.addEventListener("click", onConfirmEditRow);
tableEl.addEventListener("click", onCancelEditRow);
tableEl.addEventListener("click", onEditRow);

// CLICKS SIDEBAR
sideBarEl.querySelector("#li-admin").addEventListener("click", onSelectOptions);
sideBarEl.querySelector("#li-areas").addEventListener("click", onSelectOptions);
sideBarEl
  .querySelector("#li-locais-trab")
  .addEventListener("click", onSelectOptions);
sideBarEl
  .querySelector("#li-habilidades")
  .addEventListener("click", onSelectOptions);
sideBarEl.querySelector("#li-log").addEventListener("click", onSelectOptions);
sideBarEl.querySelector("#li-resp").addEventListener("click", onSelectOptions);
