
// app.js
  window.navigate = navigate;
// Importa los módulos de Firebase desde el CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, getDocs, collection  } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// Configura Firebase con tus credenciales
const firebaseConfig = {
  apiKey: "AIzaSyAvZiluDnZ-f52nYDqMc_MrrT0tbN5gnmI",
  authDomain: "veterinaria-43647.firebaseapp.com",
  projectId: "veterinaria-43647",
  storageBucket: "veterinaria-43647.firebasestorage.app",
  messagingSenderId: "253312669456",
  appId: "1:253312669456:web:079bf605df09836ef2b795",
  measurementId: "G-HK0KFYPK1M"
};

// Inicializa la app y la autenticación
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


const obtenerUsuarios = async () => {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} =>`, doc.data());
        });
      };

      obtenerUsuarios();



// Manejo del formulario
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      document.getElementById("login-screen").style.display = "none";
      document.getElementById("loading-screen").style.display = "flex";

      setTimeout(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("app").style.display = "flex";
      }, 100);
    })
    .catch((error) => {
      document.getElementById("error-message").innerText = "Credenciales incorrectas";
      console.error(error);
    });
});


window.logout = function () {
  firebase.auth().signOut()
    .then(() => {
      document.getElementById("app").style.display = "none";
      document.getElementById("login-screen").style.display = "flex";
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error);
    });
};

//funcion para inciar sesion
function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(error => {
      const errorMessage = document.getElementById('error-message');
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage.textContent = 'Correo electrónico no registrado.';
          break;
        case 'auth/wrong-password':
          errorMessage.textContent = 'Contraseña incorrecta.';
          break;
        case 'auth/invalid-email':
          errorMessage.textContent = 'Correo electrónico inválido.';
          break;
        default:
          errorMessage.textContent = 'Error al iniciar sesión: ' + error.message;
      }
    });
}

function logout() {
  auth.signOut();
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('loading-screen').style.display = 'none';
}
  
// NAVEGACIONES DENTRO DEL SITIO
function navigate(view) {
  const content = document.getElementById('content');
  content.innerHTML = '';

  // INICIO (DASHBOARD)
  switch (view) {
    case 'inicio':
      
      break;

    // propietarios
    case 'propietarios':
      content.innerHTML = `
        <h2>Propietarios y Mascotas</h2>
        <form id="form-propietario" class="form-stdb">
          <input type="text" id="nombre" placeholder="Nombre del propietario" required />
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1rem; color: #6c788aaf;">🇨🇱 +56</span>
            <input type="tel" id="telefono" placeholder="912345678" required pattern="[0-9]{9}" inputmode="numeric" />
          </div>
          <input type="text" id="mascota" placeholder="Nombre de la mascota" required />
          <button type="submit" id="btn-agregar">Agregar</button>
          <input type="hidden" id="edit-id" />
        </form>
        <table id="tabla-propietarios">
          <thead>
            <tr>
              <th>Propietario</th>
              <th>Teléfono</th>
              <th>Mascota</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;

      const form = document.getElementById('form-propietario');
      const tabla = document.querySelector('#tabla-propietarios tbody');
      const btnAgregar = document.getElementById('btn-agregar');
      const editId = document.getElementById('edit-id');

      function mostrarPropietarios() {
        tabla.innerHTML = '';
        db.collection('propietarios').get().then(snapshot => {
          snapshot.forEach(doc => {
            const p = doc.data();
            const fila = document.createElement('tr');
            fila.innerHTML = `
              <td>${p.nombre}</td>
              <td>${p.telefono}</td>
              <td>${p.mascota}</td>
              <td>
                <button onclick="editarPropietario('${doc.id}', '${p.nombre}', '${p.telefono}', '${p.mascota}')" style="background:#64b5f6;color:white;border:none;padding:5px 10px;border-radius:8px;cursor:pointer;margin-right:5px;">
                  ✏️
                </button>
                <button onclick="eliminarPropietario('${doc.id}')" style="background:#e57373;color:white;border:none;padding:5px 10px;border-radius:8px;cursor:pointer;">
                  🗑️
                </button>
              </td>
            `;
            tabla.appendChild(fila);
          });
        }).catch(err => {
          console.error('Error al obtener propietarios:', err);
        });
      }

      window.eliminarPropietario = (id) => {
        if (confirm('¿Estás seguro que deseas eliminar este propietario? Esta acción no se puede deshacer.')) {
          db.collection('propietarios').doc(id).delete()
            .then(mostrarPropietarios)
            .catch(err => alert('Error al eliminar: ' + err));
        }
      };

      window.editarPropietario = (id, nombre, telefono, mascota) => {
        document.getElementById('nombre').value = nombre;
        document.getElementById('telefono').value = telefono;
        document.getElementById('mascota').value = mascota;
        editId.value = id;
        btnAgregar.textContent = 'Guardar cambios';
      };

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const mascota = document.getElementById('mascota').value.trim();
        const id = editId.value;

        if (!/^[0-9]{9}$/.test(telefono)) {
          alert('El número debe tener 9 dígitos, sin +56. Ej: 912345678');
          return;
        }

        if (id) {
          db.collection('propietarios').doc(id).update({ nombre, telefono, mascota })
            .then(() => {
              form.reset();
              editId.value = '';
              btnAgregar.textContent = 'Agregar';
              mostrarPropietarios();
            })
            .catch(err => alert('Error al actualizar: ' + err));
        } else {
          db.collection('propietarios').add({ nombre, telefono, mascota })
            .then(() => {
              form.reset();
              mostrarPropietarios();
            })
            .catch(err => alert('Error al agregar: ' + err));
        }
      });

      mostrarPropietarios();
      break;

      // ORDENES MEDICAS
    case 'ordenes':
          content.innerHTML = `
        <h2>Órdenes Médicas</h2>
        <form id="form-orden" class="form-stdb">
          <input type="text" id="mascota-orden" placeholder="Nombre de la mascota" required />
          <input type="text" id="diagnostico" placeholder="Diagnóstico" required />
          <input type="text" id="tratamiento" placeholder="Tratamiento" required />
          <input type="date" id="fecha" required />
          <button type="submit">Agregar</button>
        </form>
        <table id="tabla-ordenes">
          <thead>
            <tr>
              <th>Mascota</th>
              <th>Diagnóstico</th>
              <th>Tratamiento</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;

      const formOrden = document.getElementById('form-orden');
      const tablaOrdenes = document.querySelector('#tabla-ordenes tbody');

      formOrden.addEventListener('submit', function (e) {
        e.preventDefault();

        const mascota = document.getElementById('mascota-orden').value;
        const diagnostico = document.getElementById('diagnostico').value;
        const tratamiento = document.getElementById('tratamiento').value;
        const fecha = document.getElementById('fecha').value;

        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${mascota}</td>
          <td>${diagnostico}</td>
          <td>${tratamiento}</td>
          <td>${fecha}</td>
        `;
        tablaOrdenes.appendChild(fila);

        formOrden.reset();
      });
      break;
      // Calendario de citas
    case 'calendario':
          content.innerHTML = `
        <h2>Calendario de Citas</h2>
        <form id="form-cita" class="form-stdb">
          <input type="text" id="mascota-cita" placeholder="Nombre de la mascota" required />
          <input type="date" id="fecha-cita" required />
          <input type="time" id="hora-cita" required />
          <input type="text" id="motivo" placeholder="Motivo" required />
          <button type="submit">Agendar</button>
        </form>
        <table id="tabla-citas">
          <thead>
            <tr>
              <th>Mascota</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;

      const formCita = document.getElementById('form-cita');
      const tablaCitas = document.querySelector('#tabla-citas tbody');

      formCita.addEventListener('submit', function (e) {
        e.preventDefault();

        const mascota = document.getElementById('mascota-cita').value;
        const fecha = document.getElementById('fecha-cita').value;
        const hora = document.getElementById('hora-cita').value;
        const motivo = document.getElementById('motivo').value;

        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${mascota}</td>
          <td>${fecha}</td>
          <td>${hora}</td>
          <td>${motivo}</td>
        `;
        tablaCitas.appendChild(fila);

        formCita.reset();
      });
      break;
      // DOCUMENTOS
    case 'documentos':
          content.innerHTML = `
        <h2>Documentos</h2>
        <form id="form-documento" class="form-stdb">
          <input type="text" id="nombre-documento" placeholder="Nombre del documento" required />
          <input type="text" id="mascota-documento" placeholder="Nombre de la mascota" required />
          <input type="text" id="descripcion-documento" placeholder="Descripción" required />
          <button type="submit">Agregar</button>
        </form>
        <table id="tabla-documentos">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Mascota</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;

      const formDoc = document.getElementById('form-documento');
      const tablaDoc = document.querySelector('#tabla-documentos tbody');

      formDoc.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombreDoc = document.getElementById('nombre-documento').value;
        const mascotaDoc = document.getElementById('mascota-documento').value;
        const descripcionDoc = document.getElementById('descripcion-documento').value;

        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${nombreDoc}</td>
          <td>${mascotaDoc}</td>
          <td>${descripcionDoc}</td>
        `;
        tablaDoc.appendChild(fila);

        formDoc.reset();
      });
      break;
      // PERFIL
    case 'perfil':
      content.innerHTML = `
    <h2>Perfil de la Clínica</h2>
    <div class="perfil-info">
      <p><strong>Nombre:</strong> Clínica Veterinaria Patitas Felices</p>
      <p><strong>Dirección:</strong> Av. Siempreviva 742, Springfield</p>
      <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
      <p><strong>Email:</strong> contacto@patitasfelices.cl</p>
      <p><strong>Horario:</strong> Lun a Vie 9:00 - 18:00</p>
    </div>
  `;
      break;
    // CONFIGURACION
    case 'Cerrar sesión':
    break;
          

    default:
      content.innerHTML = '<p>Sección no encontrada.</p>';
  }
}

// Cargar vista inicial por defecto
document.addEventListener('DOMContentLoaded', () => navigate('inicio'));
