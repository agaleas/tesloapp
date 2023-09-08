# Next.js TesloShop App
Para correr localmente, se necesita la base de datos
```
docker-compose up -d
```
*El -d, significa __detached__

MongoDB URL Local:
```
mongodb://localhost:27017/ecommercedb
```

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__

* Reconstruir los modulos de Node y levantar el server
```
yarn install
yarn dev
```

## LLenar la BD con información de prueba
Llamar endpoint
```
http://localhost:3000/api/seed
```

## Instalar el ORM mongoose
```
yarn add mongoose
```