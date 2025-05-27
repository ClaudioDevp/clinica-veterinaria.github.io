
// app.js
  window.navigate = navigate;
// Importa los módulos de Firebase desde el CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, getDocs, collection, doc, updateDoc,
  addDoc,
  deleteDoc, query, where, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

  
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
const storage = getStorage(app); // app es tu instancia de Firebase


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
    getAuth().signOut()
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
content.innerHTML = `
<h2>Dashboard Veterinaria</h2>
<div class="resumen" style="display: flex; gap: 20px; flex-wrap: wrap;">
  <div class="form-card_1" id="citasDia" style="flex: 1; min-width: 200px; padding: 16px; border: 1px solid #ccc; border-radius: 8px;">
    <h3>Citas del Día</h3>
    <p><span id="numCitas" class= "numcita">0</span></p>
  </div>
  <div class="form-card_2" id="propietarios" style="flex: 1; min-width: 350px; padding: 16px; border: 1px solid #ccc; border-radius: 8px;">
    <h3>Propietarios Registrados</h3>
    <p><span id="numPropietarios" class= "numcita">0</span></p>
  </div>
  <div class="form-card_3" id="mascotas" style="flex: 1; min-width: 200px; padding: 16px; border: 1px solid #ccc; border-radius: 8px;">
    <h3>Mascotas Registradas</h3>
    <p><span id="numMascotas" class= "numcita">0</span></p>
  </div>
</div>
<hr>

<div id="mensajeSaludo" class ="msj"></div>

<div class="form-card_4">
<h3>Notificar al Cliente (WhatsApp)</h3>
<form id="whatsappForm">
  <label for="telefono">Número de WhatsApp:</label><br>
  <input type="tel" id="telefono" placeholder="+56912345678" required><br><br>

  <label for="mensaje">Mensaje:</label><br>
  <textarea id="mensaje" placeholder="Escribe el mensaje..." rows="3" required></textarea><br><br>

  <button id="enviarWhatsApp" type="submit" style="display:flex; align-items:center; gap:6px; background-color:#25D366; color:white; border:none; padding:10px 16px; border-radius:8px; font-size:16px; cursor:pointer;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" style="width:24px; height:24px;">
    Enviar por WhatsApp
  </button>
</form>
</div>
`;

// Evento para enviar mensaje por WhatsApp
document.getElementById('whatsappForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  let telefono = document.getElementById('telefono').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();

  // Validación simple
  if (!telefono || !mensaje) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Limpieza del número
  telefono = telefono.replace(/\s+/g, '').replace('+', '');

  if (!telefono.match(/^\d{8,15}$/)) {
    alert('Número de WhatsApp inválido. Usa formato +56912345678 o similar.');
    return;
  }

  const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;

  try {
    window.open(url, '_blank');
  } catch (error) {
    console.error('No se pudo abrir WhatsApp:', error);
    alert('Hubo un error al intentar abrir WhatsApp.');
  }
});



setTimeout(async () => {

  // Generar mensaje inteligente de saludo
const horaActual = new Date().getHours();
let saludo = "¡Hola! ...";

if (horaActual >= 5 && horaActual < 12) {
saludo = "¡Buenos días! La Ilustre Municipalidad de Maullín le desea una excelente jornada laboral ☀️";
} else if (horaActual >= 12 && horaActual < 19) {
saludo = "¡Buenas tardes! Esperamos que su día esté yendo de maravilla 🌤️";
} else {
saludo = "¡Buenas noches! Que tenga un merecido descanso 😴";
}

document.getElementById("mensajeSaludo").textContent = saludo;
try {
const hoy = new Date().toISOString().split('T')[0];

  const citasSnapshot = await getDocs(query(collection(db, "citas"), where("fecha", "==", hoy)));
  const propietariosSnapshot = await getDocs(collection(db, "propietarios"));
  const mascotasSnapshot = await getDocs(collection(db, "mascotas"));

  // Mostrar cantidades
  document.getElementById('numCitas').textContent = citasSnapshot.size;
  document.getElementById('numPropietarios').textContent = propietariosSnapshot.size;
  document.getElementById('numMascotas').textContent = mascotasSnapshot.size;

  // Botón exportar CSV
  document.getElementById('exportarCSV').addEventListener('click', () => {
    const citas = [];
    citasSnapshot.forEach(doc => citas.push(doc.data()));

    let csv = "Nombre Mascota,Nombre Dueño,Fecha,Hora\n";
    citas.forEach(c => {
      csv += `${c.nombreMascota || ''},${c.nombreDueno || ''},${c.fecha || ''},${c.hora || ''}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `citas_${hoy}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });


} catch (error) {
  console.error("Error cargando datos del dashboard:", error);
}
}, 0);
break;


    // PROPIETARIOS Y MASCOTAS
    // PROPIETARIOS Y MASCOTAS
case 'propietarios':

  content.innerHTML = `
    <h2>Propietarios y Mascotas</h2>

    <form id="form-propietario" class="form-stdb">
      <input type="text" id="nombre" placeholder="Nombres y Apellidos" required />
      <input type="text" id="rut" placeholder="RUT (ej: 12.345.678-9)" required />
      <input type="email" id="correo" placeholder="Correo electrónico" required />
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 1rem; color: #6c788aaf;">🇨🇱 +56</span>
        <input type="tel" id="telefono" placeholder="912345678" required pattern="[0-9]{9}" inputmode="numeric" />
      </div>
      <button type="submit" id="btn-agregar">Agregar</button>
      <input type="hidden" id="edit-id" />
    </form>

    <input type="text" id="busqueda" placeholder="Buscar por propietario o mascota..." class="form-stdb" style="margin:10px 0;padding:5px;width:100%;max-width:400px;" />

    <table id="tabla-propietarios">
      <thead>
        <tr>
          <th>Propietario</th>
          <th>Teléfono</th>
          <th>Mascotas (Ficha)</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>

    <button id="btn-exportar" style="margin: 10px 0; padding: 8px 16px; border-radius: 6px; background: #4caf50; color: white; border: none; cursor: pointer;">
      📥 Descargar Excel
    </button>

    <!-- Modal para agregar/editar mascota -->
    <div id="modal-mascota" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; 
      background: rgba(0,0,0,0.5); align-items:center; justify-content:center;">
      <form id="form-mascota" class="form-stdb" style="background:#fff; padding:20px; border-radius:8px; max-width:400px; width:90%;">
        <h3 id="modal-titulo">Agregar Mascota</h3>
        <input type="text" id="mascota-nombre" placeholder="Nombre" required />
        <input type="text" id="mascota-especie" placeholder="Especie (ej: perro, gato)" required />
        <input type="text" id="mascota-raza" placeholder="Raza" />
        <input type="date" id="mascota-fechaNacimiento" placeholder="Fecha de nacimiento" />
        <input type="number" id="mascota-edad" placeholder="Edad (años)" min="0" />
        <select id="mascota-sexo" required>
          <option value="">Sexo</option>
          <option value="macho">Macho</option>
          <option value="hembra">Hembra</option>
        </select>
        <input type="text" id="mascota-color" placeholder="Color" />
        <input type="text" id="mascota-numeroIdentificacion" placeholder="Número de identificación" />
        <input type="text" id="mascota-estadoReproductivo" placeholder="Estado reproductivo (castrado, entero, etc.)" />
        <input type="hidden" id="mascota-id" />
        <input type="hidden" id="mascota-propietarioId" />
        <div style="margin-top:10px; display:flex; justify-content: flex-end; gap:10px;">
          <button type="button" id="btn-cerrar-modal" style="background:#e57373; color:#fff; border:none; padding:5px 10px; border-radius:6px;">Cancelar</button>
          <button type="submit" id="btn-guardar-mascota" style="background:#4caf50; color:#fff; border:none; padding:5px 10px; border-radius:6px;">Guardar</button>
        </div>
      </form>
    </div>
  `;

  const form = document.getElementById('form-propietario');
  const tabla = document.querySelector('#tabla-propietarios tbody');
  const btnAgregar = document.getElementById('btn-agregar');
  const editId = document.getElementById('edit-id');

  // Modal elementos
  const modalMascota = document.getElementById('modal-mascota');
  const formMascota = document.getElementById('form-mascota');
  const modalTitulo = document.getElementById('modal-titulo');
  const btnCerrarModal = document.getElementById('btn-cerrar-modal');

  // Abrir modal para agregar/editar mascota
  window.abrirModalMascota = (propietarioId, mascota = {}) => {
    modalMascota.style.display = 'flex';
    modalTitulo.textContent = mascota.id ? 'Editar Mascota' : 'Agregar Mascota';
    document.getElementById('mascota-nombre').value = mascota.nombre || '';
    document.getElementById('mascota-especie').value = mascota.especie || '';
    document.getElementById('mascota-raza').value = mascota.raza || '';
    document.getElementById('mascota-fechaNacimiento').value = mascota.fechaNacimiento || '';
    document.getElementById('mascota-edad').value = mascota.edad || '';
    document.getElementById('mascota-sexo').value = mascota.sexo || '';
    document.getElementById('mascota-color').value = mascota.color || '';
    document.getElementById('mascota-numeroIdentificacion').value = mascota.numeroIdentificacion || '';
    document.getElementById('mascota-estadoReproductivo').value = mascota.estadoReproductivo || '';
    document.getElementById('mascota-id').value = mascota.id || '';
    document.getElementById('mascota-propietarioId').value = propietarioId;
  };
  // Cerrar modal
  btnCerrarModal.onclick = () => {
    modalMascota.style.display = 'none';
    formMascota.reset();
    document.getElementById('mascota-id').value = '';
  };
  // Cerrar modal al hacer clic fuera del formulario
  window.onclick = (event) => {
    if (event.target === modalMascota) {
      modalMascota.style.display = 'none';
      formMascota.reset();
      document.getElementById('mascota-id').value = '';
    }
  };
  // Justo después de definir abrirModalMascota, agrega esta línea:
window.abrirModalMascota = abrirModalMascota;

  

  async function obtenerMascotas(propietarioId) {
    const q = query(collection(db, 'mascotas'), where('propietarioId', '==', propietarioId));
    const querySnapshot = await getDocs(q);
    const mascotas = [];
    querySnapshot.forEach(doc => mascotas.push({ id: doc.id, ...doc.data() }));
    return mascotas;
  }

 async function mostrarPropietarios() {
  tabla.innerHTML = '';
  const snapshot = await getDocs(collection(db, 'propietarios'));

  for (const docSnap of snapshot.docs) {
    const p = docSnap.data();
    const propietarioId = docSnap.id;
    const mascotas = await obtenerMascotas(propietarioId);

    const mascotasHtml = mascotas.length > 0
      ? mascotas.map(m => `
        <div style="border:1px solid #ccc; padding:6px; margin-bottom:4px; border-radius:6px; background:#f9f9f9;">
          <strong>${m.nombre}</strong> (${m.especie || 'N/D'})<br>
          <small>Raza: ${m.raza || '-'}</small><br>
          <small>Edad: ${m.edad || '-'}</small><br>
          <small>Sexo: ${m.sexo || '-'}</small><br>
          <button class="btn-editar-mascota" 
            data-propietario-id="${propietarioId}" 
            data-mascota='${JSON.stringify(m).replace(/'/g, "\\'")}'
            style="margin-top:4px; background:#64b5f6; color:white; border:none; padding:4px 8px; border-radius:6px; cursor:pointer;">
            ✏️ Editar
          </button>
        </div>
      `).join('')
      : '<span style="color:#999;">Sin mascotas</span><br>';

    const fila = document.createElement('tr');
    
    fila.innerHTML = `
      <td>
        ${p.nombre}<br>
        <small>RUT: ${p.rut || '-'}</small><br>
        <small>Email: ${p.correo || '-'}</small>
      </td>
      <td>${p.telefono || '-'}</td>
      <td>${mascotasHtml}
        <button class="btn-nueva-mascota" 
          data-propietario-id="${propietarioId}"
          style="margin-top:6px; background:#4caf50; color:#fff; border:none; padding:5px 10px; border-radius:6px; cursor:pointer;">
          ➕ Nueva mascota
        </button>
      </td>
      <td>
        <button class="btn-editar" 
            data-id="${propietarioId}"
            style="background:#2196f3; color:white; padding:6px 10px; border:none; border-radius:6px; margin-right:6px;">
            ✏️
          </button>
          <button class="btn-eliminar" 
            data-id="${propietarioId}"
            style="background:#e53935; color:white; padding:6px 10px; border:none; border-radius:6px;">
            🗑️
          </button>
      </td>
    `;

    tabla.appendChild(fila);

    // 📌 EVENTOS: Editar Mascota
    fila.querySelectorAll('.btn-editar-mascota').forEach(btn => {
      btn.addEventListener('click', () => {
        const propietarioId = btn.getAttribute('data-propietario-id');
        const mascota = JSON.parse(btn.getAttribute('data-mascota'));
        abrirModalMascota(propietarioId, mascota);
      });
    });

    // 📌 EVENTO: Nueva Mascota
    fila.querySelector('.btn-nueva-mascota').addEventListener('click', () => {
      const propietarioId = fila.querySelector('.btn-nueva-mascota').getAttribute('data-propietario-id');
      abrirModalMascota(propietarioId);
    });

    // 📌 EVENTO: Editar Propietario
    fila.querySelector('.btn-editar').addEventListener('click', async () => {
      const id = fila.querySelector('.btn-editar').dataset.id;
      const docRef = doc(db, 'propietarios', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        alert('Propietario no encontrado');
        return;
      }
      const p = docSnap.data();
      form.nombre.value = p.nombre || '';
      form.rut.value = p.rut || '';
      form.correo.value = p.correo || '';
      form.telefono.value = p.telefono || '';
      editId.value = id;
      btnAgregar.textContent = 'Guardar Cambios';
    });

    // 📌 EVENTO: Eliminar Propietario + Mascotas
    fila.querySelector('.btn-eliminar').addEventListener('click', async () => {
      const id = fila.querySelector('.btn-eliminar').dataset.id;
      if (confirm('¿Eliminar propietario y todas sus mascotas?')) {
        await deleteDoc(doc(db, 'propietarios', id));
        const q = query(collection(db, 'mascotas'), where('propietarioId', '==', id));
        const querySnapshot = await getDocs(q);
        for (const d of querySnapshot.docs) {
          await deleteDoc(doc(db, 'mascotas', d.id));
        }
        alert('Propietario y mascotas eliminadas.');
        mostrarPropietarios();
      }
    });
  }
}
  mostrarPropietarios();

  // Crear o editar propietario
  form.onsubmit = async e => {
    e.preventDefault();
    const data = {
      nombre: form.nombre.value.trim(),
      rut: form.rut.value.trim(),
      correo: form.correo.value.trim(),
      telefono: form.telefono.value.trim(),
    };
    try {
      if (editId.value) {
        // Actualizar
        await updateDoc(doc(db, 'propietarios', editId.value), data);
        alert('Propietario actualizado');
      } else {
        // Nuevo
        await addDoc(collection(db, 'propietarios'), data);
        alert('Propietario agregado');
      }
      form.reset();
      editId.value = '';
      btnAgregar.textContent = 'Agregar';
      mostrarPropietarios();
    } catch (err) {
      alert('Error al guardar propietario: ' + err.message);
    }
  };

  // Guardar mascota
  formMascota.onsubmit = async e => {
    e.preventDefault();
    const mascotaId = document.getElementById('mascota-id').value;
    const propietarioId = document.getElementById('mascota-propietarioId').value;

    const data = {
      propietarioId,
      nombre: document.getElementById('mascota-nombre').value.trim(),
      especie: document.getElementById('mascota-especie').value.trim(),
      raza: document.getElementById('mascota-raza').value.trim(),
      fechaNacimiento: document.getElementById('mascota-fechaNacimiento').value,
      edad: Number(document.getElementById('mascota-edad').value) || null,
      sexo: document.getElementById('mascota-sexo').value,
      color: document.getElementById('mascota-color').value.trim(),
      numeroIdentificacion: document.getElementById('mascota-numeroIdentificacion').value.trim(),
      estadoReproductivo: document.getElementById('mascota-estadoReproductivo').value.trim(),
    };

    try {
      if (mascotaId) {
        await updateDoc(doc(db, 'mascotas', mascotaId), data);
        alert('Mascota actualizada');
      } else {
        await addDoc(collection(db, 'mascotas'), data);
        alert('Mascota agregada');
      }
      modalMascota.style.display = 'none';
      mostrarPropietarios();
    } catch (err) {
      alert('Error al guardar mascota: ' + err.message);
    }
  };

  // Búsqueda simple
  document.getElementById('busqueda').oninput = e => {
    const texto = e.target.value.toLowerCase();
    Array.from(tabla.children).forEach(fila => {
      const propietario = fila.children[0].textContent.toLowerCase();
      const mascotas = fila.children[2].textContent.toLowerCase();
      fila.style.display = propietario.includes(texto) || mascotas.includes(texto) ? '' : 'none';
    });
  };

  // Exportar Excel simple
  document.getElementById('btn-exportar').onclick = () => {
    // Generar CSV simple para Excel
    let csv = 'Propietario,Teléfono,Mascota,Especie,Raza,Edad,Sexo,Color,Identificación,Estado Reproductivo\n';
    tabla.querySelectorAll('tr').forEach(fila => {
      const propietario = fila.children[0]?.textContent.replace(/\n/g, ' ').trim() || '';
      const telefono = fila.children[1]?.textContent.trim() || '';
      const mascotas = fila.querySelectorAll('td:nth-child(3) > div');
      if (mascotas.length === 0) {
        csv += `"${propietario}","${telefono}","Sin mascotas",,,,,,,\n`;
      } else {
        mascotas.forEach(mDiv => {
          const texto = mDiv.textContent.replace(/\n/g, ' ').trim();
          // Extraemos datos básicos, ejemplo:
          const nombreMatch = texto.match(/^(.*?) \(/);
          const especieMatch = texto.match(/\((.*?)\)/);
          const razaMatch = texto.match(/Raza: ([^\s]+)/);
          const edadMatch = texto.match(/Edad: ([^\s]+)/);
          const sexoMatch = texto.match(/Sexo: ([^\s]+)/);
          csv += `"${propietario}","${telefono}","${nombreMatch?.[1] || ''}","${especieMatch?.[1] || ''}","${razaMatch?.[1] || ''}","${edadMatch?.[1] || ''}","${sexoMatch?.[1] || ''}","","",""\n`;
        });
      }
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `propietarios_mascotas_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

break;

    // ORDENES MEDICAS
      case 'ordenes':
        content.innerHTML = `
          <h2>Órdenes Médicas</h2>
          <form id="form-orden" class="form-stdb" enctype="multipart/form-data">
            <select id="mascota-orden" required style="padding: 6px; border-radius: 6px;">
              <option value="">Selecciona mascota...</option>
            </select>
            <select id="tipo" required style="padding: 6px; border-radius: 6px;">
              <option value="">Tipo de orden...</option>
              <option value="Examen">Examen</option>
              <option value="Vacunación">Vacunación</option>
              <option value="Desparasitación">Desparasitación</option>
              <option value="Otro">Otro</option>
            </select>
            <input type="text" id="diagnostico" placeholder="Diagnóstico" required />
            <input type="text" id="tratamiento" placeholder="Tratamiento" required />
            <input type="date" id="fecha" required />
            <button type="submit">Agregar</button>
          </form>
          <table id="tabla-ordenes">
            <thead>
              <tr>
                <th>Mascota</th>
                <th>Tipo</th>
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
        const mascotaSelect = document.getElementById('mascota-orden');

        // Cargar nombres de mascotas
        async function cargarMascotasEnSelect() {
          const snapshot = await getDocs(collection(db, 'mascotas'));
          snapshot.forEach(doc => {
            const mascota = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = mascota.nombre;
            mascotaSelect.appendChild(option);
          });
        }
        cargarMascotasEnSelect();
        // Cargar nombres de propietarios
        // Mostrar órdenes guardadas
        async function mostrarOrdenes() {
          tablaOrdenes.innerHTML = '';
          const snapshot = await getDocs(collection(db, 'ordenes'));
          for (const docSnap of snapshot.docs) {
            const orden = docSnap.data();
            const mascotaSnap = await getDoc(doc(db, 'mascotas', orden.mascotaId));
            const nombreMascota = mascotaSnap.exists() ? mascotaSnap.data().nombre : 'Mascota eliminada';

            const fila = document.createElement('tr');
            // Agregar estilos a la fila
            fila.innerHTML = `
              <td>${nombreMascota}</td>
              <td>${orden.tipo}</td>
              <td>${orden.diagnostico}</td>
              <td>${orden.tratamiento}</td>
              <td>${orden.fecha}</td>
              <td>
                <button class="editar" data-id="${docSnap.id}" style="background:#64b5f6; color:white; border:none; padding:5px 10px; border-radius:8px; cursor:pointer; margin-right:5px;">✏️</button>
                <button class="eliminar" data-id="${docSnap.id}" style="background:#e57373; color:white; border:none; padding:5px 10px; border-radius:8px; cursor:pointer;">🗑️</button>
              </td>
            `;


            tablaOrdenes.appendChild(fila);
          }

          // Editar orden
          document.querySelectorAll('.editar').forEach(btn => {
            btn.addEventListener('click', async () => {
              const id = btn.getAttribute('data-id');
              const docRef = doc(db, 'ordenes', id);
              const ordenDoc = await getDoc(docRef);
              if (ordenDoc.exists()) {
                const orden = ordenDoc.data();
                document.getElementById('mascota-orden').value = orden.mascotaId;
                document.getElementById('tipo').value = orden.tipo;
                document.getElementById('diagnostico').value = orden.diagnostico;
                document.getElementById('tratamiento').value = orden.tratamiento;
                document.getElementById('fecha').value = orden.fecha;
                formOrden.setAttribute('data-id', id);
              }
            });
          });

          // Eliminar orden
          document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', async () => {
              const id = btn.getAttribute('data-id');
              await deleteDoc(doc(db, 'ordenes', id));
              mostrarOrdenes();
            });
          });
        }

        // Guardar nueva o editar orden existente
        formOrden.addEventListener('submit', async function (e) {
          e.preventDefault();

          const mascotaId = document.getElementById('mascota-orden').value;
          const tipo = document.getElementById('tipo').value;
          const diagnostico = document.getElementById('diagnostico').value.trim();
          const tratamiento = document.getElementById('tratamiento').value.trim();
          const fecha = document.getElementById('fecha').value;
          const id = formOrden.getAttribute('data-id');

          if (!mascotaId || !tipo || !diagnostico || !tratamiento || !fecha) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
          }

          try {
            if (id) {
              await updateDoc(doc(db, 'ordenes', id), { mascotaId, tipo, diagnostico, tratamiento, fecha });
              formOrden.removeAttribute('data-id');
            } else {
              await addDoc(collection(db, 'ordenes'), { mascotaId, tipo, diagnostico, tratamiento, fecha });
            }

            formOrden.reset();
            mostrarOrdenes();
          } catch (error) {
            alert('Error al guardar orden médica: ' + error.message);
          }
        });

        break;


      //Calendario
      // Calendario (agenda)
      case 'calendario':
      content.innerHTML = `
        <h2>Calendario de Citas</h2>
        <form id="form-cita" class="form-stdb">
          <select id="mascota-cita" required style="padding: 6px; border-radius: 6px;">
            <option value="">Selecciona mascota...</option>
          </select>
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
        <div id="agenda-calendario" style="margin-top: 40px;"></div>
      `;

      const formCita = document.getElementById('form-cita');
      const tablaCitas = document.querySelector('#tabla-citas tbody');
      const mascotaCitaSelect = document.getElementById('mascota-cita');

      async function cargarMascotasCalendario() {
        const snapshot = await getDocs(collection(db, 'mascotas'));
        snapshot.forEach(doc => {
          const mascota = doc.data();
          const option = document.createElement('option');
          option.value = doc.id;
          option.textContent = mascota.nombre;
          mascotaCitaSelect.appendChild(option);
        });
      }

      async function mostrarCitas() {
        tablaCitas.innerHTML = '';
        const snapshot = await getDocs(collection(db, 'citas'));
        for (const docSnap of snapshot.docs) {
          const cita = docSnap.data();
          const mascotaSnap = await getDoc(doc(db, 'mascotas', cita.mascotaId));
          const nombreMascota = mascotaSnap.exists() ? mascotaSnap.data().nombre : 'Mascota eliminada';

          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>${nombreMascota}</td>
            <td>${cita.fecha}</td>
            <td>${cita.hora}</td>
            <td>${cita.motivo}</td>
            <td>
              <button data-id="${docSnap.id}" class="editar-cita" style="background:#64b5f6; color:white; border:none; padding:5px 10px; border-radius:8px; cursor:pointer; margin-right:5px;">✏️</button>
              <button data-id="${docSnap.id}" class="eliminar-cita" style="background:#e57373; color:white; border:none; padding:5px 10px; border-radius:8px; cursor:pointer;">🗑️</button>
            </td>
            
          `;
          tablaCitas.appendChild(fila);
        }

        // Eventos de acción
        document.querySelectorAll('.eliminar-cita').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            await deleteDoc(doc(db, 'citas', id));
            mostrarCitas();
            mostrarAgendaFullCalendar();
          });
        });

        document.querySelectorAll('.editar-cita').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            const docSnap = await getDoc(doc(db, 'citas', id));
            if (docSnap.exists()) {
              const cita = docSnap.data();
              document.getElementById('mascota-cita').value = cita.mascotaId;
              document.getElementById('fecha-cita').value = cita.fecha;
              document.getElementById('hora-cita').value = cita.hora;
              document.getElementById('motivo').value = cita.motivo;

              formCita.removeEventListener('submit', submitHandler);
              formCita.addEventListener('submit', async function editarCita(e) {
                e.preventDefault();
                await updateDoc(doc(db, 'citas', id), {
                  mascotaId: mascotaCitaSelect.value,
                  fecha: document.getElementById('fecha-cita').value,
                  hora: document.getElementById('hora-cita').value,
                  motivo: document.getElementById('motivo').value.trim()
                });
                formCita.reset();
                mostrarCitas();
                mostrarAgendaFullCalendar();
                formCita.removeEventListener('submit', editarCita);
                formCita.addEventListener('submit', submitHandler);
              });
            }
          });
        });
      }

      async function mostrarAgendaFullCalendar() {
        const calendarEl = document.getElementById('agenda-calendario');
        calendarEl.innerHTML = '';
        const snapshot = await getDocs(collection(db, 'citas'));
        const events = [];

        for (const docSnap of snapshot.docs) {
          const cita = docSnap.data();
          const mascotaSnap = await getDoc(doc(db, 'mascotas', cita.mascotaId));
          const nombreMascota = mascotaSnap.exists() ? mascotaSnap.data().nombre : 'Mascota eliminada';
          events.push({
            title: `${nombreMascota} - ${cita.motivo}`,
            start: `${cita.fecha}T${cita.hora}`,
            allDay: false
          });
        }

        const calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: 'timeGridWeek',
          locale: 'es',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay,listWeek'
          },
          events: events
        });

        calendar.render();
      }

      async function submitHandler(e) {
        e.preventDefault();
        const mascotaId = mascotaCitaSelect.value;
        const fecha = document.getElementById('fecha-cita').value;
        const hora = document.getElementById('hora-cita').value;
        const motivo = document.getElementById('motivo').value.trim();

        if (!mascotaId || !fecha || !hora || !motivo) {
          alert('Por favor completa todos los campos.');
          return;
        }

        try {
          await addDoc(collection(db, 'citas'), { mascotaId, fecha, hora, motivo });
          formCita.reset();
          mostrarCitas();
          mostrarAgendaFullCalendar();
        } catch (error) {
          alert('Error al agendar cita: ' + error);
        }
      }

      formCita.addEventListener('submit', submitHandler);

      cargarMascotasCalendario();
      mostrarCitas();
      mostrarAgendaFullCalendar();
      break;

      // PERFIL
    case 'perfil':
      content.innerHTML = `
    <h2>Perfil de la Clínica</h2>
  `;
      break;


    // CERRAR SESIÓN  
    case 'Cerrar sesión':
    signOut(auth)
    .then(() => {
    alert("Sesión cerrada exitosamente");
    location.reload(); // Recarga la página o redirige al login si tienes una
    })
    .catch((error) => {
    console.error("Error al cerrar sesión:", error);
    alert("Hubo un problema al cerrar sesión.");
    });
    break;
              

    default:
      content.innerHTML = '<p>Sección no HABILITDA en esta version.</p>';
  }
}

// Cargar vista inicial por defecto
document.addEventListener('DOMContentLoaded', () => navigate('inicio'));
