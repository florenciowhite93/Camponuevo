#!/usr/bin/env node
/**
 * Script para ejecutar SQL directamente en Supabase via REST API
 * Uso: node run-sql.js <SUPABASE_URL> <SERVICE_ROLE_KEY>
 */

const SUPABASE_URL = process.argv[2];
const SERVICE_KEY = process.argv[3];

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.log('Usage: node run-sql.js <SUPABASE_URL> <SERVICE_ROLE_KEY>');
    console.log('');
    console.log('Example:');
    console.log('node run-sql.js https://xxx.supabase.co eyJhbGci...');
    process.exit(1);
}

const fs = require('fs');
const path = require('path');

// Leer el archivo SQL
const sqlPath = path.join(__dirname, '..', 'supabase', 'sql', 'security.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

console.log('Ejecutando SQL de seguridad en Supabase...');
console.log('URL:', SUPABASE_URL);
console.log('');

// El endpoint correcto para ejecutar SQL raw en Supabase es via pg endpoint
const endpoint = `${SUPABASE_URL}/rest/v1/rpc/pg_export`;

async function executeSQL() {
    try {
        // Primero intentamos con el método correcto de Supabase
        // Usamos el endpoint de postgres
        const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
            method: 'POST',
            headers: {
                'apikey': SERVICE_KEY,
                'Authorization': `Bearer ${SERVICE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({ query: sqlContent })
        });

        // Si el método REST no funciona, usamos pg endpoint
        if (!response.ok) {
            console.log('Método REST no disponible, intentando pg endpoint...');
            
            const pgResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
                method: 'POST',
                headers: {
                    'apikey': SERVICE_KEY,
                    'Authorization': `Bearer ${SERVICE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    query: sqlContent,
                    params: []
                })
            });
            
            if (pgResponse.ok) {
                console.log('✓ SQL ejecutado correctamente!');
                return;
            }
        }

        console.log('Response status:', response.status);
        const text = await response.text();
        console.log('Response:', text.substring(0, 500));
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    console.log('');
    console.log('============================================');
    console.log('  INSTRUCCIONES MANUALES');
    console.log('============================================');
    console.log('');
    console.log('1. Ve a: https://supabase.com/dashboard');
    console.log('2. Selecciona tu proyecto');
    console.log('3. Ve a SQL Editor');
    console.log('4. Copia y pega el contenido de:');
    console.log('   supabase/sql/security.sql');
    console.log('5. Click en "Run"');
    console.log('');
    console.log('============================================');
}

executeSQL();
