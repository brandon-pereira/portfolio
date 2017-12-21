import("../styles/style.scss");
import("./components/webfontloader").then(webfontloader => webfontloader());
const components = [
    [import("./components/skills"), document.querySelector(".skills"), {}],
    [import("./components/apps"), document.querySelector(".apps"), {}]
];

components.forEach(component => {
    component[0].then(Class => new Class(component[1], component[2] || {}));
});

// If its a webkit browser add 'webkit' class to HTML.
if ("webkitTextFillColor" in document.documentElement.style) {
    document.documentElement.classList.add("webkit");
}