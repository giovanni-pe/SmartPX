export default function initVideoPlaceholder() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (!videoPlaceholder) return;

    videoPlaceholder.addEventListener('click', () => {
        alert('Aquí se mostraría un video demostrativo de la plataforma.');
    });
}
