import React from "react";
import "./aboutSection.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import YouTubeIcon from "@material-ui/icons/YouTube";
import InstagramIcon from "@material-ui/icons/Instagram";
import { Link } from "react-router-dom";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/robinsaraswat9";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/depressor/image/upload/v1690548214/IMG_20230727_083952_ylz1jp.jpg"
              alt="Founder"
            />
            <Typography>Robin</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a website made by Robin. Only with the purpose to learn
              the different functionality
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <Link to="#" target="blank">
              <YouTubeIcon className="youtubeSvgIcon" />
            </Link>

            <a href="https://instagram.com/robinsaraswat9" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
