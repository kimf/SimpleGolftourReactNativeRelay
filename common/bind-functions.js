// utils/bind-functions.js

// some component
  // constructor() {
  //   super();
  //   bindFunctions.call(this, ['handleClick']);   // Second argument is array of function names
  // }
export default function bindFunctions(functions) {
  functions.forEach(f => this[f] = this[f].bind(this));
}


// Since Immutable.js never directly mutates given data,
// it always needs to make another copy of it, performing multiple iterations
// like this can be very expensive. Seq is lazy immutable sequence of data,
// meaning it will perform as few operations as possible to do its task while
// skipping creation of intermediate copies. Seq was built to be used this way.

//myMap.toSeq().filter(somePred).sort(someComp).toOrderedMap()


// perfect mix of readability and performance!
// const { id, text, isCompleted } = this.props.todo.toObject(); //toArray();
