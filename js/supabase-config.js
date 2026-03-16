<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
    // Configuración de Supabase
    const SUPABASE_URL = 'https://itlczokcdxgzgqrortpm.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bGN6b2tjZHhnemdxcm9ydHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTcwMDAsImV4cCI6MjA2MTA3MzAwMH0.K4AXxMHVd0VqeFR9gUGMSyq-zVYHj4pH1vsH5KGTFqc';

    // Cliente Supabase global
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized');
</script>
