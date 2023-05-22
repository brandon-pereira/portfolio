navigation.addEventListener("navigate", (navigateEvent) => {
  const destination = new URL(navigateEvent.destination.url);
  console.log("AAA");
  if (destination.pathname.startsWith("/projects/")) {
    const [, , id] = destination.pathname.split("/");
    console.log(id);
    navigateEvent.intercept({
      async handler() {
        try {
          const ProjectDetails = await fetch(
            "/projects/fragments/ProjectDetails"
          );
          const text = await ProjectDetails.text();
          const fragment = document
            .createRange()
            .createContextualFragment(text);
          const tile = document.querySelector<HTMLDivElement>(
            `div[data-project-tile='${id}']`
          )!;
          tile.style.viewTransitionName = "project";

          // @ts-expect-error
          const transition = document.startViewTransition(() => {
            try {
              console.log("HI");
              tile.style.viewTransitionName = "";

              document
                .querySelector("[data-projects-content]")
                ?.replaceWith(fragment);
              console.log("BYE");
            } catch (err) {
              console.error(err);
            }
          });

          return undefined;
        } catch (err) {
          console.error(err);
        }
      },
    });
  }
});

navigation.addEventListener("navigateerror", (navigateEvent) => {
  console.log("HEre");
});
