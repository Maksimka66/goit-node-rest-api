import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import HttpError from "../helpers/HttpError.js";
import Contact from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  const allContacts = await Contact.find();

  res.status(200).send(allContacts);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const definiteContact = await Contact.findById(id);

    if (definiteContact === null) {
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
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (deletedContact === null) {
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

    const addNewContact = await Contact.create({ name, email, phone });
    res.status(201).send(addNewContact);
  } catch (error) {
    next(error);
  }
};

export const changeContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { id } = req.params;

  try {
    if (Object.keys({ name, email, phone }).length === 0) {
      return HttpError(400).json({
        message: "Body must have at least one field",
      });
    }

    if (validateBody(updateContactSchema)) {
      return;
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
      },
      { new: true }
    );

    if (updatedContact === null) {
      throw HttpError(404);
    }

    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {};
