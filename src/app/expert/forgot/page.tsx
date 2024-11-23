 const forgotPassword = ()=>{
    return(
        <>
        <div className="container">
            <div className="row pt-24">
                <div className="col-6 mx-auto border p-5">
                    <h3 className="text-center">Forgot Password?</h3>
                    <input
                  type="text"
                  placeholder="Enter your email id"
                  className="border rounded w-100 p-2 mb-3 mt-3"
                />
                <input type="submit" value="Send OTP"  className="w-100 bg-primarys p-2 mb-3 text-white"  />
                
                </div>
            </div>
        </div>
        </>
    )
}

export default forgotPassword;