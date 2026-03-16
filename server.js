// server.js
// Servidor para Camponuevo - Manejo de imágenes de productos

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Forzar el directorio de trabajo
const BASE_DIR = 'C:\\Users\\User\\Dev\\Camponuevo';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos de la carpeta img
app.use('/img', express.static(path.join(BASE_DIR, 'img')));

// Servir archivos estáticos del proyecto
app.use(express.static(BASE_DIR));

// Endpoint para subir imagen
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Usar carpeta temporal, el endpoint reubicará el archivo
        const tempPath = path.join(BASE_DIR, 'img', 'temp');
        
        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath, { recursive: true });
        }
        
        cb(null, tempPath);
    },
    filename: function (req, file, cb) {
        // Generar nombre único simple
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        const safeName = basename.replace(/[^a-zA-Z0-9_-]/g, '_');
        
        cb(null, safeName + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo
    },
    fileFilter: function (req, file, cb) {
        // Solo permitir imágenes
        const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp, svg)'));
        }
    }
});

// Endpoint para subir imagen
app.post('/api/upload', upload.single('imagen'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No se ha proporcionado ninguna imagen' 
            });
        }

        console.log('=== Upload ===');
        console.log('req.body:', req.body);
        
        // Usar el laboratorio como nombre de carpeta (si no se proporciona, usar 'otros')
        let laboratorio = req.body.laboratorio;
        if (!laboratorio || laboratorio.trim() === '') {
            laboratorio = 'otros';
        }
        
        laboratorio = laboratorio.trim();
        const producto = req.body.producto || '';
        
        const folderName = laboratorio.replace(/[^a-zA-Z0-9_-]/g, '_');
        const safeProducto = producto.replace(/[^a-zA-Z0-9_-]/g, '_');
        
        // Crear carpeta del laboratorio si no existe
        const uploadPath = path.join(BASE_DIR, 'img', folderName);
        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            console.log('Carpeta creada:', uploadPath);
        }
        
        // Nombre del archivo: producto_timestamp.ext
        const ext = path.extname(req.file.originalname);
        let newFilename;
        if (safeProducto) {
            newFilename = safeProducto + '-' + Date.now() + ext;
        } else {
            newFilename = Date.now() + ext;
        }
        
        const oldPath = req.file.path;
        const newPath = path.join(uploadPath, newFilename);
        
        // Mover el archivo a la carpeta del laboratorio
        fs.renameSync(oldPath, newPath);
        
        // Devolver la ruta correcta
        const imagePath = `/img/${folderName}/${newFilename}`;
        
        console.log(`Imagen subida: ${imagePath}`);
        
        res.json({
            success: true,
            message: 'Imagen subida correctamente',
            path: imagePath,
            filename: newFilename,
            laboratorio: folderName
        });
    } catch (error) {
        console.error('Error al subir imagen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al subir la imagen',
            error: error.message
        });
    }
});

// Endpoint para eliminar imagen
app.delete('/api/upload', (req, res) => {
    try {
        const { imagePath } = req.body;
        
        if (!imagePath) {
            return res.status(400).json({
                success: false,
                message: 'No se ha proporcionado la ruta de la imagen'
            });
        }

        // Evitar eliminar imágenes que no sean del servidor
        if (!imagePath.startsWith('/img/')) {
            return res.status(400).json({
                success: false,
                message: 'Ruta de imagen inválida'
            });
        }

        const fullPath = path.join(__dirname, imagePath);
        
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`Imagen eliminada: ${imagePath}`);
            res.json({
                success: true,
                message: 'Imagen eliminada correctamente'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'La imagen no existe'
            });
        }
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la imagen',
            error: error.message
        });
    }
});

// Endpoint para obtener lista de laboratorios con imágenes
app.get('/api/laboratorios', (req, res) => {
    try {
        const imgDir = path.join(__dirname, 'img');
        let laboratorios = [];
        
        if (fs.existsSync(imgDir)) {
            laboratorios = fs.readdirSync(imgDir).filter(item => {
                return fs.statSync(path.join(imgDir, item)).isDirectory();
            });
        }
        
        res.json({
            success: true,
            laboratorios: laboratorios
        });
    } catch (error) {
        console.error('Error al listar laboratorios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al listar laboratorios',
            error: error.message
        });
    }
});

// Endpoint para servir el frontend estático
app.use(express.static(__dirname));

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 Servidor Camponuevo iniciado`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   Imágenes: http://localhost:${PORT}/img`);
    console.log(`========================================`);
    
    // Crear carpeta otros si no existe
    const otrosDir = path.join(__dirname, 'img', 'otros');
    if (!fs.existsSync(otrosDir)) {
        fs.mkdirSync(otrosDir, { recursive: true });
        console.log(`📁 Carpeta 'otros' creada`);
    }
});
