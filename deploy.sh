#!/bin/bash

# Script seguro para desplegar Camponuevo a Vercel

echo "Iniciando despliegue seguro..."

# Verificar posibles secrets
if grep -r "eyJ" --include="*.js" --include="*.html" --include="*.md" . 2>/dev/null; then
    echo "ERROR: Posibles API keys detectadas."
    echo "Revisa los archivos antes de continuar."
    exit 1
fi

# Agregar solo archivos necesarios
git add index.html catalog.html product.html order.html user.html admin.html about.html
git add js/ components/ css/ img/ svg/ public/
git add package.json vercel.json .gitignore 2>/dev/null || true

# Verificar cambios
if git diff --cached --quiet; then
    echo "No hay cambios para commitar."
    exit 0
fi

# Mensaje de commit
read -p "Mensaje del commit: " commit_message
commit_message=${commit_message:-"Update: Mejoras de seguridad"}

echo ""
echo "Commiteando..."
git commit -m "$commit_message"

echo ""
echo "Subiendo a GitHub..."
git push

echo ""
echo "Despliegue iniciado en Vercel."
echo "Verifica: https://vercel.com/dashboard"
