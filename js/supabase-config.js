// Configuración de Supabase
const SUPABASE_URL = 'https://itlczokcdxgzgqrortpm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bGN6b2tjZHhnemdxcm9ydHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MDk1MzcsImV4cCI6MjA4OTE4NTUzN30.4j9YbZbeiOJQ6xnoyVjdW8xlv8qsrZnqgmJ3E6jkdCg';

// Cliente Supabase global
if (typeof window !== 'undefined') {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized');
}
