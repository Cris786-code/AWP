// Este archivo será el cerebro de nuestra PWA más adelante.
// Por ahora, solo comprobamos que el script está enlazado correctamente.
console.log('App Shell de DevConnect inicializado correctamente.');

// Evento de prueba para el botón de recargar
document.getElementById('btn-sync').addEventListener('click', () => {
    alert('Pronto aquí implementaremos la sincronización con Background Sync.');
});

// Verificamos si el navegador soporta Service Workers y registramos el archivo.
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registro => {
            console.log('¡Éxito! Service Worker registrado correctamente.', registro);
        })
        .catch(error => {
            console.warn('Error al registrar el Service Worker:', error);
        });
} else {
    console.error('Este navegador no soporta Service Workers.');
}