export function getFetchers() {
  return {
    EGLL: {
      url: process.env.EGLL_PARSER_URL,
      refreshPeriod: 1000*30,
    },
  };
}

export default getFetchers;
