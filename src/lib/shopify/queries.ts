export const PRODUCT_BY_HANDLE = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      featuredImage {
        url
        altText
        width
        height
      }
      metafields(
        identifiers: [
          { namespace: "custom", key: "visor_config_mode" },
          { namespace: "custom", key: "visor_modus" },
          { namespace: "custom", key: "visor_preview_texture_url" },
          { namespace: "custom", key: "preview_gravure_url" },
          { namespace: "custom", key: "product_spin_frames" },
        ]
      ) {
        namespace
        key
        value
        type
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 25) {
        nodes {
          id
          title
          sku
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export const PRODUCTS_FEATURED = `
  query ProductsFeatured($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        tags
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export const COLLECTION_BY_HANDLE = `
  query CollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      title
      description
      products(first: $first, sortKey: CREATED, reverse: true) {
        nodes {
          id
          title
          handle
          tags
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const CART_CREATE = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          nodes {
            quantity
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_CREATE_EMPTY = `
  mutation CartCreateEmpty {
    cartCreate(input: {}) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_GET = `
  query CartGet($id: ID!) {
    cart(id: $id) {
      id
      checkoutUrl
      totalQuantity
      lines(first: 50) {
        nodes {
          id
          quantity
          attributes {
            key
            value
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                title
                handle
              }
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_LINES_ADD = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          nodes {
            quantity
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_DISCOUNT_CODES_UPDATE = `
  mutation CartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]!) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          nodes {
            quantity
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const PRODUCTS_SEARCH = `
  query ProductsSearch($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      nodes {
        id
        handle
        title
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
