# YBV Pantallas

Dos pantallas de la muestra **Yellow Blue Vase** que acompañan a las dos esculturas (Buenos Aires y Moscú) en la fila de cuatro televisores de 70":

- **Gacetilla** (`apps/gacetilla`): presentación de la muestra y, para cada artista en orden alfabético por apellido, su biografía y su obra.
- **Chiara Scarpitti** (`apps/chiara`): *Fragments of a More-Than-Human Lover’s Discourse*. Los seis dípticos recompuestos sobre fondo oscuro, diez segundos cada uno, y el texto de la artista en italiano, inglés y español en el panel que se desplaza.

Las dos comparten `shared/`: el encabezado, la línea de progreso (la línea de Memoria de las esculturas, a la misma altura en las cuatro pantallas) y el panel de texto son copias exactas de las pantallas de Yellow Blue Vase, para que la fila se lea como un conjunto. Son páginas estáticas y livianas (sin 3D) y siguen funcionando si se corta internet.

## Desarrollo

```bash
npm install
npm run dev:gacetilla   # http://localhost:5176/app1/
npm run dev:chiara      # http://localhost:5177/app2/
npm test
```

## Opciones en la dirección de la gacetilla

Se recuerdan en cada televisor hasta que se cambien:

- `?modo=paginas` (por defecto): páginas de dos columnas que pasan solas, con tiempo según la cantidad de palabras.
- `?modo=scroll`: una columna que sube a velocidad de lectura, en bucle.
- `?ritmo=lento`, `?ritmo=normal`, `?ritmo=rapido`: cuánto tiempo queda cada página, o qué tan rápido sube el texto.

## Publicar en Netlify

Un solo sitio, con la misma lógica que Yellow Blue Vase (`/1` … `/4`): cada pantalla en su ruta.

| Ruta | Pantalla |
|---|---|
| `/app1` | Gacetilla (también `/gacetilla`) |
| `/app2` | Chiara Scarpitti (también `/chiara`) |
| `/` | lleva a `/app1` |

Toda la configuración está en `netlify.toml` (build `npm run build`, publicación `dist`, Node 22, redirecciones y encabezados): al importar el repositorio en Netlify no hay que completar nada.

## Contenido

- Gacetilla: `apps/gacetilla/content.ts`, transcripta de «Yellow Blue Vase gacetilla 41026.docx».
- Chiara: `apps/chiara/content.ts` y las fotografías en `apps/chiara/public/obras/`, exportadas del PDF «Sequenza Dialoghi – Progetto Vladimir Nabokov» sin los nombres que llevaban encima; esos nombres van como texto en la pantalla.
