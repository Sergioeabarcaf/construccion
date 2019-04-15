# Construccion
Sistema para módulos de construcción que realizan mediciones de Temperatura y Humedad (interior y exterior) y permite el posterior análisis sobre el comportamiento de materiales para construcción

# V1.0

Esta versión tiene las siguientes caracteristicas generales:

## WEB

* Alojado en el hosting de Firebase ( https://proteinlab-construccion.tk )
* Utiliza Auth0 para la autentificación de usuarios.
* Permite ver en tiempo real y con gauges los nuevos datos ambientales.
* Permite revisar en una tabla las mediciones realizadas.
* Se han realizado pruebas responsivas.
* Permite generar nuevas sesiones de trabajo.

## BACK

* Sistema funcionando en Raspberry Pi del laboratorio de Ingenieria Proteinlab.
* Utilización de dos sensores DHT11 para obtener Temperatura y Humedad.
* Validación de conexión a internet antes de comenzar.
* Creación de archivos CSV con los datos obtenidos por medición.
* Arranque desde el inicio de Raspberry Pi.