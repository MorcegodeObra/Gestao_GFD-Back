import { User } from "../models/users.js";
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
  const { userName, userNumber, userEmail, password, userArea, userCargo } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      userName,
      userNumber,
      userEmail,
      password: hashedPassword,
      userArea: userArea || "SEM AREA",
      userCargo: userCargo || "SEM CARGO",
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const listarUser = async (req, res) => {
  try {
    const users = await User.findAll();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { userName, userNumber, userEmail, password, userArea, userCargo } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    user.userName = userName || user.userName;
    user.userNumber = userNumber || user.userNumber;
    user.userEmail = userEmail || user.userEmail;
    user.userArea = userArea || user.userArea;
    user.userCargo = userCargo || user.userCargo;

    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const deleteUser = async (req, res) => {
  const { id } = req.params; // ID do usuário a ser excluído

  try {
    const user = await User.findByPk(id); // Busca o usuário pelo ID

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' }); // Retorna 404 se não encontrar o usuário
    }

    await user.destroy(); // Exclui o usuário do banco de dados
    res.status(200).json({ message: 'Usuário deletado com sucesso' }); // Retorna uma mensagem de sucesso
  } catch (error) {
    res.status(400).json({ error: error.message }); // Em caso de erro, retorna o erro com status 400
  }
};

export const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  try {
    const user = await User.findOne({ where: { userEmail } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Senha incorreta' });

    res.status(200).json({ message: 'Login bem-sucedido', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
