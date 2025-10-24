import userRepository from "../repositories/user.js";
import bcrypt from "bcrypt";

export default {
  async create(data) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    return await userRepository.create({
      ...data,
      password: hashedPassword,
      userArea: data.userArea || "SEM AREA",
      userCargo: data.userCargo || "SEM CARGO",
    });
  },

  async listAll() {
    return await userRepository.findAll();
  },

  async update(id, data) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("Usuário não encontrado");

    const updatedData = {
      userName: data.userName || user.userName,
      userNumber: data.userNumber || user.userNumber,
      userEmail: data.userEmail || user.userEmail,
      userArea: data.userArea || user.userArea,
      userCargo: data.userCargo || user.userCargo,
      userResumo: data.userResumo || user.userResumo,
    };

    if (data.password) {
      const saltRounds = 10;
      updatedData.password = await bcrypt.hash(data.password, saltRounds);
    }

    return await userRepository.update(id, updatedData);
  },

  async remove(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error("Usuário não encontrado");
    await userRepository.remove(id);
  },

  async login({ userEmail, password }) {
    const user = await userRepository.findByEmail(userEmail);
    if (!user) throw new Error("Usuário não encontrado");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Senha incorreta");

    return { message: "Login bem-sucedido", user };
  },
};
