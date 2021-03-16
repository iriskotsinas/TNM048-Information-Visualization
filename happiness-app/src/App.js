import './styles.css';
import useData from './components/useData';
import Map from './components/Map';

function App() {

  // Get data from world map json-file
  const data = useData();

  if (!data) {
    return <pre>Loading...</pre>
  }

  // Render Map-component
  return (
    <div>
      <Map data={data}/>
    </div>
    
  );
}

export default App;
