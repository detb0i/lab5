"use strict";

function show(id, text, append = false) {
  const el = document.getElementById(id);
  if (!append) el.replaceChildren();
  const line = document.createElement("div");
  line.className = "line";
  line.textContent = text;
  el.appendChild(line);
}

function showTable(id, caption, items, cols) {
  const el = document.getElementById(id);
  el.replaceChildren();
  const cap = document.createElement("p");
  cap.className = "caption";
  cap.textContent = caption;
  el.appendChild(cap);
  if (items.length === 0) { show(id, "немає", true); return; }
  const table = document.createElement("table");
  const head = table.insertRow();
  cols.forEach(([name]) => { const th = document.createElement("th"); th.textContent = name; head.appendChild(th); });
  items.forEach(item => {
    const row = table.insertRow();
    cols.forEach(([, fn]) => { row.insertCell().textContent = fn(item); });
  });
  el.appendChild(table);
}
const yesNo = v => (v ? "Так" : "Ні");
const bookCols = [["Назва", b => b.title], ["Автор", b => b.author], ["Рік", b => b.year], ["Прочитана", b => yesNo(b.isRead)]];
const clothCols = [["Тип", c => c.type], ["Колір", c => c.color], ["Розмір", c => c.size], ["Сезон", c => c.season], ["Одягався", c => yesNo(c.isWorn)]];

let book = {
  title: "Harry Potter and the Sorcerer's Stone",
  author: "J.K. Rowling",
  year: 1997,
  isRead: true
};
book.bookInfo = function () {
  return `Назва: ${this.title}, Автор: ${this.author}, Рік видання: ${this.year}, Прочитана: ${yesNo(this.isRead)}`;
};
show("out1", book.bookInfo());
document.getElementById("btnToggle").onclick = () => {
  book.isRead = !book.isRead;
  show("out1", book.bookInfo(), true);
};

function Book(title, author, year, isRead) {
  this.title = title;
  this.author = author;
  this.year = year;
  this.isRead = isRead;
  this.bookInfo = function () {
    return `Назва: ${this.title}, Автор: ${this.author}, Рік видання: ${this.year}, Прочитана: ${yesNo(this.isRead)}`;
  };
  this.markAsRead = function () { this.isRead = true; };
}

let library = [
  new Book("Harry Potter and the Sorcerer's Stone", "J.K. Rowling", 1997, true),
  new Book("The Hobbit", "J.R.R. Tolkien", 1937, false),
  new Book("1984", "George Orwell", 1949, true)
];

function displayLibrary(outId) {
  show(outId, library.map(b => b.bookInfo()).join("\n"));
}
displayLibrary("out2");

const btnPush = document.getElementById("btnPush");
btnPush.onclick = () => {
  library.push(new Book("The Great Gatsby", "F. Scott Fitzgerald", 1925, false));
  displayLibrary("out2");
  btnPush.disabled = true;
};

document.getElementById("btnSort").onclick = () => {
  library.sort((a, b) => a.year - b.year);
  showTable("out3", "Відсортовані книги за роком видання:", library, bookCols);
};
document.getElementById("btnFilter").onclick = () => {
  let unreadBooks = library.filter(book => !book.isRead);
  showTable("out3", "Непрочитані книги:", unreadBooks, bookCols);
};
document.getElementById("btnFind").onclick = () => {
  let tolkienBook = library.find(book => book.author === "J.R.R. Tolkien");
  showTable("out3", "Книга Толкіна:", tolkienBook ? [tolkienBook] : [], bookCols);
};

document.getElementById("bookForm").onsubmit = e => {
  e.preventDefault();
  const title = document.getElementById("fTitle").value.trim();
  const author = document.getElementById("fAuthor").value.trim();
  const year = +document.getElementById("fYear").value;
  const isRead = document.getElementById("fRead").checked;
  if (!title || !author || Number.isNaN(year) || year <= 0) {
    show("out4", "Некоректні дані!");
    return;
  }
  library.push(new Book(title, author, year, isRead));
  displayLibrary("out4");
  e.target.reset();
};

function calculateAverageYear() {
  if (library.length === 0) return 0;
  return library.reduce((sum, b) => sum + b.year, 0) / library.length;
}
document.getElementById("btnMark").onclick = () => {
  const hobbit = library.find(b => b.title === "The Hobbit");
  if (!hobbit) return show("out5", "Книгу «The Hobbit» не знайдено");
  hobbit.markAsRead();
  show("out5", hobbit.bookInfo());
};
document.getElementById("btnAvg").onclick = () => {
  show("out5", "Середній рік видання: " + calculateAverageYear().toFixed(1));
};

function Clothing(type, color, size, season, isWorn) {
  this.type = type;
  this.color = color;
  this.size = size;
  this.season = season;
  this.isWorn = isWorn;
  this.clothingInfo = function () {
    return `Тип: ${this.type}, Колір: ${this.color}, Розмір: ${this.size}, Сезон: ${this.season}, Одягався: ${yesNo(this.isWorn)}`;
  };
  this.markAsWorn = function () { this.isWorn = true; };
}

let wardrobe = [
  new Clothing("Куртка", "чорний", "M", "зима", true),
  new Clothing("Футболка", "білий", "S", "літо", true),
  new Clothing("Светр", "сірий", "L", "зима", false),
  new Clothing("Джинси", "синій", "M", "демісезон", false)
];

function displayWardrobe() {
  show("out6", wardrobe.map(c => c.clothingInfo()).join("\n"));
}
displayWardrobe();

document.getElementById("clothForm").onsubmit = e => {
  e.preventDefault();
  wardrobe.push(new Clothing(
    document.getElementById("cType").value.trim(),
    document.getElementById("cColor").value.trim(),
    document.getElementById("cSize").value.trim().toUpperCase(),
    document.getElementById("cSeason").value.trim(),
    document.getElementById("cWorn").checked
  ));
  displayWardrobe();
  e.target.reset();
};
document.getElementById("cSort").onclick = () => {
  wardrobe.sort((a, b) => a.type.localeCompare(b.type, "uk"));
  showTable("out6", "Відсортовано за типом:", wardrobe, clothCols);
};
document.getElementById("cFilter").onclick = () => {
  showTable("out6", "Речі, які ще не одягалися:", wardrobe.filter(c => !c.isWorn), clothCols);
};
document.getElementById("cFind").onclick = () => {
  const winter = wardrobe.find(c => c.season === "зима");
  showTable("out6", "Перша зимова річ:", winter ? [winter] : [], clothCols);
};
document.getElementById("cMark").onclick = () => {
  const item = wardrobe.find(c => c.type === "Светр");
  if (!item) return show("out6", "Светр не знайдено");
  item.markAsWorn();
  displayWardrobe();
};
document.getElementById("cCount").onclick = () => {
  const worn = wardrobe.reduce((n, c) => n + (c.isWorn ? 1 : 0), 0);
  show("out6", `Одягалося речей: ${worn} з ${wardrobe.length}`);
};
