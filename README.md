# 🏆 Chigui World Cup

Simulador web de Copas del Mundo con países soberanos, no soberanos y territorios.

## Versión 0.1 — prototipo local

- Catálogo de 252 participantes a partir de los nombres del ZIP aportado.
- Copas personalizadas de 8, 16, 24, 32, 48 o 64 equipos.
- Sorteos, grupos y clasificaciones con puntos, DG y goles.
- Simulación de marcadores considerando fuerzas ficticias.
- Eliminatorias con prórroga y penaltis.
- Historial de campeones guardado en el navegador.

### Importante: banderas pendientes

El catálogo referencia imágenes originales en `flags/<CONTINENTE>/<NOMBRE>.png`, por ejemplo `flags/AFRICA/ANGOLA.png` y `flags/EUROPA/ALEMANIA.png`. Aún no están subidas al repositorio; el juego muestra un icono de respaldo hasta su incorporación. Extraer el ZIP original y subir el contenido de la carpeta `BANDERAS/` dentro de `flags/`, manteniendo los nombres originales.

### Siguientes fases

- Animación del partido en vivo con reloj y velocidad.
- Cuentas y perfiles; salas privadas con código; anfitrión de sala.
- Pronósticos usando Chiguicoins exclusivamente virtuales.
- Ranking, logros y medallas.
- Mejoras de sorteos y desempates deportivos.

## GitHub Pages

En Settings → Pages elegir **Deploy from a branch** y luego rama `main`, carpeta `/(root)`. Cuando GitHub Pages se habilite, se podrá abrir el sitio desde la URL del repositorio de Pages.

## Desarrollo

HTML, CSS y JavaScript sin herramientas de compilación. El progreso se guarda en el navegador, no se sincroniza todavía entre dispositivos. No almacenar secretos ni claves privadas en archivos públicos.

## Estado del proyecto

Esta versión todavía **no** es multijugador y **no** permite apostar monedas: esas funciones requieren autenticación y un backend seguro.
