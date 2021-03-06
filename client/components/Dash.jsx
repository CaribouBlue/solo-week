import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import AuctionList from './AuctionList';
import { getUser, checkVerified } from '../lib/checkToken';
import formatBid from '../lib/formatBid';
import formatTime from '../lib/formatTime';

export default class Dash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      creatingAuction: false,
      newAuction: {
        user: getUser(),
        name: '',
        minBid: 0,
        length: '00:00',
      },
    };

    /*===============================
    =            sockets            =
    ===============================*/

    this.socket = io();

    /*=====  End of sockets  ======*/

    this.handleChange = this.handleChange.bind(this);
    this.getNewAuctionForm = this.getNewAuctionForm.bind(this);
    this.createAuction = this.createAuction.bind(this);
  }

  componentWillMount() {
    this.checkAuth();
  }

  getNewAuctionForm() {
    return (
      <div className="flex-col-center">
        <form
          onSubmit={this.createAuction}
        >
          Name:
          <input
            type="text"
            name="name"
            placeholder="Auction Name"
            onChange={this.handleChange}
            value={this.state.newAuction.name}
          />
          Minimum Bid:
          <input
            type="text"
            name="minBid"
            placeholder="Minimum Bid"
            onChange={this.handleChange}
            value={formatBid(this.state.newAuction.minBid)}
          />
          Length:
          <input
            type="text"
            name="length"
            placeholder="Auction Length (0:00)"
            onChange={this.handleChange}
            value={this.state.newAuction.length}
          />
          <button type="submit" >Submit</button>
        </form>
        <button
          onClick={() => this.setState({ creatingAuction: false })}
        >Cancel</button>
      </div>
    );
  }

  checkAuth() {
    const verified = checkVerified();
    if (verified) {
      this.props.history.push('/app/dash');
    } else if (this.props.location.pathname !== '/app/home/login' && this.props.location.pathname !== '/app/home/signup') {
      this.props.history.push('/app/home/login');
    }
  }

  handleChange({ target }) {
    const name = target.name;
    let val = target.value;
    if (name === 'minBid') {
      val = formatBid(val, 'num');
    }
    if (name === 'length') {
      val = formatTime.getLength(val);
    }
    const newAuction = this.state.newAuction;
    newAuction[name] = val;
    this.setState({ newAuction });
  }

  createAuction(e) {
    e.preventDefault();
    axios.post('/api/auctions', this.state.newAuction)
      .then((res) => {
        this.setState({ creatingAuction: false });
        this.socket.emit('auction list change');
      });
  }

  renderNewAuctionForm() {
    if (this.state.creatingAuction) {
      return this.getNewAuctionForm();
    }
    return (
      <button
        onClick={() => this.setState({ creatingAuction: true })}
      >New Auction</button>
    );
  }

  render() {
    return (
      <div className="dash-auction-container">
        {this.renderNewAuctionForm()}
        <AuctionList />
      </div>
    );
  }
}
