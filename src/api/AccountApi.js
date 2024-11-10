import { getJwtToken, Url, headers, GraphQLUrl } from "./Url";
import { useQuery, ApolloProvider, ApolloClient, InMemoryCache, gql } from '@apollo/client';
import axios from "axios";

//URL For Swagger API
const baseAccountUrl = `${Url}/account`;

//Headers for Swagger API (JWT Token)
const getHeaders = () => {
  const token = getJwtToken();
  return {
    ...headers,
    Authorization: `Bearer ${token}`
  }
}

//GraphQL Query for Fetching All Accounts
const GET_ALL_ACCOUNT = gql`
  query FindAllAccount {
  findAllAccount {
    accountId
    username
    fullName
    email
    phone
    address
    walletAmount
    roles {
      roleId
      name
    }
  }
}
`;

//Apollo Client for GraphQL
export const client = new ApolloClient({
  uri: GraphQLUrl,
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${getJwtToken()}`,
  },
  defaultOptions: {
    watchQuery: { fetchPolicy: 'network-only', errorPolicy: 'all' },
    query: { fetchPolicy: 'network-only', errorPolicy: 'all' },
  },
});

// Create a reusable function to fetch all accounts
export const GetAllAccount = () => {
  const { loading, error, data } = useQuery(GET_ALL_ACCOUNT, {
    client,
    onError: (error) => {
      console.error('GraphQL Error:', error);
    },
  });

  return { loading, error, data: data ? data.findAllAccount : [] };
};


