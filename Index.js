const express = require('express');
require('colors');
require('dotenv').config();

const PORT = process.env.PORT;

//----------------------- CONFIGURANDO SERVIDOR
const app = express();
app.use(express.json());

//-------------------- BASE DE DATOS
let tablaAlumnos = [
    { id: 1, nombre: "Juan" },
    { id: 2, nombre: "Pedro" },
    { id: 3, nombre: "Maria" },
    { id: 4, nombre: "Ana" },
    { id: 5, nombre: "Lucia" }
];

// Crear un mapa para almacenar los alumnos por ID
let mapaAlumnos = new Map(tablaAlumnos.map(alumno => [alumno.id, alumno]));

//-------------------- CONTROLLERS
const getTodosAlumnosBDD = () => {
    //consulta a la bdd
    return tablaAlumnos;
}

const postAlumnoBDD = (alumno) => {
    // Verificar si el alumno ya existe en el mapa
    if (mapaAlumnos.has(alumno.id)) {
        console.log("El alumno ya existe");
        return false;
    } else {
        // Insertar el alumno en el mapa
        mapaAlumnos.set(alumno.id, alumno);
        tablaAlumnos = Array.from(mapaAlumnos.values()); // Actualizar la tabla de alumnos
        return true;
    }
}

const putAlumnoBDD = (id, data) => {
    //actualizar alumno en la bdd
    tablaAlumnos = tablaAlumnos.map((alumno) => {
        if (alumno.id == id) {
            return data;
        } else {
            return alumno;
        }
    });
}

//---------------------RUTAS DE LA API
app.get('/', (req, res) => {
    console.log("Listado de Alumnos:");
    tablaAlumnos.forEach(alumno => {
        console.log(alumno.nombre);
    });
    res.send('¡Listado de Alumnos enviado a la terminal!');
});

app.get('/alumno', (req, res) => {
    console.log("OBTIENE TODOS LOS ALUMNOS");
    console.log(getTodosAlumnosBDD());
    res.json(getTodosAlumnosBDD());
});

app.post('/alumno', (req, res) => {
    const alumno = req.body;
    console.log("INSERTÓ ALUMNO");
    console.log(alumno);
    if (postAlumnoBDD(alumno)) {
        res.status(201).json({ mensaje: "Alumno insertado", alumnoInsertado: alumno });
    } else {
        res.status(400).json({ mensaje: "Alumno ya existe" });
    }
});

app.put('/alumno/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const newData = req.body;

    const index = tablaAlumnos.findIndex(alumno => alumno.id === id);
    if (index !== -1) {
        tablaAlumnos[index] = { ...tablaAlumnos[index], ...newData };
        mapaAlumnos.set(id, tablaAlumnos[index]);
        res.status(200).json({ mensaje: "Alumno actualizado exitosamente" });
    } else {
        res.status(404).json({ mensaje: "No se encontró el alumno con el ID proporcionado" });
    }
});

app.delete('/alumno/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tablaAlumnos.findIndex(alumno => alumno.id === id);
    if (index !== -1) {
        tablaAlumnos.splice(index, 1);
        mapaAlumnos.delete(id);
        res.status(200).json({ mensaje: "Alumno eliminado exitosamente" });
    } else {
        res.status(404).json({ mensaje: "No se encontró el alumno con el ID proporcionado" });
    }
});

//-------------------- ESCUCHAR SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor corriendo, acceder a -> `.red +
        `http://localhost:${PORT}`.yellow);
});
