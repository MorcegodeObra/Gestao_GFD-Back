import userService from "../services/userService.js";

export const createUser = async (req, res) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (message) {
    res.status(400).json({ message: message.message });
  }
};

export const listarUser = async (req, res) => {
  try {
    const users = await userService.listAll();
    res.json(users);
  } catch (message) {
    res.status(500).json({ message: message.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updated = await userService.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (message) {
    res.status(400).json({ message: message.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.remove(req.params.id);
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (message) {
    res.status(400).json({ message: message.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await userService.login(req.body);
    res.status(200).json(result);
  } catch (message) {
    res.status(401).json({ message: message.message });
  }
};
