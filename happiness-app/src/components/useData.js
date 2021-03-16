import '../App.css';
import {useEffect, useState} from 'react';
import worldmap from '../data/map.json';

const useData = () => {
  const [data, setData] = useState(null);

  // Load world map data from json-file
  useEffect(() => {
    setData({
      land: worldmap.features
    });

    return () => undefined;
  }, []);

  return data;
};

export default useData;