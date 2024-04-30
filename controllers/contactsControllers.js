import express from "express";
import { json } from "express";
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
} from "../services/contactsServices.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema } from "../schemas/contactsSchemas.js";

const jsonParser = express.json();

export const getAllContacts = async (req, res) => {
  const allContacts = await listContacts();

  res.status(200).send(allContacts);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const definiteContact = await getContactById(id);

    if (definiteContact === null) {
      res.status(404).send({ message: "Not found" });
    }

    res.status(200).send(definiteContact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await removeContact(id);
    res.status(200).send(deletedContact);
  } catch (error) {
    res.status(404).json({ message: "Not found" });
  }
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    validateBody(createContactSchema);

    const newContact = await addContact(name, email, phone);
    res.status(201).send(newContact);
  } catch (error) {}
};

export const updateContact = async (req, res) => {};
