import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css'; 

function Hero() {
  return (
    <motion.div className="hero"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 1.2 }}
    >
      <div className="hero-content">
        <h1>Selamat datang di <span>TCG Master</span></h1>
        <p>Pusat jual beli kartu Pokemon, Yu-Gi-Oh!, dan MTG terbaik di Indonesia.</p>
        <button className="btn">Mulai Jelajah</button>
      </div>
    </motion.div>
  );
}

export default Hero;
