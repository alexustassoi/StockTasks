import firebase from "firebase/app";
import "firebase/storage";
import { upload } from "./upload.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIl8w3c-vZfrU2RvqcsZp9rES8ZcJU-Tw",
  authDomain: "fe-upload-ae78f.firebaseapp.com",
  projectId: "fe-upload-ae78f",
  storageBucket: "fe-upload-ae78f.appspot.com",
  messagingSenderId: "1087511159880",
  appId: "1:1087511159880:web:3b1f34bacf639ae6c5e47d",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
// console.log('storage: ', storage);


// Функция для загрузки файлов на сервер Firebase 
// function расположена в файле upload.js и импортирована (import)  
upload("#file", {
  multi: true,
  accept: [".png", ".jpg", ".jpeg", "gif"],
  onupload(files) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`);
      const task = ref.put(file);

      task.on(
        "state_changed",
        (snapshot) => {
          const percentage = (
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0);
          // console.log(percentage);  // этот console.log будет распечатывать несколько раз и выводить процент загрузки данных передаваемых в storage на текущее время

          const previewProgress = document.querySelectorAll(
            ".preview-progress"
          );
          console.log("previewProgress: ", index);

          const block = previewProgress[index];
          block.textContent = percentage + '%';
          block.style.width = `${percentage}%`;
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log("Complete");
          task.snapshot.ref.getDownloadURL().then(url => {
          console.log('Download url', url);
          });   // вот так мы получаем ссылку на загружаемые данные в storage firebase 
        }
      );
    });
  },
});
