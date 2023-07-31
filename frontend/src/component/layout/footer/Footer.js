import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phones</p>
        <img src={playStore} alt="" />
        <img src={appStore} alt="" />
      </div>
      <div className="midFooter">
        <h1>ECOMMERCE</h1>
        <p>High Quality is Our First Priority</p>
        <p>Copyrights 2022 &copy; Robin9</p>
      </div>
      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.instagram.com/robinsaraswat9">Instagram</a>
        <a href="https://www.youtube.com/Robin Saraswat">Youtube</a>
        <a href="https://www.facebook.com/robinsaraswat9">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
