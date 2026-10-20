# 🏆 Chigui World Cup

Simulador web de Copas del Mundo con países soberanos, no soberanos y territorios.

## Estado de desarrollo

- **Modo individual:** copas personalizadas de 8, 16, 24, 32, 48 y 64 participantes, sorteos, grupos, marcadores, eliminatorias, palmarés.
- **Partidos animados:** reloj acelerado, marcador y eventos.
- **Modo individual de prueba:** Chiguicoins locales, pronósticos y logros (no sincronizados ni seguros contra manipulación).
- **Modo online en Supabase:** correo y contraseña, perfil, sala privada de seis caracteres, anfitrión, torneos de 8/16/32 selecciones, resultados y pronósticos procesados en PostgreSQL. Se actualiza por consulta periódica.
- **No son apuestas reales:** Chiguicoins no se compran, venden ni canjean.

## Publicación

GitHub Actions contiene el flujo `.github/workflows/pages.yml`. En GitHub → Settings → Pages escoger **GitHub Actions** como fuente de publicación. No se ha comprobado aún un despliegue exitoso.

## Banderas

Hay 252 identificadores de países y territorios en `countries.js`. El sitio ya utiliza imágenes de banderas desde flagcdn.com mediante un mapa de 252 entradas en `flags.js`. Algunas banderas de territorios especiales se aproximan con una bandera regional o nacional: para reproducir las **252 imágenes originales** hay que añadir los PNG del ZIP dentro de `flags/<CONTINENTE>/<NOMBRE>.png`, por ejemplo `flags/EUROPA/ALEMANIA.png`. Las imágenes remotas requieren conexión a Internet. Cuando se incorporen los PNG originales, conviene cambiar la prioridad a los archivos locales para asegurar las banderas especiales.

## Base online

Supabase: la instancia compartida usa exclusivamente tablas `public.cwc_*`, con RLS y operaciones RPC restringidas. Los usuarios de Chigui World Cup llevan `app: "chigui_world_cup"` en la metadata de registro para omitir la inscripción de la academia. No se debe subir ninguna clave privada; `online.js` lleva solamente la clave publicable.

Para entrar, usar **Amigos**, registrarse y crear una sala. El anfitrión puede iniciar el torneo. Otros jugadores entran con el código e introducen pronósticos antes de cada partido. El servidor asigna resultados y premios.

## Limitaciones y próximos pasos

- Validar registro real por correo, pruebas entre dos navegadores y despliegue público.
- Usar la selección y fuerzas deportivas compartidas desde el servidor, no nombres provistos sin catálogo servidor.
- Mejorar la animación de partidos online; hoy el anfitrión los avanza y los espectadores reciben el marcador final.
- Rankings globales, logros completos, estadísticas públicas y moderación.
- Separación definitiva de la autenticación del proyecto de Academia Nexora si se necesita aislamiento completo.

**Atención:** la instancia de Supabase se comparte con Academia Nexora. No borrar ni editar tablas ajenas a `cwc_*`. 
