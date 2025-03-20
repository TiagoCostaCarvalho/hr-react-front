import './BaseContainer.css';

function BaseContainer(props) {
  return (
    <div className="BaseContainer">
      {props.children}
    </div>
  );
}

export default BaseContainer;
