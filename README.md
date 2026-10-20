# 🏆 Chigui World Cup

Simulador web de Copas del Mundo con países, territorios y selecciones personalizadas.

## Estado de desarrollo — prototipo web v0.2

### Disponible en el navegador (modo individual)
- Catálogo de 252 participantes y sus fuerzas ficticias.
- Copas de 8, 16, 24, 32, 48 o 64 equipos.
- Sorteos aleatorios, grupos y tablas.
- Simulación de partidos con probabilidades, sorpresas, prórrogas y penaltis.
- Reproductor de partidos: marcador, reloj y eventos de gol.
- Selector de velocidad (1×, 2× o 4×).
- Chiguicoins **locales de prueba**: 1000 iniciales, pronósticos del próximo partido, aciertos y medallas.
- Perfil local con nombre y estadísticas.
- Historial de campeones guardado en el navegador.

### No disponible todavía como servicio real
- Salas privadas compartidas y anfitrión conectado.
- Identidades verificadas, inicio de sesión y ranking entre amigos.
- Chiguicoins y pronósticos seguros sincronizados online.
- Historial sincronizado entre dispositivos.

Estas funciones necesitan un proyecto Supabase separado (NO usar Academia Nexora), su configuración, funciones de servidor y pruebas de seguridad. En `backend/schema.sql` hay un **borrador de esquema sin desplegar**. No habilitar escrituras de saldos desde el navegador.

## Banderas oficiales del archivo compartido
Los 252 PNG proporcionados por el autor deben colocarse en `flags/<CONTINENTE>/<NOMBRE>.png`, exactamente con los nombres del ZIP. Sin esos archivos, se muestran emojis cuando existen y un símbolo de respaldo.

Se ha preparado un ZIP aparte con la carpeta `flags/`, listo para subir a GitHub. Por ahora **no está incluido en este repositorio**.

## Publicación GitHub Pages

El repositorio incluye `.github/workflows/pages.yml`. En GitHub, configurar **Settings → Pages → Source → GitHub Actions**. La acción intentará publicar los archivos del repositorio cuando se actualice la rama `main`. Confirmar el resultado en **Actions**. La URL prevista es https://chigui-07.github.io/simulador-futbol/ pero su disponibilidad depende de la configuración de Pages.

## Notas
- Los resultados y la fuerza de las selecciones son ficticios, no ratings oficiales FIFA.
- Las monedas son puramente lúdicas, sin compra o canje por dinero real.
- En el prototipo individual, Chiguicoins, perfiles y logros pueden modificarse desde el navegador: NO utilizarlos para clasificaciones públicas competitivas.
- HTML, CSS y JavaScript sin compilación.
