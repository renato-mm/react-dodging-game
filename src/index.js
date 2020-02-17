import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const squarePos = {
    top: props.position,
    left: "30px",
  };
  
  return (
    <div
      style = {squarePos}
      className = {"square"}
      onClick = { props.squareOnClick }
    >
    </div>
  );
}

function Barrier(props) {
  const barrierTop = {
    height: props.height+"px",
    top: "20px",
    left: props.left+"px",
  };
  const barrierGap = {
    height: props.gap+"px",
    top: (props.height+20)+"px",
    left: props.left+"px",
  };
  const barrierBottom = {
    height: 300-(props.height+props.gap)+"px",
    top: (props.height+props.gap+20)+"px",
    left: props.left+"px",
  };
  
  return (
    <div>
      <div
        style = {barrierTop}
        className = {"barrier"}
      >
      </div>
      <div
        style = {barrierGap}
        className = {"gap"}
      >
      </div>
      <div
        style = {barrierBottom}
        className = {"barrier"}
      >
      </div>
    </div>
  );
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      squarePos: 290,
      gravity: 1,
      interval: setInterval(this.gameUpdate, 20),
      score: 0,
      maxHeight: 150,
      minHeight: 20,
      maxGap: 150,
      minGap: 50,
      barriers: [],
    };
  }

  renderSquare() { 
    const newPos = this.state.squarePos+"px";   
    return (
      <Square
        position = {newPos}
      />
    );
  }

  renderBarriers() {
    const barriers = [];
    for(let j = 0; j < this.state.barriers.length; j++){
      barriers.push(this.renderBarrier(this.state.barriers[j]));
    }
    return barriers; 
  }

  renderBarrier(barrier) {
    return (
      <Barrier
        left = {barrier.position}
        height = {barrier.height}
        gap = {barrier.gap}
      />
    );
  }

  reverseGravity(){
    this.setState({
      gravity: this.state.gravity === 1 ? -1 : 1,
    })
  }

  gameUpdate = () => {
    var newPos = this.state.squarePos + this.state.gravity;
    newPos = (newPos > 290) ? 290 : newPos;
    newPos = (newPos < 20) ? 20 : newPos;
    const barriersCopy = this.updateBarriersPosition();
    if(this.state.score % 150 === 0){
      const height = Math.floor(Math.random()*(this.state.maxHeight-this.state.minHeight+1)+this.state.minHeight);
      const gap = Math.floor(Math.random()*(this.state.maxGap-this.state.minGap+1)+this.state.minGap);
      this.setState({
        barriers: barriersCopy.concat([{
          position: 510,
          height: height,
          gap: gap,
        }])
      });
    }
    this.setState({
      squarePos: newPos,
      score: this.state.score + 1
    })
    this.checkConflict();
  }

  updateBarriersPosition(){
    const barriersCopy = this.state.barriers;
    if(barriersCopy.length > 0 && barriersCopy[0].position <= 20){
      barriersCopy.shift();
    }
    for(let j = 0; j < barriersCopy.length; j++){
      barriersCopy[j].position--;
    }
    return barriersCopy; 
  }

  checkConflict(){
    const firstBarrier = this.state.barriers[0];
    const playerPosition = this.state.squarePos;
    if(firstBarrier.position <= 60){
      if(playerPosition <= firstBarrier.height+20
        || playerPosition+30 >= firstBarrier.gap+firstBarrier.height+20){
        clearInterval(this.state.interval);
      }
    }
  }

  resetGame(){
    clearInterval(this.state.interval)
    this.setState({
      squarePos: 290,
      gravity: 1,
      interval: setInterval(this.gameUpdate, 20),
      score: 0,
      barriers: [],
    });
  }

  render() {
    return (
      <div className="game">
        <div className="game-board" onClick={() => this.reverseGravity()}>
          {this.renderSquare()}
          {this.renderBarriers()}
        </div>
        <div className="game-info">
          <div>Score: {this.state.score}</div>
          <button onClick={() => this.resetGame()}>Reset</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
