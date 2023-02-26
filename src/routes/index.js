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
      scope: ["basic", "likes"],
      state: "your state",
    })
  );
});

router.get("/handleauth", async (req, res) => {
  try {
    const code = req.query.code;
    const data = await instagram.authorizeUser(code, redirectUri);
    console.log(data);
    res.json(data);
  } catch (error) {
    res.json(error);
  }
});

router.get("/login", (req, res) => {
  res.redirect("/auth/instagram");
});
router.get("/logout", () => {});

router.get("/profile", () => {});

module.exports = router;
