import './styles.css';
import useData from './components/useData';
import Map from './components/Map';
import { useEffect } from 'react';

const width = 960;
const height = 500;

function App() {

  const data = useData();

  if (!data) {
    return <pre>Loading...</pre>
  }

  console.log(data);

  return (
    <div width={width} height={height}>
      <Map data={data}/>
    </div>
    
  );
}

export default App;
