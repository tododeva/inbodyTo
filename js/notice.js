
let db;

window.onload = function () {
  const request = indexedDB.open("TodoDB", 1);
  request.onsuccess = function (e) {
    db = e.target.result;
    displayTodos();
  };
  request.onupgradeneeded = function (e) {
    db = e.target.result;
    db.createObjectStore("todos", { keyPath: "id", autoIncrement: true });
  };

  document.getElementById("saveTodoBtn").onclick = function () {
    const input = document.getElementById("todoInput");
    const text = input.value.trim();
    if (text === "") return;
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    store.add({ text });
    tx.oncomplete = () => {
      input.value = "";
      displayTodos();
    };
  };
};

function displayTodos() {
  const tx = db.transaction("todos", "readonly");
  const store = tx.objectStore("todos");
  const request = store.getAll();
  request.onsuccess = function () {
    const list = document.getElementById("todoList");
    list.innerHTML = "";
    request.result.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
                <span><strong>${index + 1}.</strong> ${item.text}</span>
                <div>
                    <button class="btn btn-sm btn-success me-1" onclick="copyTodo('${item.text}')">📋 복사</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTodo(${item.id})">🗑 삭제</button>
                </div>
            `;
      list.appendChild(li);
    });
  };
}

function copyTodo(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("복사되었습니다!");
  });
}

function deleteTodo(id) {
  const tx = db.transaction("todos", "readwrite");
  const store = tx.objectStore("todos");
  store.delete(id);
  tx.oncomplete = () => displayTodos();
}