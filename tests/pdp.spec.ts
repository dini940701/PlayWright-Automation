import {test,expect } from '../Fixtures/baseFixtures.js';

const search=[
    {searchkey:'macbook',productname:'MacBook Pro',brand:'Apple',productcode: 'Product 18',
        rewardpoints: '800', availability: 'Out Of Stock', price:'$2,000.00', extax: '$2,000.00'},
    {searchkey:'Samsung',productname:'Samsung Galaxy Tab 10.1',productcode: 'SAM1',
        rewardpoints: '1000', availability: 'Pre-Order', price:'$241.99', extax: '$199.99'}
];

for(const productSearch of search){
test(`Verify the product meta data : ${productSearch.searchkey}`,async({homePage})=>{
    const srp=await homePage.doSearch(productSearch.searchkey);
    const pdp=await srp.selectProduct(productSearch.productname);
    const productDetails=await pdp.getProductInformation();
    expect.soft(productDetails.get('Brand')).toBe(productSearch.brand);
    expect.soft(productDetails.get('Product Code')).toBe(productSearch.productcode);
    expect.soft(productDetails.get('Reward Points')).toBe(productSearch.rewardpoints);
    expect.soft(productDetails.get('Availability')).toBe(productSearch.availability);
});
}

for(const productSearch of search){
test(`Verify the product pricing data : ${productSearch.productname}`,async({homePage})=>{
    const srp=await homePage.doSearch(productSearch.searchkey);
    const pdp=await srp.selectProduct(productSearch.productname);
    const productDetails=await pdp.getProductInformation();
    expect.soft(productDetails.get('productprice')).toBe(productSearch.price);
    expect.soft(productDetails.get('extaxprice')).toBe(productSearch.extax);
});
}
