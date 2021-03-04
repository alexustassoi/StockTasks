// Преобразует байты к 'kb', 'MB' и т.д.
function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

// Список загружаемых файлов
let files = [];

// Создает новый елемент для Dom
function createNewElem(tag, classes = [], content = "") {
  const newElem = document.createElement(tag);
  if (classes.length) {
    newElem.classList.add(...classes);
  }
  if (content) {
    newElem.textContent = content;
  }

  return newElem;
}

function noop() {}


// Этот upload function можно было и не использовать если
// применить к input в html тег label и задать для него 'for'
// с id самого input, после чего в css мы можем скрыть наш input
// то есть задать его нулевую видимость (как =>  display: none )
// и тогда не нужно писать столько кода как сделал автор данного видео
// Vladile Minin
export function upload(selector, options = {}) {
  const input = document.querySelector(selector);
  const preview = createNewElem("div", ["preview"]);
  const open = createNewElem("button", ["btn"], "Открыть");
  const upload = createNewElem(
    "button",
    ["btn", "primary", "upload"],
    "Загрузить"
  );

  const onupload = options.onupload ? options.onupload : noop;

  input.insertAdjacentElement("afterend", preview);
  input.insertAdjacentElement("afterend", upload);
  input.insertAdjacentElement("afterend", open);
  upload.style.visibility = "hidden";

  // Устанавливает input свойство 'multiple', что указавает на
  // то, что input при выборе файлов может выьирать не один
  // файл а несколько за один раз
  if (options.multi) {
    input.setAttribute("multiple", true);
  }

  // Устанавливает ограничение на тип загружаемых файлов
  // во время выбора файлов через input в диалоговом окне
  // файлы которые не будут соотвествовать установленным типам
  // будут иметь вид не активных
  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute("accept", options.accept.join(","));
  }

  const changeHandler = (event) => {
    if (!event.target.files.length) {
      return;
    }

    files = [...event.target.files];

    // console.log(files);
    preview.innerHTML = "";
    files.forEach((file) => {
      if (!file.type.match("image")) {
        return;
      }

      // start чтения файла помощью class FileReader помогает прочитать
      // файл как текст или как в нашем случае как Url адресс для вывода
      // этого файла в теге img
      const reader = new FileReader();

      reader.onload = (ev) => {
        const src = ev.target.result;
        preview.insertAdjacentHTML(
          "afterbegin",
          `
          <div class='preview-image'>
            <div class='preview-remove' data-name='${file.name}'>&times;</div>
            <img src="${src}" alt="${file.name}">
            <div class='preview-info'>
              <span>${file.name}</span>
              ${bytesToSize(file.size)}
            </div>
          </div>
        `
        );
      };

      reader.readAsDataURL(file);

      // End чтения файла с помощью class FileReader
    });
    upload.style.visibility = "visible";
  };

  function uploadHandler() {
    document.querySelectorAll(".preview-remove").forEach((el) => el.remove());
    document.querySelectorAll(".preview-info").forEach((el) => {
      el.innerHTML = "";
      el.style.bottom = "4px";
      el.insertAdjacentHTML(
        "afterbegin",
        `<div class='preview-progress'></div>`
      );
    });
    onupload(files);
  }

  // Start: Устанавливаем обработчики событий
  open.addEventListener("click", () => {
    $(input).trigger("click");
  });

  input.addEventListener("change", changeHandler);
  upload.addEventListener("click", uploadHandler);
  preview.addEventListener("click", removeElem);

  // End: Устанавливаем обработчики событий
}

// Удаляет элемент из Dom с задержкой по времени 
// в 300 милисекунд после надатия на кнопку закрыть 
// элемент 
function removeElem(event) {
  const upload = document.querySelector(".upload");
  if (!(files.length - 1)) {
    upload.style.visibility = "hidden";
  }
  
  const removeElem = event.target;
  if (removeElem.classList.contains("preview-remove")) {
    removeElem.parentNode.classList.add("preview-removing");
    const timeremoving = setTimeout(() => {
      removeElem.parentNode.remove();
    }, 300);
    const name = removeElem.getAttribute("data-name");
    files = files.filter((elem) => {
      return elem.name != name;
    });
  }
}
