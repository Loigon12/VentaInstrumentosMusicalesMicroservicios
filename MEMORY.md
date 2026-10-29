# MEMORY.md -- Memoria de corto plazo (max. 50 lineas)
> Se reescribe tras cada tarea. Lo critico y permanente se promueve a AGENTS.md.

## Ultima tarea completada
- 2026-10-29: Planes de accion de la auditoria aplicados en Cliente-React: barra de botones por panel en ACCESORIOS (adicionar/listar/consultar/actualizar/eliminar, Enter, recarga desde servidor y acciones por fila) y nueva interfaz de consulta individual de instrumentos de cuerda (ConsultarInstrumentoCRUD.jsx con query instrumentoPorCodigo), sin modificar el listado existente.

## Decisiones recientes (no permanentes aun)
- Prohibicion de modificar codigo de produccion sin autorizacion previa; solo se creo el informe de auditoria y plan de accion.

## Pendientes conocidos
- Instrucciones del usuario para iniciar las fases del plan de accion (eliminar cache en React, queries faltantes de GraphQL, botones en CRUD y patron Observer).

## Notas rapidas
- Endpoint GraphQL del servidor: http://localhost:8081/graphql
- Revisar sincronizacion CORS entre application.properties (3000) y CorsConfig.java (5173).
