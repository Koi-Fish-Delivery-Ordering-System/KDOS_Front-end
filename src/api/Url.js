const Url = "http://26.61.210.173:3001/api";
const GraphQLUrl = "http://26.61.210.173:3001/graphql";
const getJwtToken = () => {
  const token = sessionStorage.getItem("accessToken")
  return token
}

const headers = {
  "Content-Type": "application/json",
  // Add headers such as Authorization if required
  // 'Authorization': 'Bearer your-token',
};


export { headers, Url, getJwtToken, GraphQLUrl };
