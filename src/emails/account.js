const sgMail = require("@sendgrid/mail");

//Also, they api key above will be exposed when deployed to github! Pushing to heroku goes through github! Keep in mind that commit history will containg the exposed api key, even if you hide it later. A bot can scrape them!

sgMail.setApiKey(process.env.SENDGRID_API_KEY); //when naming  env. variables it's common to use all uppercase and separate words with underscores.Convention.

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "shmula979@gmail.com", //here you would setup a custom domain in real world. Read the documentation on how to do that once there!
    subject: "Welcome to task-manager app",
    text: `Welcome to the app, ${name}. Let me know how do you get along with the app!`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "shmula979@gmail.com", //here you would setup a custom domain in real world. Read the documentation on how to do that once there!
    subject: `Goodbye ${name}`,
    text: `Goodbye, ${name}. Please let us know if there was something we could have done!`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
