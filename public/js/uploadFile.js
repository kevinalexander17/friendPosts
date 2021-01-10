//
// Files

function UploadArchivoExcel() {
  var file = document.querySelector("#btnUploadExcelFile").files[0];
  if (file == null) {
    Materialize.toast(`Debes seleccionar un archivo`, 3000);
  }
  console.log("Subiendo archivo EXCEL");
  const storageRef = firebase.storage().ref();
  const user = firebase.auth().currentUser;
  // Create the file metadata
  var metadata = {
    contentType: file.type,
  };

  //
  var uploadTask = storageRef
    .child(`archivos/${user.uid}/${file.name}`)
    .put(file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function (snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const percentage =
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      $(".determinate").attr("style", `width: ${percentage}%`);
    },
    function (err) {
      Materialize.toast(
        `Error subiendo el archivo excel al Storage => ${err.message}`,
        4000
      );
    },
    function () {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref
        .getDownloadURL()
        .then(function (downloadURL) {
          console.log(downloadURL);
          sessionStorage.setItem("newArchivoExcel", downloadURL);
          Materialize.toast(`Descarga exitosa de url => ${downloadURL}`, 4000);
        })
        .catch((err) => {
          Materialize.toast(
            `Error obteniendo downloadURL => ${err.message}`,
            4000
          );
        });
    }
  );
}
