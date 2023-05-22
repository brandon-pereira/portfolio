navigation.addEventListener("navigate", (navigateEvent) => {
  const url = new URL(navigateEvent.destination.url);

  if (url.pathname.startsWith("/projects/")) {
    navigateEvent.intercept({
      async handler() {
        const ProjectDetails = await fetch(
          "/projects/fragments/ProjectDetails"
        );
        const text = await ProjectDetails.text();
        const fragment = document.createRange().createContextualFragment(text);
        // TODO:F allback
        const transition = document.startViewTransition(() => {
          document
            .querySelector("[data-projects-content]")
            ?.replaceWith(fragment);
        });
      },
    });
  }
});
