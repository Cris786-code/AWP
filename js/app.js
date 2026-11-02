const posts = [
    {
        initials: 'P',
        author: 'Profesor Web',
        time: 'Hace 2 minutos',
        message: '¡Bienvenidos a nuestra red social de la clase! Pronto esta app funcionará 100% sin conexión. 🚀'
    },
    {
        initials: 'AM',
        author: 'Ana Martínez',
        time: 'Hace 15 minutos',
        message: 'Hoy terminé mi primera interfaz adaptable con HTML y CSS. ¡Lista para recibir comentarios!'
    },
    {
        initials: 'JL',
        author: 'Juan López',
        time: 'Hace 30 minutos',
        message: '¿Qué recursos recomiendan para practicar JavaScript y desarrollar proyectos web?'
    }
];

function renderPosts(items, container) {
    items.forEach(post => {
        const card = document.createElement('article');
        card.className = 'bg-white p-4 rounded-lg shadow mb-4';

        const authorRow = document.createElement('div');
        authorRow.className = 'flex items-center mb-3';

        const avatar = document.createElement('div');
        avatar.className = 'w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold mr-3';
        avatar.textContent = post.initials;

        const authorInfo = document.createElement('div');
        const author = document.createElement('h2');
        author.className = 'font-bold text-gray-800';
        author.textContent = post.author;

        const time = document.createElement('p');
        time.className = 'text-xs text-gray-500';
        time.textContent = post.time;

        const message = document.createElement('p');
        message.className = 'text-gray-700';
        message.textContent = post.message;

        authorInfo.append(author, time);
        authorRow.append(avatar, authorInfo);
        card.append(authorRow, message);
        container.append(card);
    });
}

renderPosts(posts, document.getElementById('feed'));
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