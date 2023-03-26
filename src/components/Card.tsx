import React, { useState, useEffect } from 'react';
import styles from './styles/Card.module.css';

type CardProps = {
  value: string;
  suit: string;
  hidden: boolean;
};

const Card: React.FC<CardProps> = ({ value, suit, hidden }) => {

  const [newsuit, setnewsuit] = useState('');

  useEffect(() => {
    switch (suit) {
      case 'spades':
        setnewsuit('♠')
        break;
      case 'diamonds':
        setnewsuit('♦')
        break;
      case 'clubs':
        setnewsuit('♣')
        break;
      case 'hearts':
        setnewsuit('♥')
        break;
    }
  }, [suit]);

  const getColor = () => {
    if (newsuit === '♠' || newsuit === '♣') {
      return styles.black;
    }
    else {
      return styles.red;
    }
  }

  const getCard = () => {
    if (hidden) {
      return (
        <div className={styles.hiddenCard} />
      );
    }
    else {
      return (
        <div className={styles.card}>
          <div className={getColor()}>
            <h1 className={styles.value}>{value}</h1>
            <h1 className={styles.suit}>{newsuit}</h1>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      {getCard()}
    </>
  );
}

export default Card;