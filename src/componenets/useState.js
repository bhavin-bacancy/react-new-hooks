import React, { Component, useState } from 'react';

const UseState = () => {
	const [count, setCount] = useState(0);
	return <div>
		<h5 style={{color:'cadetblue'}}> UseState example </h5>
		<span>	Count: {count} </span> <br /> <br />
		<button onClick={() => setCount(count + 1)}> + </button>&nbsp;
		<button onClick={() => setCount(count - 1)}> - </button>&nbsp;
		<button onClick={() => setCount(0)}> Reset </button>&nbsp;
	</div>
}

class UseStateComponent extends Component {
	render() {
		return (
			<UseState />
		)
	}
}

export default UseStateComponent;
