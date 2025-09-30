### **Informe de Análisis Funcional y Plan de Desarrollo: Plataforma para Análisis y Recomendaciones para Cultivos Eficientes**

**Para:** Equipo de Desarrollo

**De:** Analista Funcional / Ingeniero de Software

**Fecha:** 25 de septiembre de 2025

**Asunto:** Análisis funcional, definición de MVP y roadmap para la
nueva plataforma SaaS de soporte a la decisión agrícola.

### **1. Análisis Funcional**

Este documento detalla los requerimientos funcionales para el desarrollo
de la plataforma ACRE. El objetivo es proporcionar al equipo de
desarrollo la información necesaria para analizar y estimar el esfuerzo
de implementación.

#### **Módulo 1: Gestión de Entidades (Panel de Administración)**

Este módulo será de uso interno o para el perfil \"Administrador del
Distribuidor\". Su función es gestionar los datos maestros que alimentan
el sistema.

- **1.1. Gestión de Clientes (Productores)**

  - **User Story:** Como Administrador, quiero poder crear, ver,

    > editar y desactivar cuentas de productores para gestionar el
    > acceso a la plataforma.

  - **Requerimientos Funcionales:**

    - Formulario de alta con campos: Nombre, Apellido, Razón

      > Social, CUIT, Email, Teléfono.

    - Listado de clientes con buscador y filtros.

    - Opción para modificar datos y para cambiar el estado
      > (Activo/Inactivo).

  - **Criterios de Aceptación:**

    - Un productor creado debe poder iniciar sesión en la

      > plataforma.

    - La información de un productor debe poder ser actualizada

      > correctamente.

    - Un productor inactivo no debe poder iniciar sesión.

- **1.2. Gestión de Catálogos**

  - **User Story:** Como Administrador, necesito gestionar los

    > catálogos de insumos, semillas y servicios para que las
    > recomendaciones del sistema estén siempre actualizadas con la
    > oferta comercial del distribuidor.

  - **Requerimientos Funcionales:**

    - **Catálogo de Insumos:** CRUD para fertilizantes,

      > herbicidas, fungicidas e insecticidas. Campos: Nombre
      > Comercial, Principio Activo, Composición (ej: %N, %P),
      > Dosis recomendada (mín/máx), Unidad (L/Kg), Precio.

    - **Catálogo de Semillas:** CRUD para híbridos y variedades.
      > Campos: Cultivo, Nombre Comercial, Ciclo, Densidad
      > recomendada por ambiente (Bajo/Medio/Alto), Precio por
      > bolsa/kg.

  - **Criterios de Aceptación:**

    - Los insumos y semillas agregados deben estar disponibles

      > para ser seleccionados por el motor de recomendaciones.

    - Los precios actualizados deben reflejarse en los nuevos
      > reportes de planificación.

- **1.3. Gestión de Stock**

  - **User Story:** Como Administrador, quiero poder actualizar las

    > existencias de los insumos para que las recomendaciones
    > generadas consideren la disponibilidad real.

  - **Requerimientos Funcionales:**

    - Interfaz simple que liste los insumos y permita ingresar el
      > stock actual en unidades.

  - **Criterios de Aceptación:**

    - El motor de recomendaciones debe poder consultar y mostrar
      > el stock disponible en el reporte final.

**1.4. Visualización de Logs (Mínimo)** (Nueva Sección)

- **\*User Story**:\* Como Administrador, quiero poder ver un listado de

  > los **eventos críticos registrados** para auditar y diagnosticar
  > problemas básicos de la plataforma.

- **_Requerimientos Funcionales:_**

  - Desarrollo de una interfaz simple que liste los logs generados

    > por el servicio de\
    > _logging_ del _backend_.

  - El listado debe mostrar al menos: Fecha/Hora, Tipo de Evento
    > (ej: Login, Error, Recomendación Generada) y Usuario/Lote
    > asociado.

- **_Criterios de Aceptación:_**

  - Los eventos críticos (login, creación de lote, generación de
    > recomendación) deben ser consultables en esta interfaz.

#### **Módulo 2: Planificación de Lotes (Corazón de la Plataforma)**

Este es el módulo principal para el usuario final (Productor/Ingeniero
Agrónomo). Aquí definirá sus unidades productivas y cargará la
información necesaria para la planificación.

- **2.1. Dashboard Principal**

  - **User Story:** Como Productor, al ingresar quiero ver un

    > resumen de todos mis lotes, las campañas activas y el estado
    > de cada uno para saber rápidamente dónde debo enfocar mi
    > atención.

  - **Requerimientos Funcionales:**

    - Vista de mapa con todos los lotes del usuario.

    - Listado/tarjetas de lotes con información clave: Nombre,
      > Campaña, Superficie, Estado (Ej: \"Datos incompletos\",
      > \"Listo para planificar\", \"Planificación generada\").

  - **Criterios de Aceptación:**

    - El dashboard debe actualizarse automáticamente cuando se

      > crea un lote o se completa la carga de datos.

    - La vista debe mostrar de forma visible el \*\*Estado ENSO
      > actual\*\* (Niño, Niña o Neutral) consultado desde la API
      > del SMN.

- **2.2. Gestión de Lotes y Capas Base**

  - **User Story:** Como Productor, quiero poder crear un lote nuevo

    > dibujándolo en un mapa, asociarlo a una campaña y ver
    > información base como relieve y NDVI histórico para tener un
    > contexto inicial inmediato.

  - **Requerimientos Funcionales:**

    - Integración con API de mapas (Google Maps).

    - Herramienta de dibujo de polígonos.

    - Cálculo automático de superficie en hectáreas al cerrar el

      > polígono.

    - Formulario para asignar Nombre y Campaña Agrícola (ej:

      > \"Soja 2025/26\").

    - Al seleccionar un lote, el sistema debe solicitar y mostrar
      > automáticamente capas de relieve (DEM) e NDVI promedio de
      > los últimos 5 años desde Google Earth Engine (GEE).

  - **Criterios de Aceptación:**

    - El polígono dibujado debe guardarse correctamente en la base

      > de datos espacial.

    - La superficie calculada debe tener una precisión de al menos

      > 2 decimales.

    - Las capas de GEE deben visualizarse correctamente sobre el
      > polígono del lote.

- **2.3. Centro de Carga de Datos Específicos**

  - **User Story:** Como Productor, necesito un lugar centralizado y

    > fácil de usar para cargar mis datos de campo (análisis de
    > suelo, mapas de malezas y ambientes) para que el sistema pueda
    > generar recomendaciones precisas.

  - **Requerimientos Funcionales:**

    - **Análisis de Suelo:**

      - Formulario de carga manual con campos estructurados (pH,

        > MO%, P(ppm), N(kg/ha), etc.) y unidades claras.

      - Permitir asociar el análisis a una fecha y una
        > profundidad.

    - **Mapas de Ambientes y Malezas:**

      - Opción para subir archivos geoespaciales (Shapefile

        > .zip, GeoJSON). El sistema debe procesar y almacenar
        > las geometrías y sus atributos.

      - Herramienta de dibujo \"in-map\" para que usuarios sin
        > GIS puedan zonificar su lote y etiquetar cada zona
        > (ej: \"Ambiente A\", \"Foco de Yuyo Colorado\").

    - **Datos de Napas Freáticas:**

      - Un campo numérico simple para ingresar la profundidad
        > estimada en metros.

  - **Criterios de Aceptación:**

    - Los valores del análisis de suelo deben guardarse y estar

      > disponibles para el motor de recomendaciones.

    - Un Shapefile de ambientes subido debe mostrarse como una

      > capa de polígonos de colores sobre el lote.

    - Las zonas dibujadas manualmente deben guardarse
      > correctamente.

**2.4. Integración Climática Base (SMN)**

- _User Story:_ Como Productor, al planificar mi campaña, quiero ver

  > el **pronóstico ENSO** (Niño/Niña/Neutral) para tener el contexto
  > climático que define mi estrategia de manejo.

- _Requerimientos Funcionales:_

  - Implementación de una llamada al\

    > _backend_ para consultar la API del Servicio Meteorológico
    > Nacional (SMN).

  - El sistema debe obtener, almacenar y poner a disposición el
    > estado actual del pronóstico ENSO (ej: \"Niño\", \"Niña\" o
    > \"Neutral\").

- _Criterios de Aceptación:_

  - El estado ENSO debe ser actualizado periódicamente (al menos una
    > vez por campaña) o al consultar la API del SMN.

#### **Módulo 3: Motor de Recomendaciones y Planificación**

El núcleo del sistema, donde la información cargada se procesa para
generar un plan de manejo.

- **User Story:** Como Productor, después de cargar los datos de mi

  > lote, quiero que el sistema me guíe para elegir un cultivo y un
  > rendimiento objetivo, y que automáticamente me genere una
  > recomendación de insumos (fertilizantes, semillas, herbicidas)
  > para alcanzar esa meta.

- **Requerimientos Funcionales:**

  - **Asistente de Planificación:** Un wizard o flujo guiado.

    - Paso 1: Seleccionar Lote y Campaña.

    - Paso 2: Ingresar Cultivo, Fecha de Siembra objetivo y

      > Rendimiento esperado.

    - Paso 3: Ejecución de la Lógica de Decisión. El sistema debe
      > cruzar la información del lote (suelo, ambientes, malezas)
      > con los requerimientos del cultivo.

  - **Lógica de Decisión (Reglas Agronómicas):**

    - **Fertilizantes:** Calcular la necesidad de nutrientes

      > (N-P-K) basándose en la fórmula: (Requerimiento del
      > Cultivo para el Rendimiento Objetivo - Aporte del Suelo) \* Superficie. Luego, seleccionar la combinación de
      > fertilizantes del catálogo que sea más costo-efectiva. El
      > estado ENSO es una variable que modifica la _expectativa
      > de **Rendimiento Objetivo** debe ser ligeramente ajustada
      > al alza si el pronóstico es \"Niño\" y a la baja si es
      > \"Niña\", lo cual modifica el requerimiento total de
      > nutrientes_. Luego, seleccionar la combinación de
      > fertilizantes más costo-efectiva. _Ajuste ENSO: La
      > densidad de siembra recomendada debe tener un ligero
      > **ajuste de +5%** si el año es \"Niño\" y **-5%** si es
      > \"Niña\" (por ejemplo), basado en reglas agronómicas
      > predefinidas_.

    - **Semillas:** Calcular la cantidad total de semillas según

      > la densidad recomendada para el híbrido/variedad y el
      > ambiente.

    - **Herbicidas:** Recomendar un paquete de productos basado en
      > el mapa de malezas cargado (ej: SI lote contiene \"Rama
      > Negra\", ENTONCES recomendar Herbicida X + Y).

- **Criterios de Aceptación:**

  - El sistema debe generar una recomendación de fertilizantes que

    > cubra las necesidades de N-P-K calculadas.

  - La cantidad de semillas recomendada debe ser consistente con la

    > superficie y la densidad definidas.

  - La recomendación debe ser determinística: para los mismos datos
    > de entrada, la salida debe ser siempre la misma.

#### **Módulo 4: Salidas y Reportes**

Este módulo presenta los resultados del motor de recomendaciones de
forma clara y accionable.

- **User Story:** Como Productor, una vez generada la planificación,

  > quiero ver un listado claro de todos los insumos que necesito, con
  > sus cantidades y precios, y poder exportar esta información en un
  > PDF para compartirla.

- **Requerimientos Funcionales:**

  - **Listado de Insumos:** La salida principal. Una tabla detallada

    > con: Insumo, Cantidad por Hectárea, Cantidad Total,
    > Presentación Comercial sugerida, Stock Disponible (si aplica),
    > y Precio Estimado.

  - **Resumen de Planificación en PDF:** Un reporte exportable que

    > consolide la información del lote, los datos cargados y la
    > recomendación generada.

  - **(Post-MVP) Mapa de Prescripción Variable:** Generar y permitir
    > la descarga de un archivo de prescripción (formato Shapefile o
    > similar) para siembra o fertilización, compatible con la
    > maquinaria agrícola.

- **Criterios de Aceptación:**

  - El listado de insumos debe reflejar exactamente lo calculado por

    > el motor de recomendaciones.

  - El PDF generado debe ser legible y contener toda la información
    > relevante.

###

### **2. Definición del Producto Mínimo Viable (MVP)**

El objetivo del MVP es validar la propuesta de valor central:

**Integrar datos para generar una recomendación de insumos accionable**.
Nos enfocaremos en la funcionalidad esencial que permita a un usuario
\"early adopter\" planificar un lote de principio a fin, priorizando la
carga manual de datos y las reglas de recomendación más directas.

#### **Funcionalidades INCLUIDAS en el MVP:**

- **Módulo 1 (Admin):**

  - Gestión completa de Clientes y Catálogos (Insumos y Semillas).

    > La gestión de stock se considera de baja prioridad para el MVP
    > inicial.

  - Visualización de Logs: Interfaz simple para ver eventos
    > críticos.

- **Módulo 2 (Planificación de Lotes):**

  - Dashboard principal con listado de lotes.

  - Gestión de Lotes: Creación por dibujo de polígono, cálculo de

    > superficie y asignación de campaña.

  - Visualización de capas base (Relieve y NDVI histórico) desde

    > GEE.

  - Integración SMN (Servicio Meteorológico Nacional)**:** Consulta,

    > almacenamiento y visualización del estado ENSO
    > (Niño/Niña/Neutral)

  - Centro de Carga de Datos:

    - **Análisis de Suelo:** ÚNICAMENTE mediante formulario de

      > carga manual.

    - **Mapas de Malezas:** ÚNICAMENTE mediante la herramienta de

      > dibujo y etiquetado simplificada.

    - **Napas Freáticas:** Campo numérico simple.

- **Módulo 3 (Motor de Recomendaciones):**

  - Asistente de Planificación completo (selección de cultivo,

    > fecha, rendimiento).

  - Lógica de Decisión para:

    - **Fertilizantes:** Basado en balance de nutrientes simple

      > (Requerimiento - Aporte) ajustado por factor ENSO.

    - **Semillas:** Basado en densidad fija por cultivo (no por

      > ambiente) y ajustado por factor ENSO.

    - **Herbicidas:** Basado en reglas simples sobre las malezas
      > etiquetadas manualmente.

- **Módulo 4 (Salidas y Reportes):**

  - Listado de Insumos claro y detallado (sin información de stock).

  - Exportación del Resumen de Planificación a PDF.

**Cross-Cutting Concern (Técnico):**

- Implementación de un **Sistema de Logs Básico** (_backend_) para
  > registrar eventos críticos (login, creación de lote, generación de
  > recomendación).

#### **Funcionalidades EXCLUIDAS del MVP (para el Roadmap):**

- **Gestión de Stock** en el módulo de Admin.

- **Carga de Análisis de Suelo vía PDF con OCR**.

- **Carga de Mapas de Ambientes/Malezas/Rendimiento vía archivos GIS**

  > (Shapefile, GeoJSON).

- **Generación automática de Mapas de Ambientes** por el sistema.

- **Generación de Mapas de Prescripción Variable** para maquinaria.

- **Modelos Predictivos** para plagas, enfermedades o rendimiento.

- **Lógica de IA/Machine Learning** en el motor de recomendaciones.

### **3. Plan de Roadmap Evolutivo**

Este roadmap planifica las futuras versiones de la plataforma, agregando
valor incrementalmente sobre la base del MVP.

- **Versión 1.1 (Post-MVP - Foco en UX y Datos Avanzados)**

  - **Objetivo:** Facilitar la carga de datos para usuarios

    > profesionales.

  - **Features:**

    - Implementar la carga de mapas de Ambientes, Malezas y

      > Rendimiento vía archivos GIS (Shapefile, KML, GeoJSON).

    - Añadir Gestión de Stock en el módulo de Admin.

    - Mejorar la lógica de recomendación de Semillas para que
      > considere los ambientes cargados.

- **Versión 2.0 (Foco en Automatización e Inteligencia)**

  - **Objetivo:** Reducir la carga de trabajo manual y aumentar la

    > inteligencia de las recomendaciones.

  - **Features:**

    - Implementar la carga de Análisis de Suelo asistida por IA

      > (OCR para PDFs).

    - **Generación Automática de Mapas de Ambientes:** El sistema

      > analizará el NDVI histórico, el relieve y los datos de
      > suelo para proponer una ambientación del lote.

    - **Generación de Prescripciones Variables:** Exportación de
      > mapas de siembra y fertilización variable compatibles con
      > maquinaria agrícola.

- **Versión 3.0 (Foco en Modelos Predictivos y Agentes de IA)**

  - **Objetivo:** Transformar el DSS en un sistema predictivo y

    > prescriptivo.

  - **Features:**

    - Integración con API del Servicio Meteorológico para

      > pronósticos y datos ENSO.

    - Desarrollo de un\

      > **Modelo Predictivo de Cultivos** que, basado en datos
      > históricos y pronósticos, pueda estimar el rendimiento
      > potencial.

    - Evolución del motor de recomendaciones a un\
      > **Agente de IA con Machine Learning**, capaz de aprender
      > de campañas pasadas y optimizar las recomendaciones.
