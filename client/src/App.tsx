import Navbar from "./components/navbar";
import { ForexCard } from "./components/forex-card";

const App = () => {
  return (
    <div className="main bg-neutral-950 min-h-screen pb-4 w-full text-gray-50">
      <Navbar></Navbar>
      <div className="w-full justify-center flex flex-col items-center mt-8 gap-8 max-w-[95vw] mx-auto ">
        <h1 className="text-3xl sm:text-5xl font-semibold">Historical Currency Data</h1>
        <ForexCard />
      </div>
    </div>
  );
};

export default App;
