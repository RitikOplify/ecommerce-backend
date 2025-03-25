const nodemailer = require("nodemailer");
const ErrorHandler = require("./errorHandler");

exports.sendMail = (req, res, next, url) => {
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const mailoptions = {
        from: "Ritik Shah",
        to: req.body.email,
        subject: "Password Reset",
        "text": "Do Not  Share Your Password To Anyone",
        html: `<h1>Click Link Below To Reset Password <h1/>
        <h1>${url}<h1/>`
    };
    transport.sendMail(mailoptions, (err, info) => {
        if (err) {
            return next(new ErrorHandler(err, 500));
        }
        console.log(info);
        return res.status(200).json({
            message: "Mail Sent Successfully",
            url
        })
    });
    
};