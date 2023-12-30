export function injectBackButtonListener() {
  document.addEventListener('astro:after-swap', () => {
    const $back = document.querySelector('[data-back-button]');
    // Add a click event listener to the back button
    $back?.addEventListener(
      'click',
      e => {
        e.preventDefault();
        history.back();
      },
      false
    );
  });
}
