const express = require("express");
const router = express.Router();

const Instagram = require("node-instagram").default;
const { clientId, clientSecret } = require("../keys").instagram;

const instagram = new Instagram({
  clientId: clientId,
  clientSecret: clientSecret,
});

router.get("/", (req, res) => {
  res.render("index");
});

const redirectUri = "https://node-instagram.onrender.com/handleauth";

router.get("/auth/instagram", (req, res) => {
  res.redirect(
    instagram.getAuthorizationUrl(redirectUri, {
      scope: ["user_profile", "user_media"],
      state: "your state",
    })
  );
});

router.get("/handleauth", async (req, res) => {
  try {
    const code = req.query.code;
    const data = await instagram.authorizeUser(code, redirectUri);

    req.session.access_token = data.access_token;
    req.session.user_id = data.user_id;

    instagram.config.accessToken = req.session.access_token;

    res.redirect("/profile");
  } catch (error) {
    res.json("error" + error);
  }
});

router.get("/login", (req, res) => {
  res.redirect("/auth/instagram");
});
router.get("/logout", () => {});

router.get("/profile", async (req, res) => {
  try {
    const media = await instagram.get(`${req.session.user_id}`);
    console.log(media);
    res.json(media);
    res.render("profile");
  } catch (error) {
    res.json("error" + error);
  }
});

module.exports = router;
