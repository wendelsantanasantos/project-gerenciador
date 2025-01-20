const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const fs = require("fs").promises; // Para manipulação de arquivos
const dbPath = "db.json"; // Caminho do arquivo db.json

// Configurando a estratégia Google
passport.use(
  new GoogleStrategy(
    {
      clientID: "463484882545-955hfhpmq87h6bu2r6ihsvc396qq5hnp.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google Authentication Callback: ");
      console.log("Access Token:", accessToken);
      console.log("Refresh Token:", refreshToken);
      console.log("User Profile:", profile);

      try {
        // Lendo o db.json
        const data = await fs.readFile(dbPath, "utf-8");
        const db = JSON.parse(data);

        // Verificando se o usuário já existe
        let user = db.users.find((u) => u.id === profile.id);

        if (!user) {
          console.log("Novo usuário detectado, criando um novo...");
          user = {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
          };

          // Adicionando o novo usuário ao db.json
          db.users.push(user);
          await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

          console.log("Novo usuário adicionado:", user);
        } else {
          console.log("Usuário encontrado:", user);
        }

        return done(null, user);
      } catch (err) {
        console.error("Erro ao processar o banco de dados:", err);
        return done(err, null);
      }
    }
  )
);

// Serialização do usuário para a sessão
passport.serializeUser((user, done) => {
  console.log("Serializando o usuário:", user.id);
  done(null, user.id);
});

// Desserialização do usuário a partir do id
passport.deserializeUser(async (id, done) => {
  console.log("Deserializando o usuário com id:", id);

  try {
    // Lendo o db.json para encontrar o usuário
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);
    const user = db.users.find((u) => u.id === id);

    if (user) {
      done(null, user);
    } else {
      done(new Error("Usuário não encontrado"), null);
    }
  } catch (err) {
    console.error("Erro ao ler o banco de dados:", err);
    done(err, null);
  }
});

module.exports = passport;
