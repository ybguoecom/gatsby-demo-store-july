import React from 'react'
import { graphql, withPrefix } from 'gatsby'

import SEO from '../components/SEO'
import Photo from '../components/Photo'
import Badge from '../components/Badge'
import AddToCart from '../components/AddToCart'
import useMoltinInventory from '../hooks/useMoltinInventory'
import SocialLinks from '../components/SocialLinks'


function Specs({ dimension, product_weight, capacity }) {
    const spec_style = {'font-weight': 'bold'}
    const value_style = {'text-align': 'right'}
    return (
        <table>
        <tr><td style={spec_style}>Dimension</td><td style={value_style}> { dimension }</td></tr>
        <tr><td style={spec_style}>Product Weight</td><td style={value_style}> { product_weight }kg</td></tr>
        <tr><td style={spec_style}>Capacity</td><td style={value_style}> { capacity }L</td></tr>
        </table>
    )
}

function ProductPage({ data: { product } }) {
  const [inventory, inventoryLoading, inventoryError] = useMoltinInventory(
    product
  )

  const {
    meta: { display_price }
  } = product

  return (
    <React.Fragment>
      <SEO
        type="product"
        title={product.meta_title || product.name}
        description={product.meta_description || product.description}
        image={withPrefix(product.mainImage.childImageSharp.fluid.src)}
      />

      <div className="flex flex-wrap">
        <div className="py-2 md:py-5 md:px-5 w-full lg:w-1/2">
          <div className="sticky pin-t">
            <Photo
              src={product.mainImage}
              alt={product.main_image_alt_text || product.name}
              transparent
            />
          </div>
        </div>

        <div className="py-2 md:py-5 md:px-5 md:pr-10 w-full lg:w-1/2">
          <div className="my-2 flex flex-col md:flex-col-reverse">
            <h1 className="text-3xl md:text-5xl text-black font-normal">
              {product.name}
            </h1>

            <span className="block text-grey text-xl md:my-2 md:mt-8 inline-flex items-center">
              {display_price.without_tax.formatted}
              {product.on_sale && (
                <Badge color="green" className="mx-2">
                  On Sale
                </Badge>
              )}
              {!inventoryError &&
                (inventoryLoading ? (
                  <Badge className="mx-2"> Loading inventory</Badge>
                ) : (
                  <Badge
                    color={inventory.inStock ? 'green' : 'red'}
                    className="mx-2"
                  >
                    {inventory.inStock
                      ? product.manage_stock
                        ? `${inventory.available} in stock `
                        : 'In Stock'
                      : 'Out of stock'}
                  </Badge>
                ))}
            </span>
          </div>

          {inventoryError ? (
            inventoryError
          ) : (
            <div className="flex flex-wrap flex-col md:flex-row md:items-end">
              <AddToCart productId={product.id} disabled={!inventory.inStock} />
            </div>
          )}

          <div className="my-2 md:my-5">
            <h4 className="hidden md:block text-lg text-black font-bold my-2">
              Product Specifications
            </h4>
            <p><Specs dimension={product.dimension} product_weight={product.p_weight} capacity={product.capacity}></Specs></p>
            <h4 className="hidden md:block text-lg text-black font-bold my-2">
              Description
            </h4>
            <p>{product.description}</p>

            <SocialLinks product={product} />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export const query = graphql`
  query($id: String!) {
    product: moltinProduct(id: { eq: $id }) {
      id
      slug
      name
      description
      sku
      mainImage {
        childImageSharp {
          fluid(maxWidth: 560) {
            ...GatsbyImageSharpFluid
          }
        }
        publicURL
      }
      meta {
        display_price {
          without_tax {
            formatted
          }
        }
      }
      manage_stock
      dimension
      capacity
      p_weight
    }
  }
`

export default ProductPage
