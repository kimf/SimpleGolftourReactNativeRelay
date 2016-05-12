const ws = new WebSocket('ws://simplegolftour.local:8123/cable');

ws.onopen = () => {
  // connection opened
  ws.send(
    JSON.stringify(
      {"command":"subscribe","identifier":"{\"channel\":\"ScoresChannel\"}"}
    )
  );
};

ws.onmessage = (e) => {
  // a message was received
  const { identifier, message, type } = JSON.parse(e.data)
  if(type !== 'ping') {
    console.log(identifier, message, type);
  } else {
    console.log('ping again');
  }
};

ws.onerror = (e) => {
  // an error occurred
  console.log(e.message);
};

ws.onclose = (e) => {
  // connection closed
  console.log(e.code, e.reason);
};
