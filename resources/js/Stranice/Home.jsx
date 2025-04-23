import VerifikacijaForm from "../Komponente/Verifikacija"
import Departmani from "../Komponente/Departmani"
import Navbar from "../Komponente/Alati/Navbar";

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