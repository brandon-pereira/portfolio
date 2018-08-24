import WebFont from "webfontloader";

export default () => {
  // Load Webfonts (Generic)
  WebFont.load({
    google: {
      families: ["Open Sans:300,400", "Press Start 2P:400"]
    }
  });

  // Load Projects webfont (subset only)
  WebFont.load({
    google: {
      families: ["Lily Script One:400"],
      text: "Projects"
    }
  });

  // Load apps webfont (subset only)
  WebFont.load({
    google: {
      families: ["Bungee Shade:400"],
      text: "Apps"
    }
  });

  // Load contact icons font
  WebFont.load({
    custom: {
      families: ["contact"]
    }
  });
};
