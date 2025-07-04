const express = require("express");
const fs = require("fs/promises"); // Usando fs.promises
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const passport = require("./authGoogle");

const app = express();
const port = 5000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(passport.initialize());

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // CORS para o frontend
app.use(cookieParser());

// Caminho absoluto para a pasta de uploads
const uploadDir = path.join(__dirname, 'uploads'); // Usando __dirname para definir o caminho

app.use('/uploads', express.static(uploadDir)); // Corrigindo para usar o caminho correto

// Verifica se o diretório de uploads existe, caso contrário, cria
fs.access(uploadDir).catch(() => fs.mkdir(uploadDir, { recursive: true }));

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Diretório fixo
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nome único para o arquivo
  },
});

const upload = multer({ storage });


const secretKey = "senhaSegura";

// Caminho para o arquivo db.json
const dbPath = path.resolve("db.json");

// Middleware global para verificar e passar informações do usuário
app.use(async (req, res, next) => {

  try {
    const token = req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, secretKey);
      req.userId = decoded.id;

      // Carregando os dados do usuário do banco
      const data = await fs.readFile(dbPath, "utf-8");
      const db = JSON.parse(data);

      const usuario = await db.users.find((user) => user.id === req.userId);

      req.usuario = usuario;

      console.log("Usário autenticado com sucesso! ID:", req.userId);
    } else {
      req.usuario = null;
    }

    // Chama o próximo middleware ou rota
    next();
  } catch (error) {
    console.log("Erro ao verificar o token:", error); // Log para capturar qualquer erro
    next();
  }
});

// AUTENTICANDO OS TOKENS (não modifica req.usuario)
function authMiddleware(req, res, next) {
  // Extrai o token dos cookies
  const token = req.cookies.token;
  console.log("Token recebido no authMiddleware:", token); // Log para ver o token na rota de autenticação

  // Verifica se o token foi fornecido
  if (token) {
    try {
      // Tenta verificar e decodificar o token
      const decoded = jwt.verify(token, secretKey);
      req.userId = decoded.id;

      next(); // Segue para o próximo middleware ou rota
    } catch (error) {
      console.log("Erro ao decodificar o token:", error); // Log para capturar erros ao decodificar o token
      return res.status(401).json({ message: "Token inválido" });
    }
  } else {
    console.log("Token não encontrado no authMiddleware");
    return res.status(401).json({ message: "Usuário não autenticado" });
  }
}

// Função para gerar o token
function generateToken(userId) {
  console.log("Gerando token para o usuário com id:", userId); // Log para verificar o ID do usuário
  return jwt.sign({ id: userId }, secretKey, { expiresIn: "10h" });
}

// Rota para cadastro de usuário
app.post("/CadastroUser", upload.single("imgPerson"), async (req, res) => {
  try {
    const newUser = req.body;
    const id = uuidv4();
    newUser.id = id;

    if (!newUser.name || !newUser.email || !newUser.password) {
      return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    // Verificar se o email já está registrado
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);

    const userExists = db.users && db.users.find((user) => user.email === newUser.email);
    if (userExists) {
      return res.status(400).json({ message: "Email já está em uso." });
    }

    // Se o usuário enviou uma imagem, adiciona a URL da imagem
    if (req.file) {
      newUser.img = `/uploads/${req.file.filename}`;
    }

    // Criptografando a senha
    const senhaCriptografada = await bcrypt.hash(newUser.password, 10);
    newUser.password = senhaCriptografada;

    // Adiciona o novo usuário ao banco de dados
    if (!db.users) {
      db.users = [];
    }
    db.users.push(newUser);

    // Salvando no db.json
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    const token = generateToken(newUser.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Cadastro realizado com sucesso!", newUser });
  } catch (err) {
    console.error("Erro ao processar a requisição:", err);
    res.status(500).json({ message: "Erro ao processar a requisição", error: err.message });
  }
});

// Rota de login
app.post("/Login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);

    const user = db.users.find((user) => user.email === email);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // Verificar se a senha está correta
    const senhaCorreta = await bcrypt.compare(password, user.password);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Usuário ou senha incorretos" });
    }

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Alterar para true em produção com HTTPS
      sameSite: "Strict",
      path: "/",
      maxAge: 36000000,
    });

    res.status(200).json({ message: "Usuário logado com sucesso" });
  } catch (err) {
    console.error("Erro ao processar a requisição:", err);
    res.status(500).json({ message: "Erro ao processar a requisição", error: err.message });
  }
});

// Rota para iniciar login com o Google
app.get(
  "/auth/google",
  (req, res, next) => {
    console.log("Rota /auth/google acessada");
    next(); // Passa para o próximo middleware (passport.authenticate)
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);



app.get("/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
      expiresIn: "10h",
    });

    res.cookie("token", token, { httpOnly: true });
    res.redirect(`http://localhost:3000/MeusProjetos`);
  }
);
app.get("/projects", authMiddleware, async (req, res) => {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);
    const user = req.usuario;
    
    const userId = user.id;
    console.log("Usuário que vai buscar os projetos:", userId);

    const projects = db.projects
      ? db.projects.filter((project) => project.userId === userId)
      : [];

    console.log("Projetos encontrados:", projects.length);

    res.json(projects);
  } catch (err) {
    console.error("Erro ao ler o arquivo db.json:", err);
    res.status(500).json("Erro ao ler o arquivo db.json");
  }
});

app.get("/projects/team", authMiddleware, async (req, res) => {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);
    const user = req.usuario;

    const userId = user.id;
    console.log("Usuário que vai buscar os projetos:", userId);

    const projects = db.projects
      ? db.projects.filter((project) => project.members.includes(userId) && project.userId )
      : [];

    console.log("Projetos encontrados:", projects);

    res.json(projects);
  } catch (err) {
    console.error("Erro ao ler o arquivo db.json:", err);
    res.status(500).json("Erro ao ler o arquivo db.json");
  }
})

app.get("/categories",authMiddleware, async (req, res) => {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);
    res.json(db.categories); // Retorna as categorias
  } catch (err) {
    console.error("Erro ao ler o arquivo db.json:", err);
    res.status(500).json("Erro ao ler o arquivo db.json");
  }
});

app.post("/projects", authMiddleware, async (req, res) => {
  const newProject = req.body;
  const id = uuidv4();
  newProject.id = id;
  newProject.status = "Em andamento";

  const user = req.usuario;

  if (user) {
    const userId = user.id;

    console.log("Usuário que vai cadastrar projetos:", userId);

    newProject.userId = userId;
    console.log("Novo projeto com ID do usuário:", newProject);
  } else {
    console.log("Usuário não encontrado ou não autenticado.");
  }

  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);
    db.projects.push(newProject);

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  
    res.status(201).json(newProject); // Retorna o projeto criado
  } catch (err) {
    console.error("Erro ao processar a requisição:", err);
    res.status(500).json("Erro ao salvar o projeto");
  }
});

app.get("/projects/:id",authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  const user = req.usuario;
  const userId = user.id;
  let isAdm = false;

  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);
    const projectfind = db.projects.find((project) => project.id === id);

    if (!projectfind) {
      return res.status(404).json("Projeto não encontrado");
    }

    if (userId ===  projectfind.userId) {
       isAdm = true;
    }

    const project = {
      ...projectfind,
      isAdm
    };

    res.status(200).json(project);
  } catch (err) {
    console.error("Erro ao ler o arquivo db.json:", err);
    res.status(500).json("Erro ao ler o arquivo db.json");
  }
});

app.get("/services/:id", authMiddleware, async (req, res) => {
  const { id: serviceId } = req.params;

  console.log("Buscando serviço com ID:", serviceId);

  // Lendo o banco de dados do arquivo
  const data = await fs.readFile(dbPath, "utf-8");
  const db = JSON.parse(data);

  console.log("Total de projetos:", db.projects.length);

  // Iterar pelos projetos para buscar o serviço pelo ID
  let service;
  db.projects.some((project) => {
    service = project.services.find((s) => s.id === serviceId);
    return service; // Para parar a iteração se o serviço for encontrado
  });

  if (!service) {
    console.log("Serviço não encontrado");
    return res.status(404).json({ error: "Serviço não encontrado" });
  }

  console.log("Serviço encontrado:", service);
  res.status(200).json(service);
});

app.get("/tasks/:id", authMiddleware, async (req, res) => {
  const { id: taskId } = req.params;

  console.log("Buscando task com ID:", taskId);

  // Lendo o banco de dados do arquivo
  const data = await fs.readFile(dbPath, "utf-8");
  const db = JSON.parse(data);

  console.log("Total de projetos:", db.projects.length);

  let task;
  db.projects.some((project) => {
    task = project.tasks.find((t) => t.id === taskId);
    return task; 
  });

  if (!task) {
    console.log("Task não encontrada");
    return res.status(404).json({ error: "Task não encontrada" });
  }

  console.log("Task encontrada:", task);
  res.status(200).json(task);

});

app.patch("/projects/:id", async (req, res) => {
  console.log("Recebida uma requisição para atualizar um projeto");

  const { id } = req.params;
  const updatedProject = req.body;

  try {
    // Lê o banco de dados
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);

    // Busca o projeto pelo ID
    const projectIndex = db.projects.findIndex(
      (project) => String(project.id) === id
    );

    if (projectIndex === -1) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }

    // Atualiza o projeto
    db.projects[projectIndex] = {
      ...db.projects[projectIndex],
      ...updatedProject,
    };

    // Grava as alterações no banco de dados
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    const project = db.projects[projectIndex];

    // Retorna o projeto atualizado
    console.log("Projeto atualizado com sucesso");
    res.status(200).json(project);

  } catch (err) {
    console.error("Erro ao processar a requisição:", err);
    res.status(500).json({ message: "Erro ao salvar as alterações no projeto" });
  }
});

app.delete("/projects/:id/remove", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);
    const updatedProjects = db.projects.filter(
      (project) => String(project.id) !== id
    );

    if (updatedProjects.length === db.projects.length) {
      return res.status(404).json("Projeto não encontrado");
    }

    db.projects = updatedProjects;

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    res.status(200).json("Projeto deletado com sucesso");
  } catch (err) {
    console.error("Erro ao processar a requisição:", err);
    res.status(500).json("Erro ao remover o projeto");
  }
});


app.post("/projects/:id/services", upload.array('file', 10), async (req, res) => {
  const { id } = req.params;
  const newService = req.body; // Obtém os dados do serviço enviados no corpo da requisição

  console.log("Dados do serviço:", newService);

  // Verifica se arquivos foram enviados
  if (req.files && req.files.length > 0) {
    // Adiciona os arquivos ao serviço, você pode adicionar os caminhos dos arquivos ou os próprios arquivos
    newService.files = req.files.map(file => file.path);
  }

  try {
      const data = await fs.readFile(dbPath, "utf-8");
      const db = JSON.parse(data);

      // Encontra o projeto
      const project = db.projects.find((p) => p.id === id);
      if (!project) {
          return res.status(404).json("Projeto não encontrado");
      }

      // Verifica se os dados do serviço são válidos
      if (!newService || !newService.cost) {
          return res.status(400).json("Dados do serviço inválidos");
      }

      const serviceCost = parseFloat(newService.cost);
      if (isNaN(serviceCost)) {
          return res.status(400).json("Custo do serviço inválido");
      }

      newService.id = uuidv4(); // Gere um ID único para o serviço

      // Adiciona o serviço ao projeto
      project.services.push({
          id: newService.id,
          name: newService.name,
          cost: newService.cost,
          description: newService.description,
          date: newService.date,
          files: newService.files // Salva os arquivos enviados
      });

      // Atualiza o custo total do projeto
      const newCost = parseFloat(project.cost) + serviceCost;
      project.cost = newCost;

      // Salva os dados atualizados no arquivo
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

      console.log("Serviço adicionado com sucesso:", newService);
      res.status(201).json(project); // Retorna o projeto atualizado
  } catch (err) {
      console.error("Erro ao processar a requisição:", err);
      res.status(500).json("Erro ao adicionar o serviço");
  }
});

app.patch("/projects/services/:id/edit", async (req, res) => {

    const { id: serviceId } = req.params;
    const updatedService = req.body;  // Dados para atualizar o serviço
  
    console.log("Editando serviço com ID:", serviceId);
  
    // Lendo o banco de dados do arquivo
    try {
      const data = await fs.readFile(dbPath, "utf-8");
      const db = JSON.parse(data);
  
      console.log("Total de projetos:", db.projects.length);
  
      // Buscar o serviço dentro do projeto
      let service;
      let projectIndex;
  
      // Encontrar o projeto que contém o serviço
      db.projects.some((project, index) => {
        service = project.services.find((s) => s.id === serviceId);
        if (service) {
          projectIndex = index;
        }
        return service; // Para parar a iteração se o serviço for encontrado
      });
  
      if (!service) {
        console.log("Serviço não encontrado");
        return res.status(404).json({ error: "Serviço não encontrado" });
      }
  
      // Atualizar os dados do serviço encontrado
      db.projects[projectIndex].services = db.projects[projectIndex].services.map((s) =>
        s.id === serviceId ? { ...s, ...updatedService } : s
      );
  
      // Salvar as alterações no banco de dados
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
  
      console.log("Serviço atualizado com sucesso");
  
      // Retornar o serviço atualizado
      res.status(200).json(db.projects[projectIndex].services.find((s) => s.id === serviceId));
    } catch (err) {
      console.error("Erro ao processar a requisição:", err);
      res.status(500).json({ error: "Erro ao salvar as alterações no serviço" });
    }
  });

app.patch("/projects/tasks/:id/edit", upload.array('file' ), async (req, res) => {
    const { id: taskId } = req.params;
  
    // Obtendo os dados do formulário (não arquivos)
    const updatedTask = req.body;  
    console.log("Dados da tarefa a serem atualizados:", updatedTask);
  
    // Verificando os arquivos e adicionando seus caminhos ao objeto da tarefa
    if (req.files) {
      updatedTask.files = req.files.map(file => file.path); // Salva os caminhos dos arquivos
      console.log("Arquivos atualizados:", updatedTask.files);
    }

  
    try {
      const data = await fs.readFile(dbPath, "utf-8");
      const db = JSON.parse(data);
  
      let task;
      let projectIndex;
  
      // Procurando a tarefa no banco de dados
      db.projects.some((project, index) => {
        task = project.tasks.find((s) => s.id === taskId);
        if (task) {
          projectIndex = index;
          return true;
        }
      });
  
      if (!task) {
        return res.status(404).json({ error: "Tarefa não encontrada" });
      }
  
      // Atualizando a tarefa com os novos dados (incluindo os caminhos dos arquivos)
      db.projects[projectIndex].tasks = db.projects[projectIndex].tasks.map((s) =>
        s.id === taskId ? { ...s, ...updatedTask } : s
      );
  
      // Salvando as alterações no banco de dados
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
  
      const updatedTaskFromDB = db.projects[projectIndex].tasks.find(
        (s) => s.id === taskId
      );

      console.log("Tarefa atualizada com sucesso", updatedTaskFromDB);
  
      res.status(200).json(updatedTaskFromDB);
    } catch (err) {
      console.error("Erro ao processar a requisição:", err);
      res.status(500);
    }
  });
  
 
app.delete("/projects/services/:serviceId/remove", async (req, res) => {
  const { serviceId } = req.params;

  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);
    
    let service
    let projectIndex;

    db.projects.some((project, index) => {
      service = project.services.find((s) => s.id === serviceId);
      if (service) {
        projectIndex = index;
        return true;
      }
    });

    if (!service) {
      return res.status(404).json({ error: "Serviço não encontrado" });
    }

    // Remover o serviço do projeto
    const project = db.projects[projectIndex];
    const serviceIndex = project.services.findIndex((s) => s.id === serviceId);

    const removedService = project.services[serviceIndex];
    project.services.splice(serviceIndex, 1);

    project.cost = parseFloat(project.cost) - parseFloat(removedService.cost);

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    res.status(200).json("Serviço removido com sucesso");
  } catch (err) {
    console.error("Erro ao processar a requisição:", err);
    res.status(500).json("Erro ao remover o serviço");
  }
});

app.post('/projects/:id/tasks', upload.array('file'), async (req, res) => {
  const { id } = req.params;
  const newTask = req.body;

  console.log('Nova tarefa:', newTask);
  

  // Adiciona os arquivos ao corpo da tarefa
  if (req.files) {
    newTask.files = req.files.map(file => file.path); // Salva os caminhos dos arquivos
  }

  newTask.id = uuidv4();

  try {
    const dbPath = path.join(__dirname, 'db.json'); // Caminho relativo para o db.json

    const data = await fs.readFile(dbPath, 'utf-8');
    const db = JSON.parse(data);
    const project = db.projects.find(p => p.id === id);

    if (!project) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    if (!project.tasks) {
      project.tasks = [];
    }

    project.tasks.push(newTask);

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Erro ao processar a requisição:", err);
    res.status(500).json({ message: "Erro ao processar a requisição", error: err.message });
  }
});

app.delete("/projects/:id/tasks/:taskId", async (req, res) => {
  const { id, taskId } = req.params;
  console.log("ID do projeto:", id, "ID da tarefa:", taskId);

  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data); 

    const project = db.projects.find((p) => p.id === id);
    if (!project) {
      return res.status(404).json("Projeto não encontrado");
    }

    const taskIndex = project.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json("Tarefa não encontrada");
    }

    project.tasks.splice(taskIndex, 1);

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    res.status(200).json(project); // Retorna o projeto atualizado
  } catch (err) {
    console.error("Erro ao processar a requisição:", err);
    res
      .status(500)
      .json({ message: "Erro ao processar a requisição", error: err.message });
  }
});

app.get("/usersSearch", async (req, res) => {
  
  const UserName = req.query.UserName;

  if (!UserName) {
    return res.status(400).json("Nome de usuário não fornecido");
  }

  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);

    const filteredUsers = db.users.filter((user) => {
      return user.name && user.name.toLowerCase().includes(UserName.toLowerCase());
    });

    if (filteredUsers.length === 0) {
      return res.status(404).json("Nenhum usuário encontrado");
    }

    const limitResults =filteredUsers.slice(0,3);

    res.status(200).json(limitResults); 
  } catch (err) {
    console.error("Erro ao ler o arquivo db.json:", err);
    res.status(500).json("Erro ao ler o arquivo db.json");
  }
});

app.get("/members/:memberId", async (req, res) => {
  
  const { memberId } = req.params;

  console.log(memberId);

  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);

    const member = db.users.find((user) => user.id === memberId);
    console.log('membros da tarefa:',member);

    if (!member) {
      return res.status(404).json("Membro não encontrado");
    }
    res.status(200).json(member);

  } catch (err) {
    console.error("Erro ao processar a requisição:", err);
    res.status(500).json({ message: "Erro ao processar a requisição", error: err.message });
  }
})

app.get("/projects/:id/members", async (req, res) => {
  const { id } = req.params;
  
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    const db = JSON.parse(data);

    const project = db.projects.find((p) => p.id === id);
    if (!project) {
      return res.status(404).json("Membros não encontrado");
    }
    const memberDetails = project.members.map(memberId => {
      return db.users.find(user => user.id === memberId);
    });

    console.log(memberDetails);

    res.status(200).json(memberDetails); // Retorna os detalhes dos membros
  } catch (err) {
    console.error("Erro ao processar a requisição:", err);
    res.status(500).json({ message: "Erro ao processar a requisição", error: err.message });
  }
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
