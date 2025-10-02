# --- Stufe 1: "Builder" ---
# Wir verwenden ein schlankes Node.js-Image, um das Vite-Projekt zu bauen.
# "AS builder" gibt dieser Stufe einen Namen, auf den wir uns später beziehen können.
FROM node:20-alpine AS builder

# Setzt das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiert zuerst nur die package.json und package-lock.json
# Docker cached diesen Layer, sodass 'npm ci' nur ausgeführt wird, wenn sich diese Dateien ändern.
COPY package*.json ./

# Zusatzsoftware für npm install wird hinzugefügt
RUN apk add --no-cache python3 make g++

# 'npm ci' ist oft schneller und zuverlässiger für CI/CD-Umgebungen als 'npm install'
# RUN npm ci  # klappt nur mit package.json.lock
# RUN npm install || (cat /root/.npm/_logs/*.log && exit 1)  # DEBUG!
RUN npm install --legacy-peer-deps

# Kopiert den restlichen Quellcode der Anwendung
COPY . .

# Führt das Build-Skript aus, das in der package.json definiert ist.
# Dies erstellt den 'dist'-Ordner mit den statischen HTML-, CSS- und JS-Dateien.
RUN npm run build

# --- Stufe 2: "Final" ---
# Wir verwenden ein sehr kleines, optimiertes Nginx-Image für das finale Produkt.
FROM nginx:stable-alpine AS final

# Kopiert die gebauten Dateien aus der "builder"-Stufe (aus /app/dist)
# in das Verzeichnis, aus dem Nginx standardmäßig statische Dateien ausliefert.
COPY --from=builder /app/dist /usr/share/nginx/html

# Informiert Docker, dass der Container auf Port 80 lauscht (Standard-HTTP-Port von Nginx).
# Dies ist hauptsächlich zur Dokumentation; der Port wird in docker-compose.yml verwaltet.
EXPOSE 80

# Der Standardbefehl, um Nginx im Vordergrund zu starten, was für Docker-Container notwendig ist.
CMD ["nginx", "-g", "daemon off;"]

