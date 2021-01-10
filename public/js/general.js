$(() => {
  firebase.initializeApp(varconfig);
  firebase.analytics();

  //
  const post = new Post();
  post.consultarTodosPost();
  //
  $("#img-user").click(() => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        $("#img-user").attr("src", "img/user-logout.jpg");
        Materialize.toast(`Saliste de la aplicación`, 3000);
        console.log("Saliste de la aplicación, exitosamente");
      })
      .catch((err) => {
        Materialize.toast(`Error al salir de la aplicación ${err}`, 3000);
      });
  });

  //
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      $("#link-ingresar").text("Salir");
      $("#link-registrar").css("display", "none");
      if (user.phtoURL) {
        $("#img-user").attr("src", user.phtoURL);
      } else {
        $("#img-user").attr("src", "img/user-login.jpg");
      }
    } else {
      $("#link-ingresar").text("Ingresar");
      $("#img-user").attr("src", "img/user-logout.jpg");
      $("#link-registrar").css("display", "inline-block");
    }
  });
  //
  $("#link-ingresar").click(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      $("#link-ingresar").text("Ingresar");
      return firebase
        .auth()
        .signOut()
        .then(() => {
          $("#img-user").attr("src", "img/user-logout.jpg");
          Materialize.toast(`Saliste de la aplicación `, 3000);
        })
        .catch((err) => {
          Materialize.toast(`Error al salir de la aplicación ${err}`, 3000);
        });
    }
  });
  //
  $("#btnTodoPost").click(() => {
    const post = new Post();
    post.consultarTodosPost();
  });
  //
  $("#btnMiPost").click(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const post = new Post();
      post.consultarPostPorUsuario(user.email);
      Materialize.toast(`Disfruta tus posts`, 4000);
    } else {
      Materialize.toast(
        `Debes estar autenticado para poder ver tus posts`,
        4000
      );
    }
  });
});
