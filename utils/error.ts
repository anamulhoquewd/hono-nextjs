export const handleAxiosError = (error: any) => {
  // Axios error structure
  if (error.response) {
    // Backend returns a response with status code (4xx, 5xx)
    console.error(
      "Backend Error:",
      error.response.data.message || error.response.data
    );
    console.error("Status Code:", error.response.status);
    return {
      message:
        error.response.data.message || "An error occurred on the server.",
      status: error.response.status,
    };
  } else if (error.request) {
    // Request was made but no response was received
    console.error("No Response Received:", error.request);
    return {
      message: "No response from the server. Please check your connection.",
      status: null,
    };
  } else {
    // Something happened while setting up the request
    console.error("Request Setup Error:", error.message);
    return {
      message: "An error occurred while setting up the request.",
      status: null,
    };
  }
};
