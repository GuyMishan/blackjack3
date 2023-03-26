import React, { useState, useEffect } from 'react';
import Status from './Status';
import Controls from './Controls';
import Hand from './Hand';
import axios from 'axios';

const Game: React.FC = (props) => {
  enum GameState {
    bet,
    init,
    userTurn,
    dealerTurn
  }

  enum Deal {
    user,
    dealer,
    hidden
  }

  enum Message {
    bet = 'Place a Bet!',
    hitStand = 'Hit or Stand?',
    bust = 'Bust!',
    userWin = 'You Win!',
    dealerWin = 'Dealer Wins!',
    tie = 'Tie!'
  }
  const [userCards, setUserCards]: any[] = useState([]);
  const [userScore, setUserScore] = useState(0);

  const [dealerCards, setDealerCards]: any[] = useState([]);
  const [dealerScore, setDealerScore] = useState(0);

  const [balance, setBalance] = useState(100);
  const [bet, setBet] = useState(0);

  const [gameState, setGameState] = useState(GameState.bet);
  const [message, setMessage] = useState(Message.bet);
  const [buttonState, setButtonState] = useState({
    hitDisabled: false,
    standDisabled: false,
    resetDisabled: true
  });

  useEffect(() => {
    axios.get(`https://localhost:7073/api/Blackjack/rematch`)
      .then(res => {

      })
      .catch(error => {
        console.log(error)
      })
  }, []);

  useEffect(() => {
    if (gameState === GameState.init) {
      axios.get(`https://localhost:7073/api/Blackjack/start`)
        .then(res => {
          console.log(res.data)
          setUserCards([{ 'value': res.data.pCards[0].value, 'suit': res.data.pCards[0].suit, 'hidden': false }, { 'value': res.data.pCards[1].value, 'suit': res.data.pCards[1].suit, 'hidden': false }])
          setDealerCards([{ 'value': res.data.dCards[0].value, 'suit': res.data.dCards[0].suit, 'hidden': false }, { 'value': res.data.dCards[1].value, 'suit': res.data.dCards[1].suit, 'hidden': true }])
          setGameState(GameState.userTurn);
          setMessage(Message.hitStand);
        })
        .catch(error => {
          console.log(error)
        })
    }
    //check win/lose/bust
    axios.get(`https://localhost:7073/api/Blackjack`)
      .then(res => {
        let tempstateofgame = res.data.s;
        switch (tempstateofgame) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            setBalance(Math.round((balance + (bet * 2)) * 100) / 100);
            setMessage(Message.userWin);
            buttonState.hitDisabled = true;
            buttonState.standDisabled = true;
            buttonState.resetDisabled = false;
            setButtonState({ ...buttonState });
            break;
          case 3:
            setMessage(Message.dealerWin);
            buttonState.hitDisabled = true;
            buttonState.standDisabled = true;
            buttonState.resetDisabled = false;
            setButtonState({ ...buttonState });
            setGameState(GameState.dealerTurn);
            break;
          case 4:
            setBalance(Math.round((balance + (bet * 1)) * 100) / 100);
            setMessage(Message.tie);
            break;
        }
      })
      .catch(error => {
        console.log(error)
      })

  }, [gameState]);

  useEffect(() => {
    calculate(userCards, setUserScore);
  }, [userCards]);

  useEffect(() => {
    calculate(dealerCards, setDealerScore);
  }, [dealerCards]);

  const resetGame = () => {
    axios.get(`https://localhost:7073/api/Blackjack/rematch`)
      .then(res => {
        console.clear();

        setUserCards([]);
        setUserScore(0);

        setDealerCards([]);
        setDealerScore(0);

        setBet(0);

        setGameState(GameState.bet);
        setMessage(Message.bet);
        setButtonState({
          hitDisabled: false,
          standDisabled: false,
          resetDisabled: true
        });
      })
      .catch(error => {
        console.log(error)
      })
  }

  const placeBet = (amount: number) => {
    setBet(amount);
    setBalance(Math.round((balance - amount) * 100) / 100);
    setGameState(GameState.init);
  }

  const drawCard = (dealType: Deal) => {
    setDealerCards([]);
    setUserCards([]);
    axios.get(`https://localhost:7073/api/Blackjack/hit`)
      .then(res => {
        let temparr1: any[] = [];
        let temparr2: any[] = [];

        console.log(res.data)
        temparr1.push({ 'value': res.data.dCards[0].value, 'suit': res.data.dCards[0].suit, 'hidden': false })
        for (let i = 1; i < res.data.dCards.length; i++) {
          temparr1.push({ 'value': res.data.dCards[i].value, 'suit': res.data.dCards[i].suit, 'hidden': true })
        }
        for (let j = 0; j < res.data.pCards.length; j++) {
          temparr2.push({ 'value': res.data.pCards[j].value, 'suit': res.data.pCards[j].suit, 'hidden': false })
        }
        axios.get(`https://localhost:7073/api/Blackjack`)
          .then(res => {
            let tempstateofgame = res.data.s;
            switch (tempstateofgame) {
              case 0:
                break;
              case 1:
                break;
              case 2:
                setBalance(Math.round((balance + (bet * 2)) * 100) / 100);
                setMessage(Message.userWin);
                buttonState.hitDisabled = true;
                buttonState.standDisabled = true;
                buttonState.resetDisabled = false;
                setButtonState({ ...buttonState });
                break;
              case 3:
                setMessage(Message.dealerWin);
                buttonState.hitDisabled = true;
                buttonState.standDisabled = true;
                buttonState.resetDisabled = false;
                setButtonState({ ...buttonState });
                setGameState(GameState.dealerTurn);
                break;
            }
          })
          .catch(error => {
            console.log(error)
          })

        setDealerCards(temparr1);
        setUserCards(temparr2);
        setGameState(GameState.userTurn);
        setMessage(Message.hitStand);
      })
      .catch(error => {
        console.log(error)
      })
  }

  const calculate = (cards: any[], setScore: any) => {
    let total = 0;
    cards.forEach((card: any) => {
      if (card.hidden === false && card.value !== 'A') {
        switch (card.value) {
          case 'K':
            total += 10;
            break;
          case 'Q':
            total += 10;
            break;
          case 'J':
            total += 10;
            break;
          default:
            total += Number(card.value);
            break;
        }
      }
    });
    const aces = cards.filter((card: any) => {
      return card.value === 'A';
    });
    aces.forEach((card: any) => {
      if (card.hidden === false) {
        if ((total + 11) > 21) {
          total += 1;
        }
        else if ((total + 11) === 21) {
          if (aces.length > 1) {
            total += 1;
          }
          else {
            total += 11;
          }
        }
        else {
          total += 11;
        }
      }
    });
    setScore(total);
  }

  const hit = () => {
    drawCard(Deal.user);
  }

  const stand = () => {
    setDealerCards([]);
    setUserCards([]);
    axios.get(`https://localhost:7073/api/Blackjack/stand`)
      .then(res => {
        let temparr1: any[] = [];
        let temparr2: any[] = [];

        console.log(res.data)
        for (let i = 0; i < res.data.dCards.length; i++) {
          temparr1.push({ 'value': res.data.dCards[i].value, 'suit': res.data.dCards[i].suit, 'hidden': false })
        }
        for (let j = 0; j < res.data.pCards.length; j++) {
          temparr2.push({ 'value': res.data.pCards[j].value, 'suit': res.data.pCards[j].suit, 'hidden': false })
        }

        setDealerCards(temparr1);
        setUserCards(temparr2);
      })
      .then(res => {
        buttonState.hitDisabled = true;
        buttonState.standDisabled = true;
        buttonState.resetDisabled = false;
        setButtonState({ ...buttonState });
        setGameState(GameState.dealerTurn);
      })
  }

  return (
    <>
      <Status message={message} balance={balance} />
      <Controls
        balance={balance}
        gameState={gameState}
        buttonState={buttonState}
        betEvent={placeBet}
        hitEvent={hit}
        standEvent={stand}
        resetEvent={resetGame}
      />
      <Hand title={`Dealer's Hand (${dealerScore})`} cards={dealerCards} />
      <Hand title={`Your Hand (${userScore})`} cards={userCards} />
    </>
  );
}

export default Game;
