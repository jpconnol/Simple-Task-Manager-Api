const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ollyconn5@gmail.com',
        subject: 'Welcome to Task App',
        text: `Hi ${name}, welcome to Task App. We hope you love it.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from:'ollyconn5@gmail.com',
        subject: `Goodbye ${name}, from Task App`,
        text: 'We just wanted to reach out to see if there was anything we could have done to kept you? Feel free to write back!'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail,
}