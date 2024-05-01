import express from "express";
import { json } from "express";
import {
  addContact,
  getContactById,
  listContacts,
  removeContact,
  updateContact,
} from "../services/contactsServices.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";

const jsonParser = express.json();

export const getAllContacts = async (req, res) => {
  const allContacts = await listContacts();

  res.status(200).send(allContacts);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const definiteContact = await getContactById(id);

    if (!definiteContact) {
      throw HttpError(404);
    }

    res.status(200).json(definiteContact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedContact = await removeContact(id);

    if (!deletedContact) {
      throw HttpError(404);
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;

  try {
    if (validateBody(createContactSchema)) {
      return;
    }
    const newContact = await addContact(name, email, phone);
    res.status(201).send(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { name, email, phone } = req.body;

  try {
    if (Object.keys({ name, email, phone }).length === 0) {
      return HttpError(400).json({
        message: "Body must have at least one field",
      });
    }
    if (validateBody(updateContactSchema)) {
      return;
    }
    const updatedContact = await updateContact({ name, email, phone });
    if (!updatedContact) {
      throw HttpError(404);
    }
    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};
