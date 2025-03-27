const firebaseConfig = {
  apiKey: "AIzaSyCBOya-GzooLAeB3n_apXLwgWurdFsFMfQ",
  authDomain: "demoweb-b19ba.firebaseapp.com",
  projectId: "demoweb-b19ba",
  storageBucket: "demoweb-b19ba.firebasestorage.app",
  messagingSenderId: "84938500654",
  appId: "1:84938500654:web:f660c4b01a3fdc095f4dbf"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  let nombre = document.getElementById('nombre').value;
  let email = document.getElementById('email').value;
  let mensaje = document.getElementById('mensaje').value;
  let imagen = document.getElementById('imagen').value;

  db.collection("usuarios").add({
    nombre,
    email,
    mensaje,
    imagen
  })
    .then(() => {
      console.log("Contacto guardado en Firestore");
      document.getElementById('contactForm').reset();
      mostrarContactos();
    })
    .catch(error => console.error("Error al guardar contacto: ", error));
});

function mostrarContactos() {
  let contactList = document.getElementById('contactList');
  contactList.innerHTML = '';

  db.collection("usuarios").get().then((dataContact) => {
    dataContact.forEach((doc) => {
      let contacto = doc.data();
      let div = document.createElement('div');
      div.classList.add('contacto');

      div.innerHTML = 
      `<p><strong>Nombre:</strong> ${contacto.nombre}</p>
       <p><strong>Email:</strong> ${contacto.email}</p>
       <p><strong>Mensaje:</strong> ${contacto.mensaje}</p>`;

      if (contacto.imagen) {
        let img = document.createElement('img');
        img.src = contacto.imagen;
        img.width = 100;
        div.appendChild(img);
      }

      let botonBorrar = document.createElement('button');
      botonBorrar.textContent = 'Borrar';
      botonBorrar.onclick = function () {
        borrarContacto(doc.id);
      };
      div.appendChild(botonBorrar);

      contactList.appendChild(div);
    });
  });
}

function borrarContacto(id) {
  db.collection("usuarios").doc(id).delete()
    .then(() => {
      console.log("Contacto eliminado de Firestore");
      mostrarContactos();
    })
    .catch(error => console.error("Error al eliminar contacto: ", error));
}

function borrarTodos() {
  db.collection("usuarios").get().then((dataContact) => {
    dataContact.forEach((doc) => {
      doc.ref.delete();
    });
    console.log("Todos los contactos eliminados de Firestore");
    mostrarContactos();
  });
}

mostrarContactos();



