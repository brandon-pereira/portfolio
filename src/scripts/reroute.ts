navigation.addEventListener("navigate", (navigateEvent) => {
  const destination = new URL(navigateEvent.destination.url);
  console.log("AAA");
  if (destination.pathname.startsWith("/projects/")) {
    const [, , id] = destination.pathname.split("/");
    console.log(id);
    const tile = document.querySelector<HTMLDivElement>(
      `img[data-project-image='${id}']`
    )!;
    navigateEvent.intercept({
      async handler() {
        try {
          const ProjectDetails = await fetch(
            `/fragments/project-details/${id}`
          );
          const text = await ProjectDetails.text();
          const fragment = document
            .createRange()
            .createContextualFragment(text);
          console.log(tile);
          tile.style.viewTransitionName = "project";

          // @ts-expect-error
          const transition = document.startViewTransition(async () => {
            // tile.style.viewTransitionName = "";
            document
              .querySelector("[data-projects-content]")
              ?.replaceWith(fragment);
          });

          transition.finished.finally(() => {
            // Clear the temporary tag
            tile.style.viewTransitionName = "";
          });

          // return undefined;
        } catch (err) {
          console.error(err);
        }
      },
    });
  }
});

navigation.addEventListener("navigateerror", (navigateEvent) => {
  console.log("error", navigateEvent.error);
});
