const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();
class Mail {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }
  //function to render different templates that will be used to send emails
  async renderTemplate(templateName, data) {
    console.log(data);
    const filepath = path.join(__dirname, "Templates", `${templateName}.ejs`);
    const template = await ejs.renderFile(filepath, { data });
    return template;
  }

  //function to send the email to the individual
  async sendMail(to, subject, data, templateName) {
    const htmlcontent = await this.renderTemplate(templateName, data);
    const mailOptions = {
      from: process.env.MAIL_FROM, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: htmlcontent,
    };
    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
module.exports = new Mail();
