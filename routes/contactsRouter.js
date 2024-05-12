import express from "express";

import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  changeContact,
  updateStatus,
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();
const parser = express.json();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", parser, createContact);

contactsRouter.put("/:id", parser, changeContact);

contactsRouter.patch("/:id", updateStatus);

export default contactsRouter;
