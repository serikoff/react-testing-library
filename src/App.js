import React, { useState } from "react";
import axios from "axios";
import SomeComponent from "./someComponent";

const URL = "https://hn.algolia.com/api/v1/search";

const App = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [visibleText, setVisibleText] = useState(false);

  const handleFetch = async () => {
    try {
      const result = await axios.get(`${URL}?query=React`);
      setNews(result.data.hits);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <SomeComponent />
      <label htmlFor="search">search</label>
      <input id='search' placeholder={'search'} required />
      <button type="button" onClick={handleFetch}>
        Fetch News
      </button>
      {news.map.length && error === null && <div>
        some text
      </div>}


      <button type="button" onClick={() => setVisibleText(prev => !prev)}>
          show text button
        </button>

      {
        visibleText && <span>
          visibility text
        </span>
      }
      {error && <span>Something went wrong ...</span>}

      <ul>
        {news.map(({ objectID, url, title }) => (
          <li key={objectID}>
            <a href={url}>{title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
