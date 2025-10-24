import { Router } from "express";
import contatosRouter from "./contatosRouter.js";
import usersRouter from "./usersRouter.js";
import processosRouter from "./processosRouter.js";
import extraRouter from "./extraRouter.js";
import anuenciaRouter from "./anuenciaRouter.js";
import codigoSRERouter from "./codigoSRERouter.js";

const router = Router();

router.use("/contatos", contatosRouter);
router.use("/users", usersRouter);
router.use("/processos", processosRouter);
router.use("/anuencia", anuenciaRouter);
router.use("/codigosSRE", codigoSRERouter);
router.use("/extras", extraRouter);

export default router;
