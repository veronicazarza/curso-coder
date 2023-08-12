import express from 'express';
import passport from 'passport';
import { UserModel } from '../DAO/models/users.model.js';
import { checkUser } from '../middlewares/auth.js';


export const loginRouter = express.Router();

loginRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).render('error', { error: 'no se pudo cerrar su session' });
      }
      return res.redirect('/login');
    });
  });

loginRouter.post('/register', async (req, res) => {
try {   
  const { firstName, lastName, age, email, password } = req.body;
  if (!firstName || !lastName || !age || !email || !password) {
    console.log('error 1');
    return res.status(400).render('error-page', { msg: 'faltan datos' });
  }
    await UserModel.create({ firstName, lastName, age, email, password});
    req.session.firstName = firstName;
    req.session.lastName = lastName;
    req.session.email = email;
    const session = { firstName: req.session.firstName, lastName: req.session.lastName, email: req.session.email};
    return res.status(200).render('products', {session: session});
  } catch (e) {
    console.log(e);
    return res.status(400).render('error-page', { msg: 'controla tu email y intenta mas tarde' });
  }
});

loginRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).render('error-page', { msg: 'faltan datos' });
  }
  try {
    const foundUser = await UserModel.findOne({ email });
    if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
        req.session.firstName = 'Admin';
        req.session.lastName = 'Coder';
        req.session.email = email;
        req.session.role = 'admin';
    const session = { firstName: req.session.firstName, lastName: req.session.lastName, email: req.session.email, role: req.session.role};
    return res.status(200).render('products', {session: session});
    }else if (foundUser && foundUser.password === password) {
      req.session.firstName = foundUser.firstName;
      req.session.lastName = foundUser.lastName;
      req.session.email = foundUser.email;
    const session = { firstName: req.session.firstName, lastName: req.session.lastName, email: req.session.email};
    return res.status(200).render('products', {session: session});
    } else{
      return res.status(400).render('error-page', { msg: 'email o pass incorrectos' });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).render('error-page', { msg: 'error inesperado en servidor' });
  }
});

loginRouter.get('/products', checkUser, (req, res) => {
    const session = { firstName: req.session.firstName, lastName: req.session.lastName, email: req.session.email};
    return res.status(200).render('products', {session: session});
  });

  loginRouter.get('/github', passport.authenticate('github'));

  loginRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    req.session.user = req.user;
    const session = { firstName: req.user.firstName, lastName: req.user.lastName, email: req.user.email};
    return res.status(200).render('products', {session: session});
  });

  loginRouter.get('/show', (req, res) => {
    return res.send(JSON.stringify(req.session));
  });
  
  