import { Router } from "express";
import { logincontroller } from "../controladores/Autenticacion/login.controller";

const loginRuta = Router();

loginRuta.post('/login', logincontroller);

export default loginRuta;