export const PRODUCT_QUERY = `
query {
    products{
        data {
        attributes {
          title
          slug
          price
          description
          image {
            data {
              attributes {
                formats
              }
            }
          }
        }
      }
    }
  }
`;

// filter out slug that is equal to the variable
export const GET_PRODUCT_QUERY = `
  query getProduct($slug: String!){
    products(filters: {slug: {eq: $slug}}){
      data {
        attributes {
          title,
          slug,
          description,
          price,
          image {
            data {
              attributes {
                formats
              }
            }
          }
        }
      }
    }
  }
`;
