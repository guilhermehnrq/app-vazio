const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { dados: {}, erros: [] });
});

router.post('/enviar', [
  body('nome').trim().notEmpty().withMessage('Informe seu nome.'),
  body('email').trim().isEmail().withMessage('Informe um e-mail válido.'),
  body('telefone').trim().notEmpty().withMessage('Informe seu telefone.'),
  body('assunto').trim().notEmpty().withMessage('Informe o assunto.'),
  body('mensagem').trim().notEmpty().withMessage('Escreva sua mensagem.')
], async (req, res) => {
  const dados = {
    nome: req.body.nome || '',
    email: req.body.email || '',
    telefone: req.body.telefone || '',
    assunto: req.body.assunto || '',
    mensagem: req.body.mensagem || ''
  };

  const resultado = validationResult(req);

  if (!resultado.isEmpty()) {
    const erros = resultado.array().map(erro => erro.msg);
    return res.status(422).render('index', { dados, erros });
  }

  const { email_user, email_pass, email_to } = process.env;

  if (!email_user || !email_pass || !email_to) {
    return res.status(500).render('index', {
      dados,
      erros: ['Configure email_user, email_pass e email_to no arquivo .env.']
    });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email_user,
      pass: email_pass
    }
  });

  try {
    await transporter.sendMail({
      from: email_user,
      to: email_to,
      replyTo: dados.email,
      subject: dados.assunto,
      text: `Nome: ${dados.nome}\nE-mail: ${dados.email}\nTelefone: ${dados.telefone}\n\nMensagem:\n${dados.mensagem}`
    });

    res.render('sucesso', { nome: dados.nome });
  } catch (erro) {
    console.error('Erro ao enviar e-mail:', erro.message);
    res.status(500).render('index', {
      dados,
      erros: ['Não foi possível enviar o e-mail. Confira as configurações e tente novamente.']
    });
  }
});

module.exports = router;
