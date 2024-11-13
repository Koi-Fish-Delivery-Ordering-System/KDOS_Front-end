import React from 'react';
import { useQuery, gql, ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { Card, Row, Col, Spin, Alert } from 'antd';
import { toast } from 'react-toastify';
import Navbar2 from './navbar2';
import '../../css/ourservices.css'; // Import the CSS file

// GraphQL Query
const FIND_ALL_TRANSPORT_SERVICE = gql`
  query FindAllTransportService {
    findAllTransportService {
      description
      name
      pricePerAmount
      pricePerKg
      pricePerKm
      transportServiceId
      type
      updatedAt
    }
  }
`;

const client = new ApolloClient({
  uri: 'http://26.61.210.173:3001/graphql',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: 'network-only', errorPolicy: 'all' },
    query: { fetchPolicy: 'network-only', errorPolicy: 'all' },
  },
});

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0 VNĐ'; // Handle null or undefined
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VNĐ';
};

const OurServices = () => {
  const { loading, error, data } = useQuery(FIND_ALL_TRANSPORT_SERVICE, {
    client,
    variables: { data: { options: { take: 10, skip: 0 } } },
    onError: (error) => {
      console.error('GraphQL Error:', error);
      toast.error("Error fetching additional services: " + error.message);
    },
  });

  if (loading) return <Spin size="large" className="loading-spinner" />;
  if (error) return <Alert message="Error fetching services" description={error.message} type="error" className="error-alert" />;

  return (
    <ApolloProvider client={client}>
      <Navbar2 />
      <div className="our-services">
        <h1>Our Transport Services</h1>
        <Row gutter={[16, 16]}>
          {data.findAllTransportService.map((service) => (
            <Col key={service.transportServiceId} xs={24} sm={12} md={8}>
              <Card
                title={service.name}
                bordered={false}
                hoverable
                className="service-card"
              >
                {service.type === "road" && (
                  <img src='src/images/truck.png' alt="Road" className="service-image" />
                )}
                {service.type === "air" && (
                  <img src='src/images/plane.png' alt="Air" className="service-image" />
                )}
                <p><strong>Description:</strong> {service.description}</p>
                <p><strong>Price per Amount:</strong> {formatCurrency(service.pricePerAmount)}</p>
                <p><strong>Price per Kg:</strong> {formatCurrency(service.pricePerKg)}</p>
                <p><strong>Price per Km:</strong> {formatCurrency(service.pricePerKm)}</p>
                <p><strong>Last Updated:</strong> {new Date(service.updatedAt).toLocaleDateString()}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </ApolloProvider>
  );
};

export default OurServices;
