import HttpError from "../helpers/HttpError.js";
import Contact from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  const allContacts = await Contact.find({ owner: req.user.id });

  res.status(200).send(allContacts);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const definiteContact = await Contact.findById(id);

    if (
      definiteContact === null ||
      definiteContact.owner.id.toString() !== req.user.id
    ) {
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

    if (
      deletedContact === null ||
      deletedContact.owner.id.toString() !== req.user.id
    ) {
      throw HttpError(404);
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;

  try {
    const addNewContact = await Contact.create({
      name,
      email,
      phone,
      favorite,
      owner: req.user.id,
    });

    res.status(201).send(addNewContact);
  } catch (error) {
    next(error);
  }
};

export const changeContact = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;
  const { id } = req.params;

  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Body must have at least one field",
      });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        favorite,
      },
      { new: true }
    );

    if (
      updatedContact === null ||
      updatedContact.owner.id.toString() !== req.user.id
    ) {
      throw HttpError(404);
    }

    res.status(200).send(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { favorite } = req.body;
  const { id } = req.params;

  try {
    const changedFavorite = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );

    if (
      changedFavorite === null ||
      changedFavorite.owner.id.toString() !== req.user.id
    ) {
      throw HttpError(404);
    }

    res.status(200).send(changedFavorite);
  } catch (error) {
    next(error);
  }
};
