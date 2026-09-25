import Hero from './Hero.jsx';
import SelectedWorks from './SelectedWorks.jsx';
import Statement from './Statement.jsx';
import Featured from './Featured.jsx';
import Studio from './Studio.jsx';
import Available from './Available.jsx';
import Closing from './Closing.jsx';

export default function Home() {
  return (
    <main className="home">
      <Hero />
      <SelectedWorks />
      <Statement />
      <Featured />
      <Studio />
      <Available />
      <Closing />
    </main>
  );
}
