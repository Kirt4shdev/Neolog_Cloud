# 🎨 IDENTIDAD CORPORATIVA NEOLOGG
## Manual Completo de Marca y Estilo Visual

---

## 📋 ÍNDICE

1. [Introducción](#introducción)
2. [Paleta de Colores](#paleta-de-colores)
3. [Tipografía](#tipografía)
4. [Logo y Versiones](#logo-y-versiones)
5. [Gradientes](#gradientes)
6. [Espaciado y Dimensiones](#espaciado-y-dimensiones)
7. [Componentes de UI](#componentes-de-ui)
8. [Efectos Visuales](#efectos-visuales)
9. [Animaciones](#animaciones)
10. [Sombras y Profundidad](#sombras-y-profundidad)
11. [Sistema de Grid](#sistema-de-grid)
12. [Responsive Design](#responsive-design)
13. [Elementos Interactivos](#elementos-interactivos)
14. [Ejemplos de Código](#ejemplos-de-código)

---

## 🎯 INTRODUCCIÓN

NeoLogg es una marca tecnológica orientada a soluciones IoT para telemetría vehicular. Su identidad visual refleja:

- **Modernidad**: Diseño limpio y tecnológico
- **Innovación**: Gradientes vibrantes y animaciones dinámicas
- **Confiabilidad**: Fondos oscuros con alto contraste
- **Profesionalismo**: Tipografía clara y espaciado generoso

### Filosofía de Diseño
- **Dark Mode First**: Todos los diseños se basan en fondos oscuros
- **Gradientes como Elemento Principal**: El gradiente azul es la firma visual
- **Minimalismo Tecnológico**: Menos es más, cada elemento tiene propósito
- **Micro-interacciones**: Animaciones sutiles que mejoran la experiencia

---

## 🎨 PALETA DE COLORES

### Colores Principales

| Color | Hex | RGB | Uso Principal |
|-------|-----|-----|---------------|
| **Primary** | `#0066ff` | RGB(0, 102, 255) | Elementos principales, CTA, acentos |
| **Primary Dark** | `#0052cc` | RGB(0, 82, 204) | Hover states, variantes oscuras |
| **Secondary** | `#00d4ff` | RGB(0, 212, 255) | Gradientes, acentos secundarios |
| **Dark** | `#0a0a0a` | RGB(10, 10, 10) | Fondo principal |
| **Dark Card** | `#111111` | RGB(17, 17, 17) | Tarjetas, elementos elevados |

### Colores de Texto

| Color | Hex | RGB | Uso |
|-------|-----|-----|-----|
| **Light Gray** | `#f5f5f7` | RGB(245, 245, 247) | Texto principal |
| **Text** | `#1d1d1f` | RGB(29, 29, 31) | Texto oscuro (no usado en dark mode) |
| **Text Secondary** | `#86868b` | RGB(134, 134, 139) | Texto secundario, descripciones |
| **Gray** | `#8b8b8b` | RGB(139, 139, 139) | Texto terciario |

### Colores de Acento

| Color | Nombre | Hex | Uso |
|-------|--------|-----|-----|
| 🟢 | Success Green | `#00ff88` | Mensajes de éxito, confirmaciones |
| 🟣 | Accent Purple | `#ff00ff` | Efectos especiales, detalles visuales |

### Variables CSS

```css
:root {
  /* Colores Primarios */
  --primary: #0066ff;
  --primary-dark: #0052cc;
  --secondary: #00d4ff;
  
  /* Fondos */
  --dark: #0a0a0a;
  --dark-card: #111111;
  
  /* Textos */
  --light-gray: #f5f5f7;
  --text: #1d1d1f;
  --text-secondary: #86868b;
  --gray: #8b8b8b;
  
  /* Gradientes */
  --gradient: linear-gradient(135deg, #0066ff 0%, #00d4ff 100%);
  --gradient-dark: linear-gradient(135deg, #0052cc 0%, #00a8cc 100%);
  
  /* Sombras */
  --shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  --shadow-hover: 0 30px 80px rgba(0, 102, 255, 0.4);
}
```

---

## 🔤 TIPOGRAFÍA

### Fuente Principal: **Inter**

**Inter** es una tipografía moderna, diseñada específicamente para interfaces digitales con excelente legibilidad en pantalla.

- **Fuente:** Inter (Google Fonts)
- **Enlace:** https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap
- **Fallback:** -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif

### Escala Tipográfica

| Elemento | Tamaño | Peso | Uso |
|----------|--------|------|-----|
| **Hero Title** | 3.5rem - 6rem (clamp) | 900 | Título principal del hero |
| **Section Title** | 2.5rem - 3.5rem (clamp) | 800 | Títulos de secciones principales |
| **Subsection Title** | 1.75rem - 2.25rem (clamp) | 700 | Subtítulos de sección |
| **Card Title** | 1.5rem | 700 | Títulos de tarjetas |
| **Banner Title** | 1.5rem - 2rem (clamp) | 700 | Títulos de banners |
| **Body Large** | 1.2rem | 400 | Descripciones destacadas |
| **Body Regular** | 1rem | 400 | Texto principal |
| **Body Small** | 0.95rem | 400 | Texto secundario |
| **Caption** | 0.85rem - 0.9rem | 500 | Etiquetas, metadatos |

### Pesos de Fuente

```css
/* Ultra Light */
font-weight: 300; /* Raramente usado */

/* Regular */
font-weight: 400; /* Texto normal */

/* Medium */
font-weight: 500; /* Enlaces, labels */

/* Semi Bold */
font-weight: 600; /* Subtítulos, énfasis */

/* Bold */
font-weight: 700; /* Títulos secundarios */

/* Extra Bold */
font-weight: 800; /* Títulos principales */

/* Black */
font-weight: 900; /* Logo, hero titles */
```

### Letter Spacing

- **Logo:** `-1px` (comprimido)
- **Títulos grandes:** `-0.02em`
- **Labels uppercase:** `1px - 1.2px` (expandido)
- **Texto normal:** `normal`

### Line Height

- **Títulos grandes:** `1.1 - 1.2`
- **Títulos medianos:** `1.2`
- **Texto normal:** `1.6 - 1.7`
- **Descripciones:** `1.5 - 1.6`

---

## 🏷️ LOGO Y VERSIONES

### Logo Completo

**Texto:** `NeoLogg`
- **Fuente:** Inter Black (900)
- **Tamaño estándar:** 62pt / 62px
- **Letter-spacing:** -1px
- **Color:** Gradiente 135° (#0066ff → #00d4ff)

### Versiones Disponibles

#### 1. Logo Completo con Gradiente
- **Archivo:** `neologg-logo.svg`
- **Uso:** Fondos oscuros, web principal
- **Color:** Gradiente azul-cian

#### 2. Logo Completo Blanco
- **Archivo:** `neologg-logo-white.svg`
- **Uso:** Fondos de color, impresiones
- **Color:** #ffffff

#### 3. Solo "N" con Gradiente
- **Archivo:** `neologg-n.svg`
- **Tamaño:** 72pt / 72px
- **Uso:** Favicon, iconos de app, redes sociales

#### 4. Solo "N" Blanca
- **Archivo:** `neologg-n-white.svg`
- **Tamaño:** 72pt / 72px
- **Uso:** Iconos sobre fondos de color

### Código SVG del Logo

```xml
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
  
  <text x="10" y="72" font-family="'Inter', sans-serif" 
        font-size="62" font-weight="900" 
        fill="url(#logoGrad135)" letter-spacing="-1">
    NeoLogg
  </text>
</svg>
```

### Espacios de Seguridad

- **Mínimo alrededor del logo:** Equivalente a la altura de la "N"
- **Tamaño mínimo de reproducción:** 80px de ancho
- **Tamaño máximo recomendado:** 400px de ancho

### Usos Incorrectos ❌

- NO cambiar los colores del gradiente
- NO usar pesos de fuente diferentes a Black (900)
- NO distorsionar el logo (mantener proporciones)
- NO añadir efectos externos (sombras, contornos)
- NO usar sobre fondos que interfieran con legibilidad
- NO usar letter-spacing positivo

---

## 🌈 GRADIENTES

### Gradiente Principal

El gradiente principal de NeoLogg es una característica distintiva de la marca.

**Especificaciones:**
- **Tipo:** Lineal
- **Ángulo:** 135° (diagonal inferior-izquierda a superior-derecha)
- **Color inicio (0%):** `#0066ff` (Azul brillante)
- **Color final (100%):** `#00d4ff` (Cian brillante)

```css
.gradient-primary {
  background: linear-gradient(135deg, #0066ff 0%, #00d4ff 100%);
}
```

### Gradiente Oscuro (Hover)

```css
.gradient-dark {
  background: linear-gradient(135deg, #0052cc 0%, #00a8cc 100%);
}
```

### Gradiente de Texto

Para aplicar el gradiente a texto:

```css
.gradient-text {
  background: linear-gradient(135deg, #0066ff 0%, #00d4ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Gradientes de Fondo (Radial)

Para efectos atmosféricos sutiles:

```css
/* Hero Background */
background: 
  radial-gradient(circle at 20% 30%, rgba(0, 102, 255, 0.15) 0%, transparent 50%),
  radial-gradient(circle at 80% 70%, rgba(0, 212, 255, 0.12) 0%, transparent 50%),
  var(--dark);

/* Features Background */
background: 
  radial-gradient(circle at 30% 40%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
  radial-gradient(circle at 70% 70%, rgba(0, 102, 255, 0.15) 0%, transparent 50%),
  var(--dark);
```

### Gradientes Cónicos (Efectos Especiales)

```css
/* Animación circular multicolor */
background: conic-gradient(
  from 0deg,
  #0066ff 0deg,
  #00d4ff 120deg,
  #ff00ff 240deg,
  #0066ff 360deg
);
```

---

## 📏 ESPACIADO Y DIMENSIONES

### Sistema de Espaciado

NeoLogg utiliza un sistema de espaciado consistente basado en múltiplos de 8px.

| Nombre | Valor | Uso |
|--------|-------|-----|
| **xs** | 0.25rem (4px) | Espaciado mínimo |
| **sm** | 0.5rem (8px) | Espaciado pequeño |
| **md** | 1rem (16px) | Espaciado medio |
| **lg** | 1.5rem (24px) | Espaciado grande |
| **xl** | 2rem (32px) | Espaciado extra grande |
| **2xl** | 3rem (48px) | Espaciado doble |
| **3xl** | 4rem (64px) | Espaciado triple |
| **4xl** | 5rem (80px) | Espaciado cuádruple |

### Padding de Secciones

```css
/* Desktop */
.section-padding {
  padding: 8rem 2rem; /* 128px vertical, 32px horizontal */
}

/* Mobile */
@media (max-width: 768px) {
  .section-padding {
    padding: 5rem 1.5rem; /* 80px vertical, 24px horizontal */
  }
}
```

### Max-Width de Contenedores

```css
/* Contenedor principal */
.container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Contenedor de texto */
.text-container {
  max-width: 700px;
}

/* Contenedor ancho */
.wide-container {
  max-width: 1500px;
}
```

### Border Radius

| Elemento | Radio | Uso |
|----------|-------|-----|
| **Pequeño** | 8px | Inputs, elementos pequeños |
| **Medio** | 12px - 16px | Tarjetas, iconos |
| **Grande** | 20px - 24px | Tarjetas destacadas, modales |
| **Botones** | 50px (pill) | Botones CTA |
| **Circular** | 50% | Iconos circulares, avatares |

---

## 🧩 COMPONENTES DE UI

### Botones

#### Botón Primario

```css
.btn-primary {
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #0066ff 0%, #00d4ff 100%);
  color: white;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  box-shadow: 0 15px 40px rgba(0, 102, 255, 0.5);
  transform: translateY(-2px);
}
```

#### Botón Outline

```css
.btn-outline {
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  background: transparent;
  color: var(--light-gray);
  border: 2px solid var(--primary);
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: rgba(0, 102, 255, 0.1);
  border-color: var(--secondary);
}
```

### Tarjetas (Cards)

#### Tarjeta Estándar

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

.card:hover {
  border-color: rgba(0, 102, 255, 0.4);
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 102, 255, 0.25);
}
```

#### Efecto de Borde Animado

```css
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
```

### Iconos

#### Contenedor de Icono

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
```

#### Icono con Gradiente

```css
.icon-gradient {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0066ff 0%, #00d4ff 100%);
  border-radius: 12px;
  color: white;
}
```

### Inputs y Formularios

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
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
}
```

### Navbar

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1.5rem 2rem;
  transition: all 0.3s ease;
  background: transparent;
}

.navbar.scrolled {
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}
```

---

## ✨ EFECTOS VISUALES

### Glow Effects

#### Glow Azul (Resplandor)

```css
.glow-effect {
  position: absolute;
  width: 120%;
  height: 120%;
  background: var(--gradient);
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  pointer-events: none;
}
```

#### Glow en Hover

```css
.card-glow {
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

.card:hover .card-glow {
  opacity: 0.15;
}
```

### Backdrop Filters

```css
.glass-effect {
  background: rgba(17, 17, 17, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

### Grid Overlay (Efecto Matrix)

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
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}
```

### Orbs (Orbes Flotantes)

```css
.gradient-orb {
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
```

---

## 🎬 ANIMACIONES

### Transiciones Estándar

```css
/* Transición suave general */
transition: all 0.3s ease;

/* Transición para transformaciones */
transition: transform 0.5s ease, opacity 0.3s ease;

/* Transición para colores */
transition: color 0.3s ease, background-color 0.3s ease;
```

### Animación de Float

```css
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(30px, -30px) scale(1.1);
  }
}

.floating-element {
  animation: float 8s ease-in-out infinite;
}
```

### Animación de Pulse

```css
@keyframes pulse {
  0%, 100% {
    opacity: 0.15;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.25;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.pulsing-element {
  animation: pulse 3s ease-in-out infinite;
}
```

### Animación de Rotación

```css
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.rotating-element {
  animation: rotate 10s linear infinite;
}
```

### Animación de Flujo de Datos

```css
@keyframes dataFlow {
  0% {
    left: -40px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

.data-particle {
  animation: dataFlow 3s linear infinite;
}
```

### Animación de Fade In

```css
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

.fade-in-element {
  animation: fadeIn 0.5s ease-in;
}
```

### Hover States

```css
/* Elevación en hover */
.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 102, 255, 0.25);
}

/* Escala en hover */
.hover-scale:hover {
  transform: scale(1.05);
}

/* Brillo en hover */
.hover-glow:hover {
  box-shadow: 0 0 30px rgba(0, 102, 255, 0.5);
}
```

---

## 🌑 SOMBRAS Y PROFUNDIDAD

### Sistema de Sombras

```css
/* Sombra suave */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Sombra media */
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

/* Sombra pronunciada */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

/* Sombra con color primario */
box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);

/* Sombra hover con color */
box-shadow: 0 15px 40px rgba(0, 102, 255, 0.5);

/* Sombra extrema */
box-shadow: 0 30px 80px rgba(0, 102, 255, 0.4);
```

### Sombras de Texto

```css
/* Glow sutil en texto */
text-shadow: 0 0 10px rgba(0, 102, 255, 0.5);

/* Glow fuerte en texto */
text-shadow: 0 0 20px rgba(0, 212, 255, 1);
```

### Drop Shadows (SVG)

```css
/* Para elementos SVG */
filter: drop-shadow(0 0 10px rgba(0, 102, 255, 0.8));

/* Drop shadow múltiple */
filter: drop-shadow(0 0 10px currentColor) drop-shadow(0 0 20px currentColor);
```

### Elevación de Componentes

| Nivel | Elevación | Uso |
|-------|-----------|-----|
| **0** | Ninguna | Elementos planos |
| **1** | 0 2px 4px | Elementos sutilmente elevados |
| **2** | 0 4px 8px | Tarjetas simples |
| **3** | 0 10px 30px | Tarjetas destacadas |
| **4** | 0 20px 60px | Modales, elementos flotantes |
| **5** | 0 30px 80px | Elementos en máxima elevación |

---

## 📐 SISTEMA DE GRID

### Grid de Características

```css
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

### Grid de Especificaciones

```css
.specs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

@media (max-width: 1024px) {
  .specs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .specs-grid {
    grid-template-columns: 1fr;
  }
}
```

### Grid de Estadísticas

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}
```

### Grid de Contenido (Hero, About)

```css
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 968px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

```css
/* Mobile First Approach */

/* Extra Small Devices (phones) */
@media (max-width: 480px) { }

/* Small Devices (large phones) */
@media (max-width: 640px) { }

/* Medium Devices (tablets) */
@media (max-width: 768px) { }

/* Large Devices (small laptops) */
@media (max-width: 968px) { }

/* Extra Large Devices (desktops) */
@media (max-width: 1024px) { }

/* XXL Devices (large desktops) */
@media (max-width: 1200px) { }
```

### Tipografía Responsive (clamp)

```css
/* Hero Title */
font-size: clamp(3.5rem, 7vw, 6rem);

/* Section Title */
font-size: clamp(2.5rem, 5vw, 3.5rem);

/* Subsection Title */
font-size: clamp(1.75rem, 3vw, 2.25rem);

/* Body Text */
font-size: clamp(1rem, 2vw, 1.2rem);
```

### Padding Responsive

```css
/* Desktop */
padding: 8rem 2rem;

/* Tablet */
@media (max-width: 968px) {
  padding: 6rem 1.75rem;
}

/* Mobile */
@media (max-width: 768px) {
  padding: 5rem 1.5rem;
}
```

### Ocultar/Mostrar Elementos

```css
/* Ocultar en móvil */
.hide-mobile {
  display: block;
}

@media (max-width: 768px) {
  .hide-mobile {
    display: none;
  }
}

/* Mostrar solo en móvil */
.show-mobile {
  display: none;
}

@media (max-width: 768px) {
  .show-mobile {
    display: block;
  }
}
```

---

## 🖱️ ELEMENTOS INTERACTIVOS

### Estados de Interacción

```css
/* Normal */
.interactive-element {
  transition: all 0.3s ease;
}

/* Hover */
.interactive-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
}

/* Active */
.interactive-element:active {
  transform: translateY(0);
  box-shadow: 0 5px 15px rgba(0, 102, 255, 0.2);
}

/* Focus */
.interactive-element:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.3);
}

/* Disabled */
.interactive-element:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

### Cursores

```css
/* Pointer por defecto en elementos interactivos */
a, button, .clickable {
  cursor: pointer;
}

/* Cursor personalizado (opcional) */
@media (pointer: fine) {
  * {
    cursor: default;
  }
  
  a, button, .interactive {
    cursor: pointer;
  }
}
```

### Selección de Texto

```css
::selection {
  background-color: var(--primary);
  color: white;
}

::-moz-selection {
  background-color: var(--primary);
  color: white;
}
```

### Scrollbar Personalizado

```css
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

## 💻 EJEMPLOS DE CÓDIGO

### Ejemplo: Tarjeta de Característica Completa

```jsx
// React Component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-glow"></div>
      <div className="feature-icon">
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}
```

```css
/* CSS */
.feature-card {
  position: relative;
  background: linear-gradient(135deg, rgba(17, 17, 17, 0.9) 0%, rgba(10, 10, 10, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  cursor: pointer;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feature-card::before {
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

.feature-card:hover::before {
  transform: translateX(100%);
}

.feature-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  opacity: 0;
  filter: blur(60px);
  transition: opacity 0.5s ease;
  pointer-events: none;
  background: radial-gradient(circle, rgba(0, 102, 255, 0.3) 0%, transparent 70%);
}

.feature-card:hover .feature-glow {
  opacity: 0.15;
}

.feature-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.feature-icon svg {
  width: 32px;
  height: 32px;
  stroke-width: 2;
  color: #00d4ff;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--light-gray);
  margin-bottom: 0.75rem;
  position: relative;
  z-index: 1;
}

.feature-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  position: relative;
  z-index: 1;
}
```

### Ejemplo: Botón con Gradiente Animado

```jsx
function GradientButton({ children, onClick }) {
  return (
    <button className="gradient-btn" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.gradient-btn {
  padding: 1.1rem 2.5rem;
  background: linear-gradient(135deg, #0066ff 0%, #00d4ff 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.gradient-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.gradient-btn:hover::before {
  left: 100%;
}

.gradient-btn:hover {
  background: linear-gradient(135deg, #0052cc 0%, #00a8cc 100%);
  box-shadow: 0 15px 40px rgba(0, 102, 255, 0.5);
  transform: translateY(-2px);
}

.gradient-btn:active {
  transform: translateY(0);
  box-shadow: 0 5px 20px rgba(0, 102, 255, 0.4);
}
```

### Ejemplo: Fondo con Orbes Animados

```jsx
function AnimatedBackground() {
  return (
    <div className="animated-bg">
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="grid-overlay"></div>
    </div>
  );
}
```

```css
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.gradient-orb {
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

.grid-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 102, 255, 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 102, 255, 0.25) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
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

---

## 🎯 CHECKLIST DE IMPLEMENTACIÓN

### ✅ Colores
- [ ] Variables CSS definidas en :root
- [ ] Gradiente principal implementado
- [ ] Colores de texto con contraste adecuado
- [ ] Estados hover con colores correctos

### ✅ Tipografía
- [ ] Inter importada desde Google Fonts
- [ ] Escala tipográfica implementada
- [ ] Font weights correctos (400, 600, 700, 800, 900)
- [ ] Line-height y letter-spacing adecuados
- [ ] clamp() para responsive typography

### ✅ Logo
- [ ] Logo con gradiente correcto (135°)
- [ ] Versión blanca disponible
- [ ] Favicon con solo "N"
- [ ] Espacios de seguridad respetados

### ✅ Componentes
- [ ] Botones con estados hover y active
- [ ] Tarjetas con efectos de glow
- [ ] Inputs con focus states
- [ ] Navbar con scroll effect
- [ ] Footer estructurado

### ✅ Efectos Visuales
- [ ] Glow effects en elementos destacados
- [ ] Backdrop blur en elementos glass
- [ ] Grid overlay en hero
- [ ] Orbes flotantes animados
- [ ] Sombras con colores primarios

### ✅ Animaciones
- [ ] Transiciones suaves (0.3s ease)
- [ ] Animaciones de float y pulse
- [ ] Hover states con translateY
- [ ] Efectos de flujo de datos
- [ ] Fade in en elementos

### ✅ Responsive
- [ ] Mobile breakpoints definidos
- [ ] Typography responsive con clamp()
- [ ] Grid adaptativo
- [ ] Padding responsive
- [ ] Menú móvil funcional

### ✅ Accesibilidad
- [ ] Focus states visibles
- [ ] Alto contraste en textos
- [ ] Cursor pointer en interactivos
- [ ] Estados disabled claros
- [ ] Scrollbar personalizado

---

## 📦 ASSETS Y RECURSOS

### Fuentes Web
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### Archivos de Logo
- `neologg-logo.svg` - Logo completo con gradiente
- `neologg-logo-white.svg` - Logo completo blanco
- `neologg-n.svg` - Solo N con gradiente
- `neologg-n-white.svg` - Solo N blanca
- `favicon.svg` - Favicon con fondo

### Iconos Recomendados
- **Librería:** Lucide React / Heroicons
- **Estilo:** Outline, stroke-width: 2
- **Tamaño:** 24px - 32px

---

## 🚀 PRÓXIMOS PASOS

### Para Implementar esta Identidad

1. **Copia el archivo de variables CSS** al inicio de tu stylesheet principal
2. **Importa la fuente Inter** desde Google Fonts
3. **Descarga los logos SVG** y colócalos en tu carpeta de recursos
4. **Implementa los componentes base** (botones, cards, inputs)
5. **Aplica los efectos visuales** (glow, backdrop blur, grid)
6. **Añade animaciones** sutiles en hover states
7. **Verifica responsive** en todos los breakpoints
8. **Prueba accesibilidad** con navegación por teclado

---

## 📞 CONTACTO Y SOPORTE

Para dudas sobre la implementación de esta identidad corporativa:

**Email:** info@neologg.com  
**Web:** www.neologg.com

---

**Documento creado:** Enero 2026  
**Versión:** 1.0  
**Autor:** Sistema de Diseño NeoLogg  
**Última actualización:** 15/01/2026

---

## 📄 LICENCIA

Este documento y todos los elementos de la identidad corporativa de NeoLogg son propiedad exclusiva de Grupo Dilus / NeoLogg. Uso restringido a proyectos autorizados.

**© 2026 NeoLogg - Todos los derechos reservados**
