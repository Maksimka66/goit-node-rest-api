import HttpError from "../helpers/HttpError.js";
import contactsRouter from "../routes/contactsRouter.js";
import Contact from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const allContacts = await Contact.find({ owner: req.user.id });

    if (allContacts === null) {
      throw HttpError(401);
    }

    const contactsWithoutToken = allContacts.map((contact) => ({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      favorite: contact.favorite,
    }));

    res.status(200).send(contactsWithoutToken);
  } catch (err) {
    next(err);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const definiteContact = await Contact.findOne({
      _id: id,
      owner: req.user.id,
    });

    if (definiteContact === null) {
      throw HttpError(404);
    }

    res.status(200).json({
      name: definiteContact.name,
      email: definiteContact.email,
      phone: definiteContact.phone,
      favorite: definiteContact.favorite,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedContact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

    if (deletedContact === null) {
      throw HttpError(404);
    }

    res.status(200).json({
      name: deletedContact.name,
      email: deletedContact.email,
      phone: deletedContact.phone,
      favorite: deletedContact.favorite,
    });
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

    res.status(201).send({
      name: addNewContact.name,
      email: addNewContact.email,
      phone: addNewContact.phone,
      favorite: addNewContact.favorite,
    });
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

    const updatedContact = await Contact.findOneAndUpdate(
      {
        _id: id,
        owner: req.user.id,
      },
      {
        name,
        email,
        phone,
        favorite,
      },
      { new: true }
    );

    if (updatedContact === null) {
      throw HttpError(404);
    }

    res.status(200).send({
      name: updatedContact.name,
      email: updatedContact.email,
      phone: updatedContact.phone,
      favorite: updatedContact.favorite,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { favorite } = req.body;
  const { id } = req.params;

  try {
    const changedFavorite = await Contact.findOneAndUpdate(
      {
        _id: id,
        owner: req.user.id,
      },
      { favorite },
      { new: true }
    );

    if (changedFavorite === null) {
      throw HttpError(404);
    }

    res.status(200).send({
      name: changedFavorite.name,
      email: changedFavorite.email,
      phone: changedFavorite.phone,
      favorite: changedFavorite.favorite,
    });
  } catch (error) {
    next(error);
  }
};
