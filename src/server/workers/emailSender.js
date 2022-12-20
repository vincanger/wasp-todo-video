import nodemailer from 'nodemailer';

export async function emailSender(task, context) {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const todos = await context.entities.Task.findMany({
    where: {
      isDone: false,
    },
  });

  const info = await transporter.sendMail({
    from: '"Your ToDos" <todos@wasp-lang.dev>',
    to: 'your@email.com',
    subject: `Unfinished Todos`,
    html: `you have unfinished todos: ${todos}`,
  });

  const url = nodemailer.getTestMessageUrl(info);
  console.log(`${task.name} email sent! URL: ${url}`);
}
