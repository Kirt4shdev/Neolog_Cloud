# 📘 GUÍA DE USO - IDENTIDAD CORPORATIVA NEOLOGG

## 🎯 Bienvenido

Esta carpeta contiene todos los recursos necesarios para implementar la identidad corporativa de NeoLogg en cualquier proyecto web. A continuación encontrarás una guía completa de cómo usar cada archivo.

---

## 📦 ARCHIVOS INCLUIDOS

### 1. Documentación Completa

| Archivo | Descripción | Uso |
|---------|-------------|-----|
| **IDENTIDAD_CORPORATIVA_NEOLOGG.md** | Manual completo de marca (100+ páginas) | Consulta detallada de todos los elementos |
| **BRAND_ASSETS_KIT.md** | Guía rápida con código listo para copiar | Implementación rápida de componentes |
| **GUIA_USO_IDENTIDAD.md** | Este archivo - Cómo usar todo el kit | Empezar aquí |

### 2. Archivos de Código

| Archivo | Descripción | Uso |
|---------|-------------|-----|
| **neologg-starter-template.css** | CSS completo listo para usar | Copiar a tu proyecto |
| **demo-template.html** | Ejemplo HTML funcional | Ver demo o usar como base |

### 3. Recursos Visuales

| Carpeta/Archivo | Contenido |
|-----------------|-----------|
| **public/resources/** | Logos SVG, PDFs, especificaciones |
| - neologg-logo.svg | Logo completo con gradiente |
| - neologg-logo-white.svg | Logo completo blanco |
| - neologg-n.svg | Solo "N" con gradiente (favicon) |
| - neologg-n-white.svg | Solo "N" blanca |

---

## 🚀 INICIO RÁPIDO (5 MINUTOS)

### Opción 1: Demo HTML Completo

Si quieres ver la identidad en acción inmediatamente:

```bash
# Simplemente abre el archivo en tu navegador
demo-template.html
```

Este archivo incluye:
- ✅ Todos los estilos aplicados
- ✅ Navbar con scroll effect
- ✅ Hero con animaciones
- ✅ Sección de características
- ✅ Footer completo
- ✅ Efectos visuales (orbes, grid, glow)

### Opción 2: Nuevo Proyecto desde Cero

Para crear un nuevo proyecto con la identidad NeoLogg:

#### Paso 1: Estructura de Archivos

```
tu-proyecto/
├── index.html
├── css/
│   └── styles.css          ← Copiar neologg-starter-template.css aquí
└── assets/
    └── images/
        ├── neologg-logo.svg
        └── neologg-n.svg
```

#### Paso 2: HTML Básico

Crea tu `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Proyecto - NeoLogg</title>
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="assets/images/neologg-n.svg">
  
  <!-- CSS de NeoLogg -->
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  
  <!-- Tu contenido aquí -->
  <section class="hero-bg section-padding">
    <div class="container">
      <h1 class="section-title">
        Tu Título <span class="gradient-text">Aquí</span>
      </h1>
      <p class="section-description">
        Tu descripción aquí
      </p>
      <button class="btn btn-primary">Comenzar</button>
    </div>
  </section>
  
</body>
</html>
```

#### Paso 3: Personalizar

Abre `css/styles.css` y personaliza si es necesario, o simplemente úsalo tal cual.

---

## 📚 GUÍA DE DOCUMENTOS

### 1. IDENTIDAD_CORPORATIVA_NEOLOGG.md

**📖 Qué es:** Manual completo y detallado de la identidad visual de NeoLogg.

**👥 Para quién:** Diseñadores, desarrolladores frontend, directores creativos.

**📋 Contiene:**
- Paleta de colores completa con códigos hex, RGB, CMYK
- Especificaciones tipográficas detalladas
- Logo y todas sus variantes
- Sistema de gradientes
- Componentes de UI con código
- Animaciones y efectos
- Sistema de grid y responsive
- Ejemplos de código completos

**🎯 Cuándo usar:**
- Necesitas entender la identidad visual completa
- Vas a crear nuevos componentes
- Quieres saber las especificaciones exactas
- Necesitas justificar decisiones de diseño

**⏱️ Tiempo de lectura:** 30-45 minutos

---

### 2. BRAND_ASSETS_KIT.md

**📖 Qué es:** Guía rápida con código copy-paste para implementación inmediata.

**👥 Para quién:** Desarrolladores que necesitan código rápido.

**📋 Contiene:**
- Variables CSS listas para copiar
- Logos SVG completos
- Componentes con código CSS completo
- Clases utilitarias
- Efectos visuales ready-to-use
- Ejemplos HTML

**🎯 Cuándo usar:**
- Necesitas implementar rápido
- Quieres copiar y pegar código
- Buscas componentes específicos
- Necesitas código de referencia

**⏱️ Tiempo de lectura:** 10-15 minutos

---

### 3. neologg-starter-template.css

**📖 Qué es:** Archivo CSS completo con toda la identidad implementada.

**👥 Para quién:** Cualquier desarrollador web.

**📋 Contiene:**
- Todas las variables CSS
- Todos los componentes estilizados
- Efectos visuales
- Animaciones
- Grid system
- Responsive design
- Utilities

**🎯 Cuándo usar:**
- Comienzas un nuevo proyecto
- Necesitas un punto de partida sólido
- Quieres consistencia total con NeoLogg
- Prefieres modificar sobre una base completa

**💡 Cómo usar:**
1. Copia el archivo a tu proyecto
2. Renómbralo si quieres (ej: `neologg.css` o `brand.css`)
3. Impórtalo en tu HTML
4. Usa las clases directamente

---

### 4. demo-template.html

**📖 Qué es:** Página HTML completa de demostración funcional.

**👥 Para quién:** Cualquiera que quiera ver la identidad en acción.

**📋 Contiene:**
- Navbar con scroll effect
- Hero con animaciones
- Sección de características
- Sección About con stats
- Formulario de contacto
- Footer completo
- JavaScript interactivo

**🎯 Cuándo usar:**
- Ver cómo se ve la identidad completa
- Aprender cómo estructurar secciones
- Usar como plantilla base
- Mostrar a clientes/equipo

**💡 Cómo usar:**
1. Abre directamente en el navegador
2. Inspecciona el código para aprender
3. Copia secciones específicas a tu proyecto
4. Modifica el contenido según necesites

---

## 🎨 COMPONENTES PRINCIPALES

### Botones

```html
<!-- Primario -->
<button class="btn btn-primary">Texto del Botón</button>

<!-- Outline -->
<button class="btn btn-outline">Texto del Botón</button>

<!-- Ghost -->
<button class="btn btn-ghost">Texto del Botón</button>
```

### Tarjetas

```html
<div class="card">
  <div class="icon-gradient">
    <!-- Tu icono aquí -->
  </div>
  <h3 class="card-title">Título de la Tarjeta</h3>
  <p class="card-description">Descripción de la tarjeta</p>
</div>
```

### Texto con Gradiente

```html
<h1>
  Texto normal <span class="gradient-text">Texto con gradiente</span>
</h1>
```

### Grid Layouts

```html
<!-- 2 columnas -->
<div class="grid-2">
  <div>Contenido 1</div>
  <div>Contenido 2</div>
</div>

<!-- 3 columnas -->
<div class="grid-3">
  <div>Contenido 1</div>
  <div>Contenido 2</div>
  <div>Contenido 3</div>
</div>

<!-- Auto-responsive -->
<div class="grid-auto">
  <div>Contenido 1</div>
  <div>Contenido 2</div>
  <div>Contenido 3</div>
</div>
```

### Fondos con Efectos

```html
<section class="hero-bg section-padding">
  <!-- Efectos de fondo -->
  <div class="background-orbs">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
  </div>
  <div class="grid-overlay"></div>
  
  <!-- Tu contenido -->
  <div class="container z-1">
    <h1>Tu contenido aquí</h1>
  </div>
</section>
```

---

## 🎯 CASOS DE USO COMUNES

### Caso 1: Landing Page Simple

**Necesitas:** Una página de aterrizaje rápida para un producto.

**Usa:**
1. `demo-template.html` como base
2. Elimina secciones que no necesites
3. Modifica textos e imágenes
4. Personaliza colores si es necesario (en variables CSS)

**Tiempo estimado:** 30 minutos

---

### Caso 2: Web Corporativa Completa

**Necesitas:** Sitio multi-página con navegación completa.

**Usa:**
1. `neologg-starter-template.css` como base de estilos
2. Consulta `IDENTIDAD_CORPORATIVA_NEOLOGG.md` para especificaciones
3. Usa componentes de `BRAND_ASSETS_KIT.md` según necesites
4. Mantén consistencia con las variables CSS

**Tiempo estimado:** 1-2 semanas

---

### Caso 3: Aplicación Web (React/Vue/Angular)

**Necesitas:** Aplicar la identidad a una SPA.

**Usa:**
1. Copia las variables CSS de `neologg-starter-template.css`
2. Convierte componentes a componentes React/Vue
3. Mantén las clases CSS o usa CSS-in-JS con los mismos valores
4. Consulta `IDENTIDAD_CORPORATIVA_NEOLOGG.md` para detalles

**Ejemplo React:**

```jsx
// Button.jsx
import './Button.css'; // Importa los estilos del template

export const Button = ({ children, variant = 'primary', ...props }) => {
  return (
    <button className={`btn btn-${variant}`} {...props}>
      {children}
    </button>
  );
};
```

**Tiempo estimado:** 2-3 días para setup inicial

---

### Caso 4: Documentación o Blog

**Necesitas:** Sitio de contenido con la identidad NeoLogg.

**Usa:**
1. `neologg-starter-template.css` para estilos base
2. Enfócate en componentes de texto (section-title, section-description)
3. Usa tarjetas para artículos/posts
4. Mantén la paleta de colores

**Tiempo estimado:** 1-2 días

---

## 🛠️ PERSONALIZACIÓN

### Cambiar Colores Principales

Abre `neologg-starter-template.css` y modifica las variables:

```css
:root {
  /* Cambia estos valores */
  --primary: #0066ff;        /* Tu color primario */
  --secondary: #00d4ff;      /* Tu color secundario */
  --gradient: linear-gradient(135deg, #0066ff 0%, #00d4ff 100%);
}
```

### Cambiar Tipografía

```css
@import url('https://fonts.googleapis.com/css2?family=TU-FUENTE:wght@300;400;600;700;900&display=swap');

body {
  font-family: 'TU-FUENTE', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Añadir Tus Propios Componentes

```css
/* Añade al final de neologg-starter-template.css */

.mi-componente-custom {
  /* Usa las variables existentes */
  background: var(--dark-card);
  border: 1px solid var(--primary);
  color: var(--light-gray);
  /* ... tus estilos */
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Setup Inicial
- [ ] Copiar `neologg-starter-template.css` al proyecto
- [ ] Descargar logos SVG necesarios
- [ ] Configurar favicon
- [ ] Importar Google Fonts (Inter)

### Estructura HTML
- [ ] Crear navbar con scroll effect
- [ ] Implementar hero section
- [ ] Añadir secciones de contenido
- [ ] Crear footer

### Componentes
- [ ] Implementar botones (primario, outline, ghost)
- [ ] Crear tarjetas con efectos hover
- [ ] Configurar formularios
- [ ] Añadir iconos

### Efectos Visuales
- [ ] Orbes flotantes en hero
- [ ] Grid overlay animado
- [ ] Efectos glow en tarjetas
- [ ] Animaciones de scroll

### Responsive
- [ ] Verificar en móvil (< 768px)
- [ ] Verificar en tablet (768px - 1024px)
- [ ] Verificar en desktop (> 1024px)
- [ ] Menú móvil funcional

### Testing Final
- [ ] Verificar contraste de colores (accesibilidad)
- [ ] Comprobar animaciones suaves
- [ ] Validar performance (PageSpeed)
- [ ] Cross-browser testing

---

## 💡 MEJORES PRÁCTICAS

### 1. Mantén la Consistencia
- Usa siempre las variables CSS en lugar de valores hardcoded
- Respeta la escala tipográfica
- Mantén el espaciado consistente

### 2. Performance
- Los efectos blur pueden ser costosos, úsalos con moderación
- Optimiza imágenes antes de usarlas
- Usa lazy loading para imágenes below the fold

### 3. Accesibilidad
- Mantén contraste mínimo de 4.5:1 para texto
- Asegúrate de que focus states sean visibles
- Usa etiquetas semánticas HTML5

### 4. Responsive
- Diseña mobile-first
- Usa clamp() para tipografía responsive
- Verifica en dispositivos reales cuando sea posible

### 5. Mantenibilidad
- Comenta código complejo
- Organiza CSS en secciones claras
- Documenta personalizaciones

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Los gradientes no se ven

**Problema:** Los gradientes aparecen como colores sólidos.

**Solución:**
```css
/* Asegúrate de tener esto en tu CSS */
.gradient-text {
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  /* Para Safari antiguo, añade: */
  -webkit-text-fill-color: transparent;
}
```

### Los efectos blur van lentos

**Problema:** Animaciones con blur son lentas en algunos dispositivos.

**Solución:**
```css
/* Reduce el blur o añade will-change */
.glow {
  filter: blur(60px); /* Reduce a 40px si es necesario */
  will-change: opacity; /* Hint para el navegador */
}
```

### El navbar no cambia al hacer scroll

**Problema:** La clase `.scrolled` no se aplica.

**Solución:**
```javascript
// Asegúrate de tener este JavaScript
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
```

### Las fuentes no se cargan

**Problema:** El texto aparece en la fuente del sistema.

**Solución:**
```html
<!-- Asegúrate de tener esto en el <head> -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

---

## 📞 SOPORTE Y RECURSOS

### Documentación Adicional
- Manual de Usuario NeoLogg: `public/resources/Manual Neologg.pdf`
- Datasheet: `public/resources/Datasheet Neologg.pdf`
- Especificaciones Logo: `public/resources/ESPECIFICACIONES_LOGO_NEOLOGG.md`

### Herramientas Útiles

| Herramienta | Uso | Link |
|-------------|-----|------|
| **Coolors** | Verificar paleta de colores | https://coolors.co/0066ff-00d4ff |
| **CSS Gradient** | Generar gradientes | https://cssgradient.io/ |
| **Contrast Checker** | Verificar accesibilidad | https://webaim.org/resources/contrastchecker/ |
| **Lucide Icons** | Iconos recomendados | https://lucide.dev/ |

### Contacto

Para dudas sobre la implementación:
- **Email:** info@neologg.com
- **Web:** www.neologg.com

---

## 🎓 PRÓXIMOS PASOS

### Nivel Principiante
1. ✅ Lee esta guía completa
2. ✅ Abre `demo-template.html` en tu navegador
3. ✅ Inspecciona el código con DevTools
4. ✅ Copia `neologg-starter-template.css` a un proyecto nuevo
5. ✅ Crea una página simple con 2-3 secciones

### Nivel Intermedio
1. ✅ Lee `BRAND_ASSETS_KIT.md` completo
2. ✅ Implementa todos los componentes básicos
3. ✅ Personaliza colores manteniendo la coherencia
4. ✅ Crea variantes de componentes existentes
5. ✅ Implementa responsive design completo

### Nivel Avanzado
1. ✅ Lee `IDENTIDAD_CORPORATIVA_NEOLOGG.md` completo
2. ✅ Crea un sistema de diseño completo (Design System)
3. ✅ Convierte a componentes React/Vue/Angular
4. ✅ Implementa animaciones complejas personalizadas
5. ✅ Optimiza performance al máximo

---

## 📝 NOTAS FINALES

Este kit de identidad corporativa está diseñado para ser:

- ✨ **Completo:** Todo lo que necesitas en un solo lugar
- 🚀 **Rápido:** Implementación en minutos, no horas
- 🎨 **Flexible:** Fácil de personalizar sin perder coherencia
- 📱 **Responsive:** Funciona perfecto en todos los dispositivos
- ♿ **Accesible:** Cumple estándares de accesibilidad web
- 📚 **Documentado:** Cada decisión tiene su porqué

**Recuerda:** La consistencia es clave. Usa las variables CSS, respeta la escala tipográfica y mantén el espaciado coherente en todo el proyecto.

---

**Última actualización:** 15 de Enero de 2026  
**Versión:** 1.0  
**Autor:** Sistema de Diseño NeoLogg

---

**© 2026 NeoLogg - Grupo Dilus. Todos los derechos reservados.**

¡Buena suerte con tu proyecto! 🚀
