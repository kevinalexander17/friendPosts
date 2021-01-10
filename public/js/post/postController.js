$(() => {
  $("#registrarPost").click(() => {
    $("#titulo-post").val("");
    $("#desc-post").val("");
    $("#lugar-post").val("");
    $(".determinate").attr("style", `width: 0%`);
    sessionStorage.setItem("imgNewPost", null);
    $("#registrarPostModal").modal("open");
  });

  //
  $("#btnRegistrarPost").click(() => {
    const post = new Post();
    const user = firebase.auth().currentUser;
    if (user == null) {
      Materrialize.toast(`Para crear el post debe estar autenticado`, 4000);
      return;
    }
    const titulo = $("#titulo-post").val();
    const lugar = $("#lugar-post").val();
    const descripcion = $("#desc-post").val();
    const imagenlink =
      sessionStorage.getItem("imgNewPost") == "null"
        ? null
        : sessionStorage.getItem("imgNewPost");
    post
      .crearPost(user.uid, user.email, titulo, descripcion, lugar, imagenlink)
      .then((result) => {
        Materialize.toast(`Enhorabuena! Post creado satisfactoriamente`, 4000);
        console.log("Creaste un post, ve a la base de datos y checalo");
      })
      .catch((err) => {
        Materrialize.toast(
          `Oooh, hubo un error al crear el post =>${err}`,
          4000
        );
      });
  });
  //
  $("#btnUploadFile").on("change", (e) => {
    const file = e.target.files[0];
    const user = firebase.auth().currentUser;
    const post = new Post();

    post.subirPostImagen(file, user.uid);
  });
});
