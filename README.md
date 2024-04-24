# Infla Bot

Este proyecto surgio como ejercicio para trabajar con `web scraping` y a la vez generar una herramienta de interes propio para medir el aumento de precios de distintas cadenas de supermercados en Argentina.

## Funcionamiento general

Mediante un cronjob, todos los dias se ejecuta un codigo que lo que hace es tomar todos los productos cargados que forman parte de la canasta basica en Argentina y busca el precio del dia de cada producto. Ese precio se almacena en base de datos por lo que luego se pueden hacer distintos calculos en los que se encuentran los mas importantes que son:

- Calcular la inflacion diaria/semanal/mensual/anual de cada producto.
- Calcular la inflacion diaria/semanal/mensual/anual de cada supermercado.

La formula que se utiliza para calcular la inflacion es la siguiente:

```javascript
const inflacion = (precioActual - precioAnterior) / precioAnterior;
```

Aca se puede encontrar el listado de productos de la canasta basica. [INDEC](https://www.indec.gob.ar/ftp/cuadros/sociedad/EPH_metodologia_22_pobreza.pdf)

## Tecnologias

- NodeJS
- TypeScript
- NestJS
- TypeORM
- MySQL
- Puppeteer
- pnpm

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```
