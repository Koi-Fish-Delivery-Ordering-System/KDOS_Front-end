import { getJwtToken, Url, headers, GraphQLUrl } from "./Url";
import { useQuery, ApolloClient, InMemoryCache, gql } from '@apollo/client';
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
    role
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

// Create a reusable function to update an account
export const UpdateCustomerProfile = async (accountData) => {
  try {
    const response = await axios.patch(`${baseAccountUrl}/update-profile`, accountData);

    if (response.status === 200) {
      return { success: true, message: "Account updated successfully!" };
    } else {
      return { success: false, message: "Failed to update account." };
    }
  } catch (error) {
    console.error('Error updating account:', error);
    throw new Error("Error updating account: " + error.message);
  }
};




