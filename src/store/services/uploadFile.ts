import app from "@/config/firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

const storage = getStorage(app);

export const uploadFile = async (
  file: File,
  setUploadProgress: any,
  setDownloadURL?: any
) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `images/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error(error);
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          if (setDownloadURL) {
            setDownloadURL(downloadURL);
          }
          resolve(downloadURL);
        });
      }
    );
  });
};

export const deleteImage = (name: string) => {
  const fileRef = ref(storage, `images/${name}`);

  // Delete the file
  deleteObject(fileRef)
    .then(() => {
      console.log("deleted");
    })
    .catch((error) => {
      console.log(error);
    });
};
