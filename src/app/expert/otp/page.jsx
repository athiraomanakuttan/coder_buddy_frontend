const getOTP = () => {
  return (
    <div className="container">
      <div className="row pt-24">
        <div className="col-6 mx-auto border p-5">
          <h3 className="text-center">Forgot Password?</h3>
          <div className="flex justify-evenly ">
            <input type="text" className="border rounded  p-2 mb-3 mt-3 w-10" />
            <input
              type="text"
              className="border rounded  p-2 mb-3 mt-3  w-10"
            />
            <input
              type="text"
              className="border rounded  p-2 mb-3 mt-3  w-10"
            />
            <input
              type="text"
              className="border rounded  p-2 mb-3 mt-3  w-10"
            />
            <input
              type="text"
              className="border rounded  p-2 mb-3 mt-3  w-10"
            />
            <input
              type="text"
              className="border rounded  p-2 mb-3 mt-3  w-10"
            />
          </div>
          <input
            type="submit"
            value="Verify OTP"
            className="w-100 bg-primarys p-2 mb-3 text-white"
          />
        </div>
      </div>
    </div>
  );
};
export default getOTP;
