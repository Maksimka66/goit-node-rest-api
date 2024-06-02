import nodemailer from "nodemailer";

const { UKRNET_USER, UKRNET_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: { user: UKRNET_USER, pass: UKRNET_PASSWORD },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = (data) => {
  const email = { ...data, from: UKRNET_USER };
  return transport.sendMail(email);
};

export default sendEmail;
