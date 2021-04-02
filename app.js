import firebase from "firebase/app";
import "firebase/storage";
import { upload } from "./upload.js";

const firebaseConfig = {
  apiKey: "AIzaSyDytl7UXAm1eldNdYBAgkrNvKhwPeze30I",
  authDomain: "fe-upload-surstrommed.firebaseapp.com",
  projectId: "fe-upload-surstrommed",
  storageBucket: "fe-upload-surstrommed.appspot.com",
  messagingSenderId: "516469886268",
  appId: "1:516469886268:web:2878476de2374ad6f1e239",
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload("#file", {
  multi: true,
  accept: [".png", ".jpg", ".jpeg", ".gif"],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`);
      const task = ref.put(file);
      task.on(
        "state_changed",
        (snapshot) => {
          const percentage =
            ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(
              0
            ) + "%";
          const block = blocks[index].querySelector(".preview-info-progress");
          block.textContent = percentage;
          block.style.width = percentage;
        },
        (error) => {
          console.log(error);
        },
        () => {
          task.snapshot.ref.getDownloadURL().then((url) => {
            window.open(url);
          });
        }
      );
    });
  },
});
