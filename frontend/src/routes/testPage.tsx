type Props = {};
const TestPage = (props: Props) => {
  const handleOnClick = async () => {
    const request = await fetch("http://localhost:3000/api/auth/verify", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await request.json();

    if (response.status === "Unauthorized") {
      console.log("Unauthorized");
      return;
    } else if (response.status === "Authorized") {
      console.log("Authorized", response.user);
      return;
    }
  };
  return (
    <div>
      <button onClick={handleOnClick}>check</button>
    </div>
  );
};

export default TestPage;
