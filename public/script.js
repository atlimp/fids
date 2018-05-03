window.onload = () => {
  const headers = document.querySelectorAll('.header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      header.classList.toggle('minimized');
      const tbody = header.nextSibling.querySelector('tbody');
      tbody.classList.toggle('collapsed');
    });
  });
}
