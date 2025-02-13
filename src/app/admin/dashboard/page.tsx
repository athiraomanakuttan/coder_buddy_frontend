import Navbar from "@/components/admin/navbar/Navbar";
import ProfitReportComponent from "@/components/admin/ProfitReport/ProfitComponent";


const dashboard = () => {
  return (
    <div className=" m-0 p-0 flex">
      <div className=" p-0 m-0">
        <Navbar />
      </div>
      <div className="border w-100">
        <div className="container mt-5 flex justify-evenly ">
          <div className="border pl-10 pr-10 pt-3 pb-3 text-center">
            <h5>total post</h5>
            <h1>10</h1>
          </div>
          <div className="border pl-10 pr-10 pt-3 pb-3 text-center">
          <h5>total post</h5>
            <h1>10</h1>
          </div>
          <div className="border pl-10 pr-10 pt-3 pb-3 text-center">
          <h5>total post</h5>
            <h1>10</h1>
          </div>
          <div className="border pl-10 pr-10 pt-3 pb-3 text-center">
          <h5>total post</h5>
            <h1>10</h1>
          </div>

          <div className="border pl-10 pr-10 pt-3 pb-3 text-center">
          <h5>total post</h5>
            <h1>10</h1>
          </div>

        </div>
        <ProfitReportComponent />
      </div>
    </div>
  );
};

export default dashboard;
