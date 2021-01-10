class autenticacion {
  //
  authEmailPassword(email, password) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user.emailVerified) {
          $("#img-user").attr("src", "img/user-login.jpg");
          $("#link-registrar").css("display", "none");
          Materialize.toast(`Bienvenido ${result.user.displayName}`, 5000);
          console.log("Enhorabuena!!!! Ingresaste a la aplicación");
        } else {
          firebase.auth().signOut();
          Materialize.toast(
            `Por favor realiza la verificacion de la cuenta`,
            5000
          );
        }
      });
    $("#loginModal").modal("hide");
  }
  //
  crearCuentaEmailPass(email, password, nombres) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        result.user.updateProfile({
          displayName: nombres,
        });
        const configuracion = {
          url: "http://localhost:5501/public/",
        };
        result.user.sendEmailVerification(configuracion).catch((err) => {
          console.error(err);
          Materialize.toast(err.message, 4000);
        });
        firebase.auth().signOut();
        Materialize.toast(
          `Bienvenido ${nombres},debes hacer el proceso de verificación `,
          4000
        );
        $("#registrarUsuarioModal").modal("hide");
      })
      .catch((err) => {
        console.error(err);
        Materialize.toast(err.message, 4000);
      });
  }
  //
  authCuentaGoogle() {
    const proveedor = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(proveedor)
      .then((result) => {
        $("#img-user").attr("src", result.user.photoURL);
        $("#link-registrar").css("display", "none");
        Materialize.toast(
          `Enhorabuena. Bienvenido ${result.user.displayName}!`,
          4000
        );
        console.log(
          "Ingresaste a la aplicación con una cuenta de google ==> " +
            result.user
        );
      })
      .catch((err) => {
        console.error(err);
        Materialize.toast(`Error al autenticarse con Google ${err}`, 4000);
      });
  }

  authCuentaFacebook() {
    const proveedor = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(proveedor)
      .then((result) => {
        $("#img-user").attr("src", result.user.photoURL);
        $("#link-registrar").css("display", "none");
        Materialize.toast(
          `Enhorabuena. Bienvenido ${result.user.displayName}!`,
          4000
        );
        console.log(
          "Ingresaste a la aplicación con una cuenta de facebook ==> " +
            result.user
        );
      })
      .catch((err) => {
        console.error(err);
        Materialize.toast(`Error al autenticarse con Facebook ${err}`, 4000);
      });
  }
}
