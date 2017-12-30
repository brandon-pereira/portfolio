import("../styles/style.scss");
import("./components/webfontloader").then(webfontloader => webfontloader());

// Async load all components
const components = [
    [import("./components/skills"), document.querySelector(".skills"), {}],
    [import("./components/apps"), document.querySelector(".apps"), {}],
    [import("./components/projects"), document.querySelector(".projects"), {}]
];
components.forEach(component => {
    // Components export a class, so we instantiate
    component[0].then(Class => new Class(component[1], component[2] || {}));
});


// Async load animation polyfill if not supported (not needed till user interaction)
if ('animate' in document.body === false) {
    import("web-animations-js");
}

// If its a webkit browser add 'webkit' class to HTML.
if ("webkitTextFillColor" in document.documentElement.style) {
    document.documentElement.classList.add("webkit");
}