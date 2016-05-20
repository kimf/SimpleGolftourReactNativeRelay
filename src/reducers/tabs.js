const initialState = { tab: 'leaderboard' };

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case "CHANGE_TAB":
      return { tab: action.tab }

    default:
      return state;
  }
}
