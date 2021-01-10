$(() => {
  const auth = new autenticacion();
  //btn registrar usuario
  $("#btnRegistrarse").click((e) => {
    e.preventDefault();
    const nombres = $("#user-name").val();
    const email = $("#email-user").val();
    const password = $("#pass-user").val();
    auth.crearCuentaEmailPass(email, password, nombres);
  });
  //
  $("#btnLogIn").click(() => {
    const email = $("#login-email").val();
    const pass = $("#login-password").val();
    auth.authEmailPassword(email, pass);
  });

  //
  $("#googleLogin").click(() => auth.authCuentaGoogle());
  //
  $("#facebookLogin").click(() => auth.authCuentaFacebook());
});
