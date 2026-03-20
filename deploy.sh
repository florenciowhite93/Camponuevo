#!/bin/bash

# Script para desplegar cambios a GitHub automáticamente

echo "Iniciando despliegue..."

# Agregar todos los cambios al staging area
git add .

# Verificar si hay cambios para commit
if git diff --cached --quiet; then
    echo "No hay cambios para commitar."
    exit 0
fi

# Pedir mensaje de commit al usuario
read -p "Ingresa el mensaje del commit (o presiona Enter para usar mensaje por defecto): " commit_message

# Si el mensaje está vacío, usar mensaje por defecto
if [ -z "$commit_message" ]; then
    commit_message="Update: Cambios automatizados"
fi

# Hacer commit
git commit -m "$commit_message"

# Subir cambios a GitHub
git push

echo ""
echo "Despliegue completado exitosamente."