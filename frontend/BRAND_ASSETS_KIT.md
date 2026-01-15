# 🎨 NEOLOGG BRAND ASSETS KIT
## Guía Rápida para Implementación

---

## 📦 CONTENIDO DEL KIT

Este kit contiene todos los recursos necesarios para implementar la identidad visual de NeoLogg en cualquier proyecto web.

---

## 🎯 VARIABLES CSS - COPIAR Y PEGAR

```css
/* ============================================
   NEOLOGG - VARIABLES CSS
   Copiar este bloque al inicio de tu CSS
   ============================================ */

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

:root {
  /* === COLORES PRIMARIOS === */
  --primary: #0066ff;
  --primary-dark: #0052cc;
  --secondary: #00d4ff;
  
  /* === FONDOS === */
  --dark: #0a0a0a;
  --dark-card: #111111;
  
  /* === TEXTOS === */
  --light-gray: #f5f5f7;
  --text: #1d1d1f;
  --text-secondary: #86868b;
  --gray: #8b8b8b;
  
  /* === GRADIENTES === */
  --gradient: linear-gradient(135deg, #0066ff 0%, #00d4ff 100%);
  --gradient-dark: linear-gradient(135deg, #0052cc 0%, #00a8cc 100%);
  
  /* === SOMBRAS === */
  --shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  --shadow-hover: 0 30px 80px rgba(0, 102, 255, 0.4);
}

/* === ESTILOS BASE === */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--dark);
  color: var(--light-gray);
  overflow-x: hidden;
}

::selection {
  background-color: var(--primary);
  color: white;
}

/* === SCROLLBAR PERSONALIZADO === */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--dark);
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}
```

---

## 🖼️ LOGO SVG - LISTO PARA USAR

### Logo Completo con Gradiente

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100">
  <defs>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&amp;display=swap');
    </style>
    <linearGradient id="logoGrad135" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0066ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <text x="10" y="72" font-family="'Inter', sans-serif" font-size="62" font-weight="900" fill="url(#logoGrad135)" letter-spacing="-1">NeoLogg</text>
</svg>
```

### Logo Solo "N" con Gradiente (Favicon)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&amp;display=swap');
    </style>
    <linearGradient id="nGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#0066ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <text x="10" y="78" font-family="'Inter', sans-serif" font-size="72" font-weight="900" fill="url(#nGrad)" letter-spacing="-1">N</text>
</svg>
```

---

## 🧩 COMPONENTES CSS - LISTOS PARA USAR

### Botón Primario

```css
.btn-primary {
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  background: var(--gradient);
  color: white;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.btn-primary:hover {
  box-shadow: 0 15px 40px rgba(0, 102, 255, 0.5);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 5px 20px rgba(0, 102, 255, 0.4);
}
```

### Botón Outline

```css
.btn-outline {
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  background: transparent;
  color: var(--light-gray);
  border: 2px solid var(--primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.btn-outline:hover {
  background: rgba(0, 102, 255, 0.1);
  border-color: var(--secondary);
}
```

### Tarjeta con Efectos

```css
.card {
  position: relative;
  background: linear-gradient(135deg, rgba(17, 17, 17, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
}

/* Borde animado superior */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.card:hover::before {
  transform: translateX(100%);
}

/* Efecto glow en hover */
.card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 102, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  filter: blur(60px);
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.card:hover::after {
  opacity: 0.15;
}

.card:hover {
  border-color: rgba(0, 102, 255, 0.4);
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 102, 255, 0.25);
}
```

### Input de Formulario

```css
.form-input {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--light-gray);
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
}

.form-input::placeholder {
  color: var(--text-secondary);
}
```

### Contenedor de Icono

```css
.icon-container {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.card:hover .icon-container {
  background: rgba(0, 102, 255, 0.15);
  transform: scale(1.05);
}

.icon-container svg {
  width: 32px;
  height: 32px;
  color: #00d4ff;
  stroke-width: 2;
}
```

### Icono con Gradiente

```css
.icon-gradient {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient);
  border-radius: 12px;
  color: white;
}

.icon-gradient svg {
  width: 28px;
  height: 28px;
}
```

### Texto con Gradiente

```css
.gradient-text {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 📐 CLASES UTILITARIAS

```css
/* === CONTENEDORES === */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-padding {
  padding: 8rem 2rem;
}

@media (max-width: 768px) {
  .section-padding {
    padding: 5rem 1.5rem;
  }
}

/* === TÍTULOS === */
.section-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: var(--light-gray);
}

.section-description {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.subsection-title {
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 700;
  color: var(--light-gray);
  margin-bottom: 2.5rem;
}

/* === GRIDS === */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 1024px) {
  .grid-3 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }
}
```

---

## ✨ EFECTOS VISUALES

### Orbes Flotantes de Fondo

```css
.background-orbs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, #0066ff 0%, transparent 70%);
  top: 10%;
  left: 10%;
}

.orb-2 {
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, #00d4ff 0%, transparent 70%);
  bottom: 10%;
  right: 10%;
  animation-delay: -4s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -30px) scale(1.1);
  }
}
```

### Grid Overlay Animado

```css
.grid-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 102, 255, 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 102, 255, 0.25) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
  pointer-events: none;
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}
```

### Glow Effect

```css
.glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: var(--gradient);
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: pulse 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.05);
  }
}
```

---

## 🎬 ANIMACIONES ÚTILES

```css
/* === FADE IN === */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

/* === SLIDE IN FROM LEFT === */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in-left {
  animation: slideInLeft 0.6s ease-out;
}

/* === ROTATE === */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotate 10s linear infinite;
}

/* === PULSE === */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.pulsing {
  animation: pulse 2s ease-in-out infinite;
}
```

---

## 📱 RESPONSIVE HELPERS

```css
/* === OCULTAR/MOSTRAR POR DISPOSITIVO === */
.hide-mobile {
  display: block;
}

.show-mobile {
  display: none;
}

@media (max-width: 768px) {
  .hide-mobile {
    display: none;
  }
  
  .show-mobile {
    display: block;
  }
}

/* === TEXTO RESPONSIVE === */
.text-responsive {
  font-size: clamp(1rem, 2vw, 1.2rem);
}

.title-responsive {
  font-size: clamp(2rem, 5vw, 3.5rem);
}
```

---

## 🎨 FONDOS RADIALES PARA SECCIONES

```css
/* Hero Background */
.hero-bg {
  background: 
    radial-gradient(circle at 20% 30%, rgba(0, 102, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(0, 212, 255, 0.12) 0%, transparent 50%),
    var(--dark);
}

/* Features Background */
.features-bg {
  background: 
    radial-gradient(circle at 30% 40%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(0, 102, 255, 0.15) 0%, transparent 50%),
    var(--dark);
}

/* Contact Background */
.contact-bg {
  background: 
    radial-gradient(circle at 30% 40%, rgba(0, 102, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 70% 20%, rgba(0, 212, 255, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 50% 80%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
    var(--dark);
}
```

---

## 🌐 HTML EJEMPLO COMPLETO

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeoLogg - Tu Proyecto</title>
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="neologg-n.svg">
  
  <!-- CSS -->
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  
  <!-- Hero Section -->
  <section class="hero-bg section-padding">
    <div class="background-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>
    <div class="grid-overlay"></div>
    
    <div class="container">
      <h1 class="section-title">
        Bienvenido a <span class="gradient-text">NeoLogg</span>
      </h1>
      <p class="section-description">
        Soluciones tecnológicas innovadoras para el futuro
      </p>
      
      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <button class="btn-primary">Comenzar</button>
        <button class="btn-outline">Saber Más</button>
      </div>
    </div>
  </section>
  
  <!-- Features Section -->
  <section class="features-bg section-padding">
    <div class="container">
      <div style="text-align: center; margin-bottom: 4rem;">
        <h2 class="section-title">Características</h2>
        <p class="section-description">
          Todo lo que necesitas en un solo lugar
        </p>
      </div>
      
      <div class="grid-3">
        <div class="card">
          <div class="icon-gradient">
            <svg><!-- Tu icono aquí --></svg>
          </div>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem;">
            Característica 1
          </h3>
          <p style="color: var(--text-secondary); line-height: 1.6;">
            Descripción de la característica aquí
          </p>
        </div>
        
        <div class="card">
          <div class="icon-gradient">
            <svg><!-- Tu icono aquí --></svg>
          </div>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem;">
            Característica 2
          </h3>
          <p style="color: var(--text-secondary); line-height: 1.6;">
            Descripción de la característica aquí
          </p>
        </div>
        
        <div class="card">
          <div class="icon-gradient">
            <svg><!-- Tu icono aquí --></svg>
          </div>
          <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem;">
            Característica 3
          </h3>
          <p style="color: var(--text-secondary); line-height: 1.6;">
            Descripción de la característica aquí
          </p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- JavaScript -->
  <script src="script.js"></script>
</body>
</html>
```

---

## 🚀 INICIO RÁPIDO

### Paso 1: Configuración Básica

1. Crea un archivo `styles.css` y copia las **Variables CSS**
2. Descarga los **archivos SVG del logo** y guárdalos en tu carpeta de recursos
3. Importa **Google Fonts Inter** en tu HTML

### Paso 2: Estructura HTML

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="neologg-n.svg">
```

### Paso 3: Añadir Componentes

Copia y pega los componentes CSS según necesites:
- Botones
- Tarjetas
- Inputs
- Iconos

### Paso 4: Efectos Visuales

Añade los efectos de fondo:
- Orbes flotantes
- Grid overlay
- Glow effects

### Paso 5: Responsive

Aplica las clases utilitarias responsive y verifica en diferentes dispositivos.

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Variables CSS copiadas
- [ ] Google Fonts importada
- [ ] Logo SVG descargado e implementado
- [ ] Favicon configurado
- [ ] Botones implementados
- [ ] Tarjetas con efectos
- [ ] Inputs de formulario
- [ ] Efectos de fondo (orbes, grid)
- [ ] Animaciones aplicadas
- [ ] Responsive verificado
- [ ] Scrollbar personalizado
- [ ] Estados hover funcionando

---

## 💡 TIPS Y MEJORES PRÁCTICAS

1. **Performance**: Los efectos blur pueden ser costosos, úsalos con moderación
2. **Accesibilidad**: Asegúrate de que el contraste de texto sea adecuado (mínimo 4.5:1)
3. **Animaciones**: Respeta `prefers-reduced-motion` para usuarios sensibles
4. **Mobile First**: Diseña primero para móvil, luego escala a desktop
5. **Consistencia**: Usa siempre las variables CSS en lugar de valores hardcoded

---

## 🎯 RECURSOS ADICIONALES

### Iconos Recomendados
- **Lucide Icons**: https://lucide.dev/
- **Heroicons**: https://heroicons.com/
- **Feather Icons**: https://feathericons.com/

### Herramientas Útiles
- **Gradient Generator**: https://cssgradient.io/
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Responsive Tester**: https://responsively.app/

---

## 📞 SOPORTE

Para más detalles, consulta el documento completo:
- `IDENTIDAD_CORPORATIVA_NEOLOGG.md`

**© 2026 NeoLogg - Todos los derechos reservados**
