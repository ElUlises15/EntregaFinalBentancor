function validateForm() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validación del nombre
  if (name === "") {
    alert("Por favor, ingrese su nombre.");
    return false;
  }

  // Validación del correo electrónico
  if (!emailRegex.test(email)) {
    alert("Por favor, ingrese una dirección de correo electrónico válida.");
    return false;
  }

  // Validación del mensaje
  if (message === "") {
    alert("Por favor, ingrese su mensaje.");
    return false;
  }

  return true;
}
const modoOscuroBtn = document.getElementById("modoOscuroBtn");
const body = document.body;

if (localStorage.getItem("modoOscuro") === "habilitado") {
  body.classList.add("modo-oscuro");
}

modoOscuroBtn.addEventListener("click", () => {
  body.classList.toggle("modo-oscuro");

  if (body.classList.contains("modo-oscuro")) {
    localStorage.setItem("modoOscuro", "habilitado");
  } else {
    localStorage.setItem("modoOscuro", "deshabilitado");
  }
});
