import { User } from "../models/users.js";
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
  const { userName, userNumber, userEmail, userCode } = req.body;

  try {
    // Gerar o hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userCode, saltRounds);

    // Criar o usuário com a senha criptografada
    const user = await User.create({
      userName,
      userNumber,
      userEmail,
      userCode: hashedPassword
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params; // ID do usuário a ser atualizado
  const { userName, userNumber, userEmail, userCode } = req.body; // Novos dados

  try {
    const user = await User.findByPk(id); // Busca o usuário pelo ID

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' }); // Retorna 404 se não encontrar o usuário
    }
    // Atualiza os dados do usuário
    user.userName = userName || user.userName;
    user.userNumber = userNumber || user.userNumber;
    user.userEmail = userEmail || user.userEmail;
    user.userCode = userCode || user.userCode;

    await user.save(); // Salva as mudanças no banco de dados
    res.status(200).json(user); // Retorna o usuário atualizado
  } catch (error) {
    res.status(400).json({ error: error.message }); // Em caso de erro, retorna o erro com status 400
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

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.userCode);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // Se quiser, aqui você pode gerar um token JWT para autenticação futura.
    res.status(200).json({ message: 'Login bem-sucedido', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};