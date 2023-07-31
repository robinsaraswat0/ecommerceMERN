import React,{useState,Fragment} from 'react';
import {useNavigate} from "react-router-dom";
import "./Search.css";
import MetaData from '../layout/MetaData';

const Search = () => {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const searchSubmitHandler = (e) => {
        e.preventDefault(); // use to prevent loading on submission of form
        if(keyword.trim()){
            navigate(`/products/${keyword}`);
        } else {
            navigate("/products");
        }
    }

  return <Fragment>
      <MetaData title="Search" />
      <form className='searchBox' onSubmit={searchSubmitHandler}>
          <input type="text"
          placeholder='Search a Product...'
          onChange={(e) => setKeyword(e.target.value)} 
        />
        <input type="submit" value="Search" />

      </form>
  </Fragment>
}

export default Search