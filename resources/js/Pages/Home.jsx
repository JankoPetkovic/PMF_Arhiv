import React from "react";
import { Link } from "@inertiajs/react";
import VerifikacijaForm from "./Verifikacija"

const Home = () => {
  return (
    <div className="bg-red-600">
      {/* <h1>Hello world</h1> */}
      <VerifikacijaForm/>
    </div>
  );
};

export default Home;