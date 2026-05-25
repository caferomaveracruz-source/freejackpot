# 🎰 Casino Online - Sitio Web

Sitio web de casino online con estructura similar a BetMaster, listo para subir a GitHub Pages.

## 📁 Estructura de archivos

```
casino/
├── index.html              ← Página principal (Casino / Slots)
├── README.md
└── assets/
    ├── css/
    │   └── styles.css      ← Todos los estilos
    ├── js/
    │   └── main.js         ← Lógica: slider, animaciones, etc.
    └── images/
        ├── main_slide_1.png   ← Banner principal 1
        ├── main_slide_2.png   ← Banner principal 2
        └── miniatura_1.png    ← Miniatura del primer juego
```

## 🚀 Cómo subir a GitHub Pages

1. Crea un repositorio en GitHub (ej: `mi-casino`)
2. Sube todos los archivos
3. Ve a **Settings → Pages**
4. En "Source" selecciona `main` branch y carpeta `/root`
5. ¡Tu sitio estará en `https://tuusuario.github.io/mi-casino`!

## ➕ Cómo agregar más imágenes

- **Banners (slides):** Agregar `main_slide_3.png`, etc. en `assets/images/`  
  Luego copiar el bloque `<div class="slide">` en el HTML.

- **Miniaturas de juegos:** Agregar `miniatura_2.png`, `miniatura_3.png`, etc.  
  Reemplazar los `game-card-placeholder` por `game-card` con `<img>`.

## 🎨 Personalización rápida

En `assets/css/styles.css`, cambia las variables:
```css
:root {
  --accent-green: #00e676;  /* Color principal */
  --accent-gold:  #ffd700;  /* Dorado */
  --accent-pink:  #e91e8c;  /* Acento */
}
```
