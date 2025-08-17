import express from 'express';
import {  daftarCheckout, hapusCheckout, tambahCheckout } from '../controllers/checkoutController.js';
import authMiddleware from '../middleware/auth.js';

const checkoutRouter = express.Router();

checkoutRouter.post('/checkout',authMiddleware, tambahCheckout);
checkoutRouter.get('/daftarCheckout', daftarCheckout);
checkoutRouter.delete('/hapusCheckout/:id', hapusCheckout);


export default checkoutRouter;
