import './styles.css';
import useData from './components/useData';
import Marks from './components/Marks';

const width = 960;
const height = 500;

function App() {
  const data = useData();

  if (!data) {
    return <pre>Loading...</pre>
  }

  console.log(data);

  return (
    <svg width={width} height={height}>
      <Marks data={data} />
    </svg>
  );
}

export default App;
