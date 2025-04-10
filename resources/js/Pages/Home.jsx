import VerifikacijaForm from "../Componets/Verifikacija"
import Departmani from "../Componets/Departmani"
import Navbar from "../Componets/Tools/Navbar";

const Home = ({ smerovi }) => {

  return (
   <>
    <Navbar/>
    <div className="flex justify-center items-center mt-20">
      <Departmani smerovi={smerovi}/>
    </div>
   </>
  );
};

export default Home;