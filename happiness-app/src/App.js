import './styles.css';
import useData from './components/useData';
import Map from './components/Map';
import { useEffect } from 'react';

function App() {

  const data = useData();

  if (!data) {
    return <pre>Loading...</pre>
  }

  console.log(data);

  return (
    <div>
      <Map data={data}/>
    </div>
    
  );
}

export default App;
