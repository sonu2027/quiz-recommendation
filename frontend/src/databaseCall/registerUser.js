const registerUser = async (userData) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/user/register`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(userData),
      }
    );
    let data = await response.json();
    if (data.userExist) {
      throw false;
    }
    console.log("data after registration is: ", data);
    return data.data;
  } catch (error) {
    throw error;
  }
};

export default registerUser;