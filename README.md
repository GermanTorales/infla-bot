# Infla Bot

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

## Inflacion

La inflacion se divide en dos grupos.

1. Por supermercado.
2. General

La inflacion por supermercado consiste en obtener los productos de la canasta basica y calcular la diferencia entre el precio del dia anterior y el precio actual, dividir el resultado por el precio del dia anterior y multiplicar el resultado por `100`

Ej:
`Precio actual` = `110`
`Precio anterior` = `100`

Formula `((precioActual - precioAnterior) / precioAnterior) * 100`

```javascript
((110 - 100) / 100) * 100;
```

# Tasks

## Product tasks

- [x] Create new products
- [x] Get all products
- [x] Get one product with its prices
- [ ] Modify product
- [ ] Delete product
- [ ] Get current products price by source
- [ ] Get current product price in all sources
