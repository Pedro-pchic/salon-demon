# Atelier Beauty — Demo administrativa para salones

Prototipo comercial de **DEVSYSGT**, desarrollado con React + Vite. Incluye Dashboard, Agenda, Punto de venta, Servicios, Clientes, Inventario, Comisiones, Equipo y Reportes.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Ejecutar en tu computadora

```bash
npm install
npm run dev
```

Abre la dirección local que muestra Vite.

## Compilar

```bash
npm run build
npm run preview
```

El resultado estará en `dist/`. La configuración `base: './'` permite publicar el proyecto bajo cualquier nombre de repositorio de GitHub Pages sin ajustar rutas manualmente.

## Subir a GitHub Pages

1. Crea un repositorio vacío en GitHub, por ejemplo `atelier-beauty-demo`.
2. En esta carpeta ejecuta:

```bash
git init
git add .
git commit -m "feat: crear demo Atelier Beauty"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/atelier-beauty-demo.git
git push -u origin main
```

3. En GitHub abre **Settings → Pages → Build and deployment** y cambia **Source** a **GitHub Actions**.
4. El flujo `.github/workflows/deploy.yml` publica automáticamente cada `push` a `main`.
5. Abre `https://TU-USUARIO.github.io/atelier-beauty-demo/` cuando termine la acción.

> Si ya tienes un repositorio inicializado, omite `git init` y adapta el remoto existente. No ejecutes `git remote add origin` si ya existe.

## Cómo demostrar el flujo de negocio

1. En **Agenda**, registra una cita y asigna un profesional.
2. Pulsa **Completar y cobrar** para trasladar el servicio al punto de venta.
3. En **Punto de venta**, añade productos si quieres y selecciona el método de pago.
4. Registra la venta; se actualizará el inventario y se calculará la comisión del profesional.
5. Revisa **Comisiones** y **Reportes**. Puedes exportar un CSV.

Los datos se guardan en `localStorage` de cada navegador. No existe backend, autenticación real, sincronización entre dispositivos ni procesamiento de dinero real. Los datos iniciales son ficticios.
