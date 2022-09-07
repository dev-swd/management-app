// m00
import "./HomePage.css";
import MyPage from "./MyPage";
import MyToDo from "./MyToDo";

const HomePage = () => {
  return (
    <div className="m00-home-background">
      <div className="m00-container">
        <MyPage />
        <MyToDo />
      </div>
    </div>
  );
}

export default HomePage;
