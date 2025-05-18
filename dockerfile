# Imagen base
FROM node:18

# Crear y usar el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando para correr la app
CMD ["node", "dist/main"]
