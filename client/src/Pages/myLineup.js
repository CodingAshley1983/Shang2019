import React, { Component } from "react";
import {Link} from 'react-router-dom';
import Axios from 'axios';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../Components/actions/authActions";
import "./myLineup.css";
import "../Components/BandCards/Bandcards.css"
import Schedule from '../Components/Schedule';
import sharemyLineup from './sharemyLineup';
import { Container,Jumbotron,Card,Button,Row,Col} from "react-bootstrap";
import API from "../utils/API";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {FacebookShareButton, TwitterShareButton, EmailShareButton,} from 'react-share';


class myLineup extends Component {
    constructor(props) {
    super(props);
    this.state = {
        
        bands: [],
        stage:"",
        band: "",
        time: "",
        day: "",
        image: "",
        url: "",
        bio: "",
        _id: "",
        userId: ""
        
    };
}


   

    componentDidMount() {
        const userId = this.props.auth.user.id
        if (this.props.auth.isAuthenticated) {
            this.setState({
                userId: userId

            })
            console.log("this is the userid", userId)

        }
        this.loadUserBands()
    }

  



    loadUserBands = () => {
        const userId = this.props.auth.user.id
        API.getUserBands(userId)

            .then(res =>
                this.setState({ bands: res.data[0].userBands })

            )
            .catch(err => console.log(err));
    };


    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    shareButton=(e)=>{
      
        // href={window.location+"/"+this.props.auth.userId}

    }

    // Deletes band from user's array, loops back through remaining bands
         deleteBand = (bandId) => {
            const userId = this.props.auth.user.id
            API.deleteBand(userId,bandId)
           this.loadUserBands();
      };







    render() {
        const { user } = this.props.auth;
        const userId = this.props.auth.user.id
        const url= window.location +"/"+ userId
        console.log("Here's the URL",url)
        return (
            <React.Fragment>
                <Jumbotron>
                    <div id="mylineup-header"> 
                        <h2> Welcome to myLineup, {user.name}!</h2><FontAwesomeIcon icon="user-check" />
                        <h6 style={{ color: "black" }}>See your shows!<br /> Easily Remove performers, or go look for new ones to check out.</h6><br />
                        <h6 style={{ color: "black" }}>Share with friends to meet up and git down!</h6>
                        <Link to="/search">
                           <Button 
                            variant="outline-info"
                        >
                            Get Bands
                        </Button>
                        </Link>
                        <FacebookShareButton as Button
                         className="button" variant="outline-info btn-large" url={window.location.href+"/"+this.props.auth.user.id} children={Schedule}  quote={"Check out myLineup for Shangri-La!      Get the Shang app:www.ShangApp.com"} hashtag={"#ShangriLa2019"}onClick={this.shareButton}>
                            Share
                            
                        </FacebookShareButton>
                        
                        <Button
                            onClick={this.onLogoutClick}
                            variant="outline-primary btn-large"
                        >
                            Logout
                        </Button>
                        </div>
                </Jumbotron>
                <Container>
                    <div id="all-bands-header">
                        <h1>My Shows</h1><hr />

                        <Schedule>
                            {this.state.bands.map(card => (

                                <Card style={{ width: '18rem' }} key={card._id}>
                                    <Card.Img variant="top" src={card.image} />
                                    <Card.Body>
                                        <Card.Title>{card.band}</Card.Title>
                                    </Card.Body>
                                    <Card.ImgOverlay>
                                        {card.day} | {card.time} | {card.stage}
                                    </Card.ImgOverlay>
                                    <Card.Footer>
                                        <Button className="btn-success btn-large" href={card.url}><FontAwesomeIcon icon="info-circle" /></Button>
                                        <Button variant="outline-warning btn-large" onClick={() => this.deleteBand(card._id)}>Remove Band</Button>
                                    </Card.Footer>
                                </Card>
                            ))}

                        </Schedule>

                    </div>
                </Container>
            </React.Fragment>
        );

    }
}

myLineup.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(
    mapStateToProps,
    { logoutUser }
)(myLineup);























