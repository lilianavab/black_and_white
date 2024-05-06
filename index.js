import express from 'express'; // Dependencia para levantar el servidor
import exphbs from "express-handlebars"; // Dependencia para manejar plantillas Handlebars
import * as path from "path"; //módulo 'path' para manejo de rutas de archivos
import { fileURLToPath } from "url"; //función para convertir URL de archivos en rutas de archivos
import jimp from 'jimp'; // Dependencia para la manipulación de imagenes
import { v4 as uuidv4 } from 'uuid'; // Dependencia para generar un ID dinámico de forma aleatoria

const app = express( ); 
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//middlewares para acceder a archivos estáticos
app.use("/public", express.static(__dirname + "/public"));
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use(express.urlencoded({ extended: true })); 

// Configuración del motor de plantillas Handlebars
const hbs = exphbs.create({
    defaultLayout: __dirname + "/views/layout/main.handlebars",
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views",

  });
  app.engine("handlebars", hbs.engine);
  app.set("view engine", "handlebars");

let imagen = []

// Ruta principal
app.get("/", (req, res) => {
  res.render("home", {imagen:imagen})
});

// Ruta para procesar el formulario de ingreso de imágenes
app.post("/ingresar", async (req, res) => {
  const { imagen } = req.body; // Asegúrate de que estás accediendo al cuerpo de la solicitud (req.body) en lugar de los parámetros de consulta (req.query)
  const nombreImagen = `${uuidv4().slice(30)}.jpeg`;
  const img = await jimp.read(imagen);
  await img
    .resize(350, jimp.AUTO) // Asegúrate de que 'jimp.AUTO' esté en mayúsculas
    .greyscale()
    .writeAsync(__dirname + "/public/img/" + nombreImagen);
  res.sendFile(__dirname + "/public/img/" + nombreImagen);
});

// Se levanta un servidor en el puerto 4000
app.listen(8000, () => console.log('El servidor está escuchando en el puerto 8000')); // Se levanta el servidor con el comando Nodemon


    



