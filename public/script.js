window.onload = () => {
  const headers = document.querySelectorAll('.header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const tbody = header.nextSibling.querySelector('tbody');
      tbody.classList.toggle('collapsed');
    });
  });
}
