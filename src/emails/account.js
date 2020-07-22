const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'riccardo_polacci@hotmail.com',
        subject: 'Welcome to Task Manager App! 🎉',
        html: `<h2>Welcome ${name}!</h2><p>We hope that you enjoy our application made with ❤️</p>`,
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'riccardo_polacci@hotmail.com',
        subject: 'Goodbye! 😢',
        html: `<h2>Goodbye ${name}!</h2><p>We hope to see you soon!👋</p><p>What did we do wrong?🤷‍♂️ Could you give us some feedback please?🙏🏻`,
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail,
}
