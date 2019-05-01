import React, { useRef, useState } from 'react'

function UseRefComponent() {
  let [name, setName] = useState("Text");

  let nameRef = useRef();

  const submitButton = () => {
    setName(nameRef.current.value);
  };

  return (
    <div className="App">
			<h5 style={{color:'cadetblue'}}> UseRef example </h5>
      <p>value : {name}</p>
      <div>
        <input ref={nameRef} type="text" /><br/><br/>
        <button type="button" onClick={submitButton}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default UseRefComponent