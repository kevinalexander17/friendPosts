class Post {
  constructor() {
    //atributos que esten almacenados en la bd como datime se recuperarán como TIMESTAMP
    this.db = firebase.firestore();
    //const settings = { timestampsInSnapshots: true };
    // this.db.settings(settings);
  }
  //
  crearPost(uid, email, titulo, descripcion, lugar, imagelink) {
    return this.db
      .collection("posts")
      .add({
        uid: uid,
        autor: email,
        titulo: titulo,
        descripcion: descripcion,
        lugar: lugar,
        imagelink: imagelink,
        //  fecha: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((refDoc) => {
        console.log(`Id del post => ${refDoc.id}`);
      })
      .catch((err) => {
        console.error(`Error al crear un post => ${err}`);
      });
  }
  //
  consultarTodosPost() {
    this.db
      .collection("posts")
      .orderBy("titulo", "asc")
      .onSnapshot((querysnapshot) => {
        $("#posts").empty();
        if (querysnapshot.empty) {
          $("#posts").append(this.getPostVacioTemplate());
        } else {
          querysnapshot.forEach((post) => {
            let postHtml = this.getPostTemplate(
              post.id,
              post.data().autor,
              post.data().titulo,
              post.data().descripcion,
              post.data().lugar,
              post.data().imagelink
              //  Utilidad.obtenerFecha(post.data().fecha.toDate())
            );
            $("#posts").append(postHtml);
          });
        }
      });
  }
  //
  consultarPostPorUsuario(email) {
    this.db
      .collection("posts") //.orderBy("fecha", "asc")
      .where("autor", "==", email)
      .onSnapshot((querysnapshot) => {
        $("#posts").empty();
        if (querysnapshot.empty) {
          $("#posts").append(this.getPostVacioTemplate());
        } else {
          querysnapshot.forEach((post) => {
            let postHtml = this.getPostTemplate(
              post.id,
              post.data().autor,
              post.data().titulo,
              post.data().descripcion,
              post.data().lugar,
              post.data().imagelink
              //Utilidad.obtenerFecha(post.data().fecha.toDate())
            );
            $("#posts").append(postHtml);
          });
        }
      });
  }

  //
  subirPostImagen(file, uid) {
    const refStorage = firebase.storage().ref(`imgsPosts/${uid}/${file.name}`);
    const task = refStorage.put(file);
    task.on(
      "state_changed",
      (snapshot) => {
        const percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        $(".determinate").attr("style", `width: ${percentage}%`);
      },
      (err) => {
        Materialize.toast(
          `Error subiendo el archivo al post => ${err.message}`,
          4000
        );
      },
      () => {
        task.snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            sessionStorage.setItem("imgNewPost", url);
            Materialize.toast(`Descarga exitosa de url => ${url}`, 4000);
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
  //fecha
  getPostTemplate(id, autor, titulo, descripcion, lugar, imagelink) {
    return `<div class="card">
  <img src="${imagelink}" class="card-img-top">
  <div class="card-body">
    <h5 class="card-title">${titulo}</h5>
    <h5 class="card-title">${lugar}</h5>
    <p class="card-text">${descripcion}</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">${autor}</li>
  </ul>
  <div class="card-body">
    <a href="#" class="btn btn-info" data-toggle="modal"
            data-target="#editarPostModal" onclick="editarPost('${id}','${titulo}','${lugar}','${descripcion}')">Editar</a>
    <a href="#" class="btn btn-danger" onclick="eliminarPost('${id}')">Eliminar</a>
  </div>
</div>`;
  }
  /*<li class="list-group-item">${fecha}</li>*/
  //
  getPostVacioTemplate() {
    return `<div class="card" style="width: 500px;height: 600px;">
  <img src="/public/img/test.jpg" class="card-img-top">
  <div class="card-body">
    <h5 class="card-title">On Holiday</h5>
    <h5 class="card-title">Valencia, Spain</h5>
    <p class="card-text">Hey! I had a good time in Madrid, it was a quite amazing experience.</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">vmqr15@gmail.com</li>
  </ul>
  <div class="card-body" style="text-align:center">
    <a href="#" class="card-link btn btn-info">Editar</a>
    <a href="#" class="card-link btn btn-danger">Eliminar</a>
  </div>
</div>`;
  }
  /*<li class="list-group-item">10/10/2020</li>*/
}
//
function editarPost(id, titulo, lugar, descripcion) {
  const user = firebase.auth().currentUser;
  if (user == null) {
    Materrialize.toast(`Para editar el post debe estar autenticado`, 4000);
    return;
  }
  console.log("BOTON EDITAR POST");
  document.getElementById("edittitulo-post").value = titulo;
  document.getElementById("editlugar-post").value = lugar;
  document.getElementById("editdesc-post").value = descripcion;
  var btnEditar = document.getElementById("btneditarPost");
  btnEditar.onclick = () => {
    titulo = document.getElementById("edittitulo-post").value;
    lugar = document.getElementById("editlugar-post").value;
    descripcion = document.getElementById("editdesc-post").value;
    return firebase
      .firestore()
      .collection("posts")
      .doc(id)
      .update({
        titulo,
        lugar,
        descripcion,
      })
      .then(() => {
        console.log("Editando el post");
        Materialize.toast(`Post editado correctamente`, 3000);
      })
      .catch((err) => {
        console.error("Oohps! Hubo un error editando el post");
        Materialize.toast(
          `Ohh no! algo salió mal al editar el post => ${err}`,
          3000
        );
      });
  };
}
//
function eliminarPost(id) {
  console.log("BOTON ELIMINAR POST");

  console.log("BOTON ELIMINAR POST");
  firebase
    .firestore()
    .collection("posts")
    .doc(id)
    .delete()
    .then(() => {
      console.log("Eliminando el post");
      Materialize.toast(`Post eliminado correctamente`, 3000);
    })
    .catch((err) => {
      console.error("Oohps! Hubo un error eliminando el post");
      Materialize.toast(
        `Ohh no! algo salió mal al eliminar el post => ${err}`,
        3000
      );
    });
}
